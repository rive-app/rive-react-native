import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState
} from 'react';
// This import path isn't handled by @types/react-native
// @ts-ignore
import resolveAssetSource from 'react-native/Libraries/Image/resolveAssetSource';
import {
  requireNativeComponent,
  UIManager,
  findNodeHandle,
  ViewStyle,
  NativeSyntheticEvent,
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  GestureResponderEvent,
  StyleProp,
  NativeModules,
  NativeEventEmitter,
  EmitterSubscription,
} from 'react-native';
import {
  RiveRef,
  Direction,
  LoopMode,
  RNRiveError,
  ViewManagerMethod,
  RiveGeneralEvent,
  RiveOpenUrlEvent,
  RiveRendererInterface,
  FilesHandledMapping,
  RiveAssetPropType,
  RiveRGBA,
  PropertyType,
} from './types';
import { convertErrorFromNativeToRN, XOR } from './helpers';

import { Alignment, Fit } from './types';
import {
  getPropertyTypeString,
  parseColor,
  parsePossibleSources,
} from './utils';

export type PropertyCallback = (value: any) => void;
export class RivePropertyValueEmitter {
  constructor(
    public emitter: NativeEventEmitter,
    public riveRef: React.MutableRefObject<any>
  ) {}

  private nativeSubscriptions: {
    [key: string]: EmitterSubscription;
  } = {};

  private callbacks: {
    [key: string]: PropertyCallback[];
  } = {};

  addListener<T>(
    path: string,
    propertyType: PropertyType,
    callback: (value: T) => void
  ) {
    // "Unique" key for the property listener
    // The key is a combination of the property type and the path
    const key = this.generatePropertyKey(path, propertyType);

    // Registering the callback for this key if it doesn't exist
    // or if the callback is not already registered
    if (!this.callbacks[key]) {
      this.callbacks[key] = [callback];
    } else if (!this.callbacks[key].includes(callback)) {
      this.callbacks[key].push(callback);
    }

    // Registering a native listener for this key if the listener
    // is not already registered
    if (!this.nativeSubscriptions[key]) {
      UIManager.dispatchViewManagerCommand(
        findNodeHandle(this.riveRef.current),
        'registerPropertyListener', // Name of the native command
        [path, getPropertyTypeString(propertyType)]
      );
      let subscription = this.emitter.addListener(key, (value) => {
        // Call all the callbacks registered for this key
        this.callbacks[key]?.forEach((storedCallback) => {
          storedCallback(value);
        });
      });
      this.nativeSubscriptions[key] = subscription;
    }
  }
  generatePropertyKey(path: string, propertyType: PropertyType): string {
    return `${getPropertyTypeString(propertyType)}:${path}`;
  }
  removeListener<T>(
    path: string,
    propertyType: PropertyType,
    callback: (value: T) => void
  ) {
    const key = this.generatePropertyKey(path, propertyType);
    if (this.callbacks[key]) {
      // Remove the callback from the list of callbacks
      this.callbacks[key] = this.callbacks[key].filter(
        (storedCallback) => storedCallback !== callback
      );
      // If there are no more callbacks for this key, remove the native listener
      if (this.callbacks[key].length === 0) {
        this.nativeSubscriptions[key]?.remove();
        delete this.nativeSubscriptions[key];
        delete this.callbacks[key];
      }
    }
  }

  removeListeners() {
    // Unregister all native listeners
    Object.keys(this.nativeSubscriptions).forEach((key) => {
      this.nativeSubscriptions[key]?.remove();
      delete this.nativeSubscriptions[key];
      delete this.callbacks[key];
    });
    // Unregister all callbacks
    Object.keys(this.callbacks).forEach((key) => {
      this.callbacks[key] = [];
    });
    this.nativeSubscriptions = {};
    this.callbacks = {};
  }
}

export function useRiveReady(riveRef: React.RefObject<RiveRef>): boolean {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (riveRef.current) {
      setReady(true);
    }
  }, [riveRef]);

  return ready;
}

export function useRiveBoolean(
  riveRef: React.RefObject<RiveRef>,
  path: string
): [boolean | undefined, (value: boolean) => void] {
  return useRivePropertyListener<boolean>(riveRef, path, PropertyType.Boolean);
}

export function useRiveString(
  riveRef: React.RefObject<RiveRef>,
  path: string
): [string | undefined, (value: string) => void] {
  return useRivePropertyListener<string>(riveRef, path, PropertyType.String);
}

export function useRiveNumber(
  riveRef: React.RefObject<RiveRef>,
  path: string
): [number | undefined, (value: number) => void] {
  return useRivePropertyListener<number>(riveRef, path, PropertyType.Number);
}

export function useRiveEnum(
  riveRef: React.RefObject<RiveRef>,
  path: string
): [string | undefined, (value: string) => void] {
  return useRivePropertyListener<string>(riveRef, path, PropertyType.Enum);
}

export function useRiveColor(
  riveRef: React.RefObject<RiveRef>,
  path: string
): [RiveRGBA | undefined, (value: RiveRGBA) => void] {
  const [color, setColor] = useState<RiveRGBA | undefined>(undefined);

  // Convert integer to RiveRGBA
  const intToRgba = useCallback((colorValue: number): RiveRGBA => {
    const a = (colorValue >> 24) & 0xff;
    const r = (colorValue >> 16) & 0xff;
    const g = (colorValue >> 8) & 0xff;
    const b = colorValue & 0xff;
    return { r, g, b, a };
  }, []);

  // Listener callback to update state
  const listenerCallback = useCallback(
    (newValue: number) => {
      setColor(intToRgba(newValue));
    },
    [intToRgba]
  );

  useEffect(() => {
    const ref = riveRef.current;
    if (!ref) {
      return undefined;
    }

    const listener = ref.internalPropertyListener();
    if (!listener) {
      return undefined;
    }

    listener.addListener<number>(path, PropertyType.Color, listenerCallback);

    return () => {
      listener.removeListener(path, PropertyType.Color, listenerCallback);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, listenerCallback]);

  const setColorPropertyValue = useCallback(
    (newColor: RiveRGBA) => {
      const ref = riveRef.current;
      if (!ref) {
        console.warn('Rive ref is not available to set color property.');
        return;
      }
      ref.setColorPropertyValue(path, newColor);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [path]
  );

  return [color, setColorPropertyValue];
}

function useRivePropertyListener<T>(
  riveRef: React.RefObject<RiveRef>,
  path: string,
  propertyType: PropertyType
): [T | undefined, (value: T) => void] {
  const [value, setValue] = useState<T | undefined>(undefined);

  // Listener callback to update state
  const listenerCallback = useCallback((newValue: T) => {
    setValue(newValue);
  }, []);

  useEffect(() => {
    const ref = riveRef.current;
    if (!ref) {
      return undefined;
    }

    const listener = ref.internalPropertyListener();
    if (!listener) {
      return undefined;
    }

    listener.addListener<T>(path, propertyType, listenerCallback);

    return () => {
      listener.removeListener(path, propertyType, listenerCallback);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, propertyType, listenerCallback]);

  // Setter function
  const setPropertyValue = useCallback(
    (newValue: T) => {
      const ref = riveRef.current;
      if (!ref) {
        console.warn('Rive ref is not available to set property.');
        return;
      }

      switch (propertyType) {
        case PropertyType.Number:
          ref.setNumberPropertyValue(path, newValue as number);
          break;
        case PropertyType.Boolean:
          ref.setBooleanPropertyValue(path, newValue as boolean);
          break;
        case PropertyType.String:
          ref.setStringPropertyValue(path, newValue as string);
          break;
        case PropertyType.Enum:
          ref.setEnumPropertyValue(path, newValue as string);
          break;
        default:
          console.warn(
            `Unsupported property type in generic listener: ${propertyType}`
          );
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [path, propertyType]
  );

  return [value, setPropertyValue];
}

const { RiveReactNativeRendererModule, RiveReactNativeModule } = NativeModules;
const nativeEventEmitter = new NativeEventEmitter(RiveReactNativeModule);

export const RiveRenderer =
  RiveReactNativeRendererModule as RiveRendererInterface;

type RiveProps = {
  onPlay?: (
    event: NativeSyntheticEvent<{
      animationName: string;
      isStateMachine: boolean;
    }>
  ) => void;
  onPause?: (
    event: NativeSyntheticEvent<{
      animationName: string;
      isStateMachine: boolean;
    }>
  ) => void;
  onStop?: (
    event: NativeSyntheticEvent<{
      animationName: string;
      isStateMachine: boolean;
    }>
  ) => void;
  onLoopEnd?: (
    event: NativeSyntheticEvent<{
      animationName: string;
      loopMode: LoopMode;
    }>
  ) => void;
  onStateChanged?: (
    event: NativeSyntheticEvent<{
      stateMachineName: string;
      stateName: string;
    }>
  ) => void;
  onRiveEventReceived?: (
    event: NativeSyntheticEvent<{
      riveEvent: RiveGeneralEvent | RiveOpenUrlEvent;
    }>
  ) => void;
  onError?: (
    event: NativeSyntheticEvent<{
      type: string;
      message: string;
    }>
  ) => void;
  isUserHandlingErrors: boolean;
  autoplay?: boolean;
  fit: Fit;
  layoutScaleFactor?: number;
  alignment: Alignment;
  artboardName?: string;
  referencedAssets?: FilesHandledMapping;
  animationName?: string;
  stateMachineName?: string;
  ref: any;
  resourceName?: string;
  url?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

const VIEW_NAME = 'RiveReactNativeView';

type Props = {
  onPlay?: (animationName: string, isStateMachine: boolean) => void;
  onPause?: (animationName: string, isStateMachine: boolean) => void;
  onStop?: (animationName: string, isStateMachine: boolean) => void;
  onLoopEnd?: (animationName: string, loopMode: LoopMode) => void;
  onStateChanged?: (stateMachineName: string, stateName: string) => void;
  onRiveEventReceived?: (event: RiveGeneralEvent | RiveOpenUrlEvent) => void;
  onError?: (rnRiveError: RNRiveError) => void;
  fit?: Fit;
  layoutScaleFactor?: number;
  style?: ViewStyle;
  testID?: string;
  alignment?: Alignment;
  artboardName?: string;
  /**
   * @experimental This is an experimental feature and may change without a major version update (breaking change).
   */
  referencedAssets?: FilesHandledMapping;
  animationName?: string;
  stateMachineName?: string;
  autoplay?: boolean;
  children?: React.ReactNode;
} & XOR<
  XOR<{ resourceName: string }, { url: string }>,
  { source: number | { uri: string } }
>;

export const RiveViewManager = requireNativeComponent<RiveProps>(VIEW_NAME);

const RiveContainer = React.forwardRef<RiveRef, Props>(
  (
    {
      children,
      onPlay,
      onPause,
      onStop,
      onLoopEnd,
      onStateChanged,
      onRiveEventReceived,
      onError,
      style,
      autoplay = true,
      resourceName: resourceNameProp,
      url: urlProp,
      alignment = Alignment.Center,
      fit = Fit.Contain,
      layoutScaleFactor,
      artboardName,
      referencedAssets: referencedAssets,
      animationName,
      source,
      stateMachineName,
      testID,
    },
    ref
  ) => {
    const assetID = typeof source === 'number' ? source : null;
    const sourceURI = typeof source === 'object' ? source.uri : null;
    const { resourceName, url } = useMemo(() => {
      if (resourceNameProp) {
        return { resourceName: resourceNameProp };
      }

      if (urlProp) {
        return { url: urlProp };
      }

      const assetURI = assetID ? resolveAssetSource(assetID)?.uri : sourceURI;

      if (!assetURI) {
        return {};
      }

      // handle http address and dev server
      if (assetURI.match(/https?:\/\//)) {
        return { url: assetURI };
      }

      // handle iOS bundled asset
      if (assetURI.match(/file:\/\//)) {
        // strip resource name from file path
        return { resourceName: assetURI.match(/file:\/\/(.*\/)+(.*)\.riv/)[2] };
      }

      // handle Android bundled asset or resource name uri
      return {
        resourceName: assetURI,
      };
    }, [assetID, sourceURI, resourceNameProp, urlProp]);
    if (!resourceName && !url) {
      throw new Error(
        'Invalid Rive resource. Please provide a valid resource.'
      );
    }

    const riveRef = useRef(null);

    const isUserHandlingErrors = onError !== undefined;

    const onPlayHandler = useCallback(
      (
        event: NativeSyntheticEvent<{
          animationName: string;
          isStateMachine: boolean;
        }>
      ) => {
        const { animationName: eventAnimationName, isStateMachine } =
          event.nativeEvent;
        onPlay?.(eventAnimationName, isStateMachine);
      },
      [onPlay]
    );

    const onPauseHandler = useCallback(
      (
        event: NativeSyntheticEvent<{
          animationName: string;
          isStateMachine: boolean;
        }>
      ) => {
        const { animationName: eventAnimationName, isStateMachine } =
          event.nativeEvent;
        onPause?.(eventAnimationName, isStateMachine);
      },
      [onPause]
    );

    const onStopHandler = useCallback(
      (
        event: NativeSyntheticEvent<{
          animationName: string;
          isStateMachine: boolean;
        }>
      ) => {
        const { animationName: eventAnimationName, isStateMachine } =
          event.nativeEvent;
        onStop?.(eventAnimationName, isStateMachine);
      },
      [onStop]
    );

    const onLoopEndHandler = useCallback(
      (
        event: NativeSyntheticEvent<{
          animationName: string;
          loopMode: LoopMode;
        }>
      ) => {
        const { animationName: eventAnimationName, loopMode } =
          event.nativeEvent;
        onLoopEnd?.(eventAnimationName, loopMode);
      },
      [onLoopEnd]
    );

    const onStateChangedHandler = useCallback(
      (
        event: NativeSyntheticEvent<{
          stateMachineName: string;
          stateName: string;
        }>
      ) => {
        const { stateMachineName: eventStateMachineName, stateName } =
          event.nativeEvent;
        onStateChanged?.(eventStateMachineName, stateName);
      },
      [onStateChanged]
    );

    const onRiveEventReceivedHandler = useCallback(
      (
        event: NativeSyntheticEvent<{
          riveEvent: RiveGeneralEvent | RiveOpenUrlEvent;
        }>
      ) => {
        const { riveEvent } = event.nativeEvent;
        onRiveEventReceived?.(riveEvent);
      },
      [onRiveEventReceived]
    );

    const onErrorHandler = useCallback(
      (event: NativeSyntheticEvent<{ type: string; message: string }>) => {
        const { type, message } = event.nativeEvent;
        const rnRiveError = convertErrorFromNativeToRN({ type, message });
        if (rnRiveError !== null) {
          onError?.(rnRiveError);
        }
      },
      [onError]
    );

    const play = useCallback<RiveRef[ViewManagerMethod.play]>(
      (
        animationName = '',
        loop = LoopMode.Auto,
        direction = Direction.Auto,
        isStateMachine = false
      ) => {
        UIManager.dispatchViewManagerCommand(
          findNodeHandle(riveRef.current),
          ViewManagerMethod.play,
          [animationName, loop, direction, isStateMachine]
        );
      },
      []
    );

    const pause = useCallback<RiveRef[ViewManagerMethod.pause]>(() => {
      UIManager.dispatchViewManagerCommand(
        findNodeHandle(riveRef.current),
        ViewManagerMethod.pause,
        []
      );
    }, []);

    const stop = useCallback<RiveRef[ViewManagerMethod.stop]>(() => {
      UIManager.dispatchViewManagerCommand(
        findNodeHandle(riveRef.current),
        ViewManagerMethod.stop,
        []
      );
    }, []);

    const reset = useCallback(() => {
      UIManager.dispatchViewManagerCommand(
        findNodeHandle(riveRef.current),
        ViewManagerMethod.reset,
        []
      );
    }, []);

    const fireState = useCallback<RiveRef[ViewManagerMethod.fireState]>(
      (triggerStateMachineName, inputName) => {
        UIManager.dispatchViewManagerCommand(
          findNodeHandle(riveRef.current),
          ViewManagerMethod.fireState,
          [triggerStateMachineName, inputName]
        );
      },
      []
    );

    const setInputState = useCallback<RiveRef['setInputState']>(
      (triggerStateMachineName, inputName, value) => {
        if (typeof value === 'boolean') {
          UIManager.dispatchViewManagerCommand(
            findNodeHandle(riveRef.current),
            ViewManagerMethod.setBooleanState,
            [triggerStateMachineName, inputName, value]
          );
        } else if (typeof value === 'number') {
          UIManager.dispatchViewManagerCommand(
            findNodeHandle(riveRef.current),
            ViewManagerMethod.setNumberState,
            [triggerStateMachineName, inputName, value]
          );
        }
      },
      []
    );

    const getBooleanState = useCallback<RiveRef['getBooleanState']>(
      async (inputName): Promise<boolean | null> => {
        try {
          const result = await RiveReactNativeModule.getBooleanState(
            findNodeHandle(riveRef.current),
            inputName
          );
          return result;
        } catch (error) {
          console.error(
            `Error getting boolean state for input: ${inputName}`,
            error
          );
          return null;
        }
      },
      []
    );

    const getNumberState = useCallback<RiveRef['getNumberState']>(
      async (inputName): Promise<number | null> => {
        try {
          const result = await RiveReactNativeModule.getNumberState(
            findNodeHandle(riveRef.current),
            inputName
          );
          return result;
        } catch (error) {
          console.error(
            `Error getting number state for input: ${inputName}`,
            error
          );
          return null;
        }
      },
      []
    );

    const getBooleanStateAtPath = useCallback<RiveRef['getBooleanStateAtPath']>(
      async (inputName, path): Promise<boolean | null> => {
        try {
          const result = await RiveReactNativeModule.getBooleanStateAtPath(
            findNodeHandle(riveRef.current),
            inputName,
            path
          );
          return result;
        } catch (error) {
          console.error(
            `Error getting boolean state for input: ${inputName} at path: ${path}`,
            error
          );
          return null;
        }
      },
      []
    );

    const getNumberStateAtPath = useCallback<RiveRef['getNumberStateAtPath']>(
      async (inputName, path): Promise<number | null> => {
        try {
          const result = await RiveReactNativeModule.getNumberStateAtPath(
            findNodeHandle(riveRef.current),
            inputName,
            path
          );
          return result;
        } catch (error) {
          console.error(
            `Error getting number state for input: ${inputName} at path: ${path}`,
            error
          );
          return null;
        }
      },
      []
    );

    const fireStateAtPath = useCallback<
      RiveRef[ViewManagerMethod.fireStateAtPath]
    >((inputName, path) => {
      UIManager.dispatchViewManagerCommand(
        findNodeHandle(riveRef.current),
        ViewManagerMethod.fireStateAtPath,
        [inputName, path]
      );
    }, []);

    const setInputStateAtPath = useCallback<RiveRef['setInputStateAtPath']>(
      (inputName, value, path) => {
        if (typeof value === 'boolean') {
          UIManager.dispatchViewManagerCommand(
            findNodeHandle(riveRef.current),
            ViewManagerMethod.setBooleanStateAtPath,
            [inputName, value, path]
          );
        } else if (typeof value === 'number') {
          UIManager.dispatchViewManagerCommand(
            findNodeHandle(riveRef.current),
            ViewManagerMethod.setNumberStateAtPath,
            [inputName, value, path]
          );
        }
      },
      []
    );

    const touchBegan = useCallback<RiveRef[ViewManagerMethod.touchBegan]>(
      (x: number, y: number) => {
        if (!isNaN(x) && !isNaN(y)) {
          UIManager.dispatchViewManagerCommand(
            findNodeHandle(riveRef.current),
            ViewManagerMethod.touchBegan,
            [x, y]
          );
        }
      },
      []
    );

    const touchEnded = useCallback<RiveRef[ViewManagerMethod.touchEnded]>(
      (x: number, y: number) => {
        if (!isNaN(x) && !isNaN(y)) {
          UIManager.dispatchViewManagerCommand(
            findNodeHandle(riveRef.current),
            ViewManagerMethod.touchEnded,
            [x, y]
          );
        }
      },
      []
    );

    const setTextRunValue = useCallback<
      RiveRef[ViewManagerMethod.setTextRunValue]
    >((textRunName: string, textValue: string) => {
      if (textRunName) {
        UIManager.dispatchViewManagerCommand(
          findNodeHandle(riveRef.current),
          ViewManagerMethod.setTextRunValue,
          [textRunName, textValue]
        );
      }
    }, []);

    const setTextRunValueAtPath = useCallback<
      RiveRef[ViewManagerMethod.setTextRunValueAtPath]
    >((textRunName: string, textValue: string, path: string) => {
      if (textRunName) {
        UIManager.dispatchViewManagerCommand(
          findNodeHandle(riveRef.current),
          ViewManagerMethod.setTextRunValueAtPath,
          [textRunName, textValue, path]
        );
      }
    }, []);

    const setBooleanPropertyValue = useCallback<
      RiveRef['setBooleanPropertyValue']
    >((path: string, value: boolean) => {
      UIManager.dispatchViewManagerCommand(
        findNodeHandle(riveRef.current),
        ViewManagerMethod.setBooleanPropertyValue,
        [path, value]
      );
    }, []);

    const setStringPropertyValue = useCallback<
      RiveRef['setStringPropertyValue']
    >((path: string, value: String) => {
      UIManager.dispatchViewManagerCommand(
        findNodeHandle(riveRef.current),
        ViewManagerMethod.setStringPropertyValue,
        [path, value]
      );
    }, []);

    const setNumberPropertyValue = useCallback<
      RiveRef['setNumberPropertyValue']
    >((path: string, value: number) => {
      UIManager.dispatchViewManagerCommand(
        findNodeHandle(riveRef.current),
        ViewManagerMethod.setNumberPropertyValue,
        [path, value]
      );
    }, []);

    const setColorPropertyValue = useCallback<RiveRef['setColorPropertyValue']>(
      (path: string, color: RiveRGBA | string) => {
        let parsedColor = typeof color === 'string' ? parseColor(color) : color;
        UIManager.dispatchViewManagerCommand(
          findNodeHandle(riveRef.current),
          ViewManagerMethod.setColorPropertyValue,
          [path, parsedColor.r, parsedColor.g, parsedColor.b, parsedColor.a]
        );
      },
      []
    );

    const setEnumPropertyValue = useCallback<RiveRef['setEnumPropertyValue']>(
      (path: string, value: string) => {
        UIManager.dispatchViewManagerCommand(
          findNodeHandle(riveRef.current),
          ViewManagerMethod.setEnumPropertyValue,
          [path, value]
        );
      },
      []
    );

    const fireTriggerProperty = useCallback<RiveRef['fireTriggerProperty']>(
      (path: string) => {
        UIManager.dispatchViewManagerCommand(
          findNodeHandle(riveRef.current),
          ViewManagerMethod.fireTriggerProperty,
          [path]
        );
      },
      []
    );

    const internalPropertyListener = useCallback<
      RiveRef['internalPropertyListener']
    >(() => {
      if (!riveRef.current._propertyEmitter) {
        riveRef.current._propertyEmitter = new RivePropertyValueEmitter(
          nativeEventEmitter,
          riveRef
        );
      }
      return riveRef.current._propertyEmitter;
    }, [riveRef]);

    useImperativeHandle(
      ref,
      () => ({
        setInputState,
        getBooleanState,
        getBooleanStateAtPath,
        getNumberState,
        getNumberStateAtPath,
        setInputStateAtPath,
        fireState,
        fireStateAtPath,
        play,
        pause,
        stop,
        reset,
        touchBegan,
        touchEnded,
        setTextRunValue,
        setTextRunValueAtPath,
        setBooleanPropertyValue,
        setStringPropertyValue,
        setNumberPropertyValue,
        setColorPropertyValue,
        setEnumPropertyValue,
        fireTriggerProperty,
        internalPropertyListener,
      }),
      [
        play,
        pause,
        stop,
        reset,
        setInputState,
        getBooleanState,
        getBooleanStateAtPath,
        getNumberState,
        getNumberStateAtPath,
        setInputStateAtPath,
        fireState,
        fireStateAtPath,
        touchBegan,
        touchEnded,
        setTextRunValue,
        setTextRunValueAtPath,
        setBooleanPropertyValue,
        setStringPropertyValue,
        setNumberPropertyValue,
        setColorPropertyValue,
        setEnumPropertyValue,
        fireTriggerProperty,
        internalPropertyListener,
      ]
    );

    function transformFilesHandledMapping(
      mapping?: FilesHandledMapping
    ): FilesHandledMapping | undefined {
      const transformedMapping: FilesHandledMapping = {};
      if (mapping === undefined) {
        return undefined;
      }

      Object.keys(mapping).forEach((key) => {
        const option = mapping[key];
        transformedMapping[key] = {
          ...option,
          source: parsePossibleSources(option.source as RiveAssetPropType),
        };
      });

      return transformedMapping;
    }

    const convertedAssetHandledSources =
      transformFilesHandledMapping(referencedAssets);

    return (
      <View style={[styles.container, style]} ref={ref as any} testID={testID}>
        <View style={styles.children}>{children}</View>
        <TouchableWithoutFeedback
          onPressIn={(event: GestureResponderEvent) =>
            touchBegan(event.nativeEvent.locationX, event.nativeEvent.locationY)
          }
          onPressOut={(event: GestureResponderEvent) =>
            touchEnded(event.nativeEvent.locationX, event.nativeEvent.locationY)
          }
        >
          <RiveViewManager
            ref={riveRef}
            resourceName={resourceName}
            isUserHandlingErrors={isUserHandlingErrors}
            autoplay={autoplay}
            fit={fit}
            layoutScaleFactor={layoutScaleFactor}
            url={url}
            style={styles.animation}
            onPlay={onPlayHandler}
            onPause={onPauseHandler}
            onStop={onStopHandler}
            onLoopEnd={onLoopEndHandler}
            onStateChanged={onStateChangedHandler}
            onRiveEventReceived={onRiveEventReceivedHandler}
            onError={onErrorHandler}
            alignment={alignment}
            artboardName={artboardName}
            referencedAssets={convertedAssetHandledSources}
            animationName={animationName}
            stateMachineName={stateMachineName}
          />
        </TouchableWithoutFeedback>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  children: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  container: {
    flexGrow: 1,
  },
  animation: {
    flex: 1,
  },
});

export default RiveContainer;
