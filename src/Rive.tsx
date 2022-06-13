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
} from 'react-native';
import {
  RiveRef,
  Direction,
  LoopMode,
  RNRiveError,
  ViewManagerMethod,
} from './types';
import { convertErrorFromNativeToRN, XOR } from './helpers';

import { Alignment, Fit } from './types';

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
  onError?: (
    event: NativeSyntheticEvent<{
      type: string;
      message: string;
    }>
  ) => void;
  isUserHandlingErrors: boolean;
  autoplay?: boolean;
  fit: Fit;
  alignment: Alignment;
  artboardName?: string;
  animationName?: string;
  stateMachineName?: string;
  ref: any;
  resourceName?: string;
  url?: string;
  style?: ViewStyle;
  testID?: string;
};

const VIEW_NAME = 'RiveReactNativeView';

type Props = {
  onPlay?: (animationName: string, isStateMachine: boolean) => void;
  onPause?: (animationName: string, isStateMachine: boolean) => void;
  onStop?: (animationName: string, isStateMachine: boolean) => void;
  onLoopEnd?: (animationName: string, loopMode: LoopMode) => void;
  onStateChanged?: (stateMachineName: string, stateName: string) => void;
  onError?: (rnRiveError: RNRiveError) => void;
  fit?: Fit;
  style?: ViewStyle;
  testID?: string;
  alignment?: Alignment;
  artboardName?: string;
  animationName?: string;
  stateMachineName?: string;
  autoplay?: boolean;
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
      onError,
      style,
      autoplay = true,
      resourceName,
      url,
      alignment = Alignment.Center,
      fit = Fit.Contain,
      artboardName,
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
        animationNames = [],
        loop = LoopMode.Auto,
        direction = Direction.Auto,
        areStateMachines = false
      ) => {
        const animationNamesArray = Array.isArray(animationNames)
          ? animationNames
          : [animationNames];

        UIManager.dispatchViewManagerCommand(
          findNodeHandle(riveRef.current),
          ViewManagerMethod.play,
          [animationNamesArray, loop, direction, areStateMachines]
        );
      },
      []
    );

    const pause = useCallback<RiveRef[ViewManagerMethod.pause]>(
      (animationNames = [], areStateMachines = false) => {
        const animationNamesArray = Array.isArray(animationNames)
          ? animationNames
          : [animationNames];

        UIManager.dispatchViewManagerCommand(
          findNodeHandle(riveRef.current),
          ViewManagerMethod.pause,
          [animationNamesArray, areStateMachines]
        );
      },
      []
    );

    const stop = useCallback<RiveRef[ViewManagerMethod.stop]>(
      (animationNames = [], areStateMachines = false) => {
        const animationNamesArray = Array.isArray(animationNames)
          ? animationNames
          : [animationNames];

        UIManager.dispatchViewManagerCommand(
          findNodeHandle(riveRef.current),
          ViewManagerMethod.stop,
          [animationNamesArray, areStateMachines]
        );
      },
      []
    );

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

    const touchBegan = useCallback<RiveRef[ViewManagerMethod.touchBegan]>(
      (x: Number, y: Number) => {
        UIManager.dispatchViewManagerCommand(
          findNodeHandle(riveRef.current),
          ViewManagerMethod.touchBegan,
          [x, y]
        );
      },
      []
    );

    const touchEnded = useCallback<RiveRef[ViewManagerMethod.touchEnded]>(
      (x: Number, y: Number) => {
        UIManager.dispatchViewManagerCommand(
          findNodeHandle(riveRef.current),
          ViewManagerMethod.touchEnded,
          [x, y]
        );
      },
      []
    );

    useImperativeHandle(
      ref,
      () => ({
        setInputState,
        fireState,
        play,
        pause,
        stop,
        reset,
        touchBegan,
        touchEnded,
      }),
      [
        play,
        pause,
        stop,
        reset,
        setInputState,
        fireState,
        touchBegan,
        touchEnded,
      ]
    );

    return (
      <View style={[styles.container, style]} ref={ref as any} testID={testID}>
        <RiveViewManager
          ref={riveRef}
          resourceName={resourceName}
          isUserHandlingErrors={isUserHandlingErrors}
          autoplay={autoplay}
          fit={fit}
          url={url}
          style={styles.animation}
          onPlay={onPlayHandler}
          onPause={onPauseHandler}
          onStop={onStopHandler}
          onLoopEnd={onLoopEndHandler}
          onStateChanged={onStateChangedHandler}
          onError={onErrorHandler}
          alignment={alignment}
          artboardName={artboardName}
          animationName={animationName}
          stateMachineName={stateMachineName}
        />

        <TouchableWithoutFeedback
          onPressIn={(event: GestureResponderEvent) =>
            touchBegan(event.nativeEvent.locationX, event.nativeEvent.locationY)
          }
          onPressOut={(event: GestureResponderEvent) =>
            touchEnded(event.nativeEvent.locationX, event.nativeEvent.locationY)
          }
        >
          <View style={styles.animation}>{children}</View>
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
