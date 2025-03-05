import React, { useCallback, useImperativeHandle, useRef } from 'react';
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
} from './types';
import { convertErrorFromNativeToRN, XOR } from './helpers';

import { Alignment, Fit } from './types';
import { parsePossibleSources } from './utils';

const { RiveReactNativeRendererModule } = NativeModules;

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
} & XOR<{ resourceName: string }, { url: string }>;

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
      resourceName,
      url,
      alignment = Alignment.Center,
      fit = Fit.Contain,
      layoutScaleFactor,
      artboardName,
      referencedAssets: referencedAssets,
      animationName,
      stateMachineName,
      testID,
    },
    ref
  ) => {
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
        animName = '',
        loop = LoopMode.Auto,
        direction = Direction.Auto,
        isStateMachine = false
      ) => {
        UIManager.dispatchViewManagerCommand(
          findNodeHandle(riveRef.current),
          ViewManagerMethod.play,
          [animName, loop, direction, isStateMachine]
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

    useImperativeHandle(
      ref,
      () => ({
        setInputState,
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
      }),
      [
        play,
        pause,
        stop,
        reset,
        setInputState,
        setInputStateAtPath,
        fireState,
        fireStateAtPath,
        touchBegan,
        touchEnded,
        setTextRunValue,
        setTextRunValueAtPath,
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
      // @ts-expect-error JSX error ( becuase react-native is a peerDependency)
      <View style={[styles.container, style]} ref={ref as any} testID={testID}>
        {/* @ts-expect-error JSX error */}
        <View style={styles.children}>{children}</View>
        {/* @ts-expect-error JSX error */}
        <TouchableWithoutFeedback
          onPressIn={(event: GestureResponderEvent) =>
            touchBegan(event.nativeEvent.locationX, event.nativeEvent.locationY)
          }
          onPressOut={(event: GestureResponderEvent) =>
            touchEnded(event.nativeEvent.locationX, event.nativeEvent.locationY)
          }
        >
          {/* @ts-expect-error JSX error */}
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
