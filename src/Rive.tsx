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
  Platform,
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
  DataBindBy,
  AutoBind,
} from './types';
import { convertErrorFromNativeToRN, XOR } from './helpers';

import { Alignment, Fit } from './types';
import {
  getPropertyTypeString,
  intToRiveRGBA,
  parseColor,
  parsePossibleSources,
} from './utils';

export type PropertyCallback = (value: any) => void;
export class RiveNativeEventEmitter {
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
    reactTag: number | null,
    callback: (value: T) => void
  ) {
    // const reactTag = findNodeHandle(this.riveRef.current);
    if (!reactTag) {
      console.warn(
        '[Rive] RiveRef viewTag is null. Cannot register property listener.'
      );
      return;
    }
    // "Unique" key for the property listener
    // The key is a combination of the property type and the path
    const key = this.generatePropertyKey(path, propertyType, reactTag);

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
      let subscription = this.emitter.addListener(key, (value) => {
        // Call all the callbacks registered for this key
        this.callbacks[key]?.forEach((storedCallback) => {
          storedCallback(value);
        });
      });
      UIManager.dispatchViewManagerCommand(
        reactTag,
        'registerPropertyListener', // Name of the native command
        [path, getPropertyTypeString(propertyType)]
      );
      this.nativeSubscriptions[key] = subscription;
    }
  }
  generatePropertyKey(
    path: string,
    propertyType: PropertyType,
    reactTag: number
  ): string {
    return `${getPropertyTypeString(propertyType)}:${path}:${reactTag}`;
  }
  removeListener<T>(
    path: string,
    propertyType: PropertyType,
    reactTag: number | null,
    callback: (value: T) => void
  ) {
    if (!reactTag) {
      console.warn(
        '[Rive] RiveRef viewTag is null. Cannot unregister property listener.'
      );
      return;
    }
    const key = this.generatePropertyKey(path, propertyType, reactTag);
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
}

export function useRive(): [(node: RiveRef) => void, RiveRef | null] {
  const [ref, setRef] = useState<RiveRef | null>(null);

  const setRiveRef = useCallback<(node: RiveRef) => void>((node) => {
    if (!node || !node.internalNativeEmitter) {
      return;
    }
    let viewTag = node.viewTag();
    if (viewTag === null) {
      console.warn('[Rive] RiveRef viewTag is null.');
      return;
    }

    const nativeEmitter = node.internalNativeEmitter();
    if (!nativeEmitter) {
      console.warn('[Rive] Native event emitter is not initialized.');
      return;
    }

    // A listener that is called when the native view is loaded and Rive
    // is ready to be used.
    const subscription = nativeEmitter.emitter.addListener(
      `RiveReactNativeLoaded:${viewTag}`,
      () => {
        setRef(node);
        subscription.remove(); // Remove the listener after the event is reported
      }
    );
  }, []);

  return [setRiveRef, ref];
}

export function useRiveBoolean(
  riveRef: RiveRef | null,
  path: string
): [boolean | undefined, (value: boolean) => void] {
  return useRivePropertyListener<boolean>(riveRef, path, PropertyType.Boolean);
}

export function useRiveString(
  riveRef: RiveRef | null,
  path: string
): [string | undefined, (value: string) => void] {
  return useRivePropertyListener<string>(riveRef, path, PropertyType.String);
}

export function useRiveNumber(
  riveRef: RiveRef | null,
  path: string
): [number | undefined, (value: number) => void] {
  return useRivePropertyListener<number>(riveRef, path, PropertyType.Number);
}

export function useRiveEnum(
  riveRef: RiveRef | null,
  path: string
): [string | undefined, (value: string) => void] {
  return useRivePropertyListener<string>(riveRef, path, PropertyType.Enum);
}

export function useRiveColor(
  riveRef: RiveRef | null,
  path: string
): [RiveRGBA | undefined, (value: RiveRGBA | string) => void] {
  return useRivePropertyListener<RiveRGBA>(riveRef, path, PropertyType.Color);
}

function useRivePropertyListener<T>(
  riveRef: RiveRef | null,
  path: string,
  propertyType: PropertyType
): [T | undefined, (value: T) => void] {
  const [value, setValue] = useState<T | undefined>(undefined);

  // Listener callback to update state for non-color properties
  const listenerCallback = useCallback((newValue: T) => {
    setValue(newValue);
  }, []);

  // Listener callback to update state for color properties
  const listenerCallbackWithColor = useCallback((newValue: number) => {
    const rgbaValue = intToRiveRGBA(newValue);
    setValue(rgbaValue as T);
  }, []);

  useEffect(() => {
    const listener = riveRef?.internalNativeEmitter?.();
    if (!listener) return () => {};
    const reactTag = findNodeHandle(riveRef.viewTag());
    if (propertyType === PropertyType.Color) {
      listener.addListener<number>(
        path,
        propertyType,
        reactTag,
        listenerCallbackWithColor
      );
      return () => {
        listener.removeListener<number>(
          path,
          propertyType,
          reactTag,
          listenerCallbackWithColor
        );
      };
    } else {
      listener.addListener<T>(path, propertyType, reactTag, listenerCallback);
      return () => {
        listener.removeListener<T>(
          path,
          propertyType,
          reactTag,
          listenerCallback
        );
      };
    }
  }, [
    riveRef,
    path,
    propertyType,
    listenerCallback,
    listenerCallbackWithColor,
  ]);

  // Setter function
  const setPropertyValue = useCallback(
    (newValue: T) => {
      if (!riveRef) {
        if (__DEV__) {
          console.warn(
            `[Rive] Tried to set property "${path}" before riveRef was available.`
          );
        }
        return;
      }

      switch (propertyType) {
        case PropertyType.Number:
          riveRef.setNumber(path, newValue as number);
          break;
        case PropertyType.Boolean:
          riveRef.setBoolean(path, newValue as boolean);
          break;
        case PropertyType.String:
          riveRef.setString(path, newValue as string);
          break;
        case PropertyType.Enum:
          riveRef.setEnum(path, newValue as string);
          break;
        case PropertyType.Color:
          const parsedColor =
            typeof newValue === 'string' ? parseColor(newValue) : newValue;
          riveRef.setColor(path, parsedColor as RiveRGBA);
          break;
        default:
          if (__DEV__) {
            console.warn(
              `[Rive] Unsupported property type in generic listener: ${propertyType}`
            );
          }
      }
    },
    [riveRef, path, propertyType]
  );

  return [value, setPropertyValue];
}

const {
  RiveReactNativeRendererModule,
  RiveReactNativeModule,
  RiveReactNativeEventModule,
} = NativeModules;
const nativeEventEmitter =
  Platform.OS === 'android'
    ? new NativeEventEmitter() // Not needed for Android
    : new NativeEventEmitter(RiveReactNativeEventModule);

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
  dataBinding?: DataBindBy;
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
  dataBinding?: DataBindBy;
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
      dataBinding = AutoBind(false),
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

    const setBoolean = useCallback<RiveRef['setBoolean']>(
      (path: string, value: boolean) => {
        UIManager.dispatchViewManagerCommand(
          findNodeHandle(riveRef.current),
          ViewManagerMethod.setBooleanPropertyValue,
          [path, value]
        );
      },
      []
    );

    const setString = useCallback<RiveRef['setString']>(
      (path: string, value: String) => {
        UIManager.dispatchViewManagerCommand(
          findNodeHandle(riveRef.current),
          ViewManagerMethod.setStringPropertyValue,
          [path, value]
        );
      },
      []
    );

    const setNumber = useCallback<RiveRef['setNumber']>(
      (path: string, value: number) => {
        UIManager.dispatchViewManagerCommand(
          findNodeHandle(riveRef.current),
          ViewManagerMethod.setNumberPropertyValue,
          [path, value]
        );
      },
      []
    );

    const setColor = useCallback<RiveRef['setColor']>(
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

    const setEnum = useCallback<RiveRef['setEnum']>(
      (path: string, value: string) => {
        UIManager.dispatchViewManagerCommand(
          findNodeHandle(riveRef.current),
          ViewManagerMethod.setEnumPropertyValue,
          [path, value]
        );
      },
      []
    );

    const trigger = useCallback<RiveRef['trigger']>((path: string) => {
      UIManager.dispatchViewManagerCommand(
        findNodeHandle(riveRef.current),
        ViewManagerMethod.fireTriggerProperty,
        [path]
      );
    }, []);

    const internalNativeEmitter = useCallback<
      RiveRef['internalNativeEmitter']
    >(() => {
      if (!riveRef.current._propertyEmitter) {
        riveRef.current._propertyEmitter = new RiveNativeEventEmitter(
          nativeEventEmitter,
          riveRef
        );
      }
      return riveRef.current._propertyEmitter;
    }, [riveRef]);

    const viewTag = useCallback<RiveRef['viewTag']>(() => {
      return findNodeHandle(riveRef.current);
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
        setBoolean,
        setString,
        setNumber,
        setColor,
        setEnum,
        trigger,
        internalNativeEmitter,
        viewTag,
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
        setBoolean,
        setString,
        setNumber,
        setColor,
        setEnum,
        trigger,
        internalNativeEmitter,
        viewTag,
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
            dataBinding={dataBinding}
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
