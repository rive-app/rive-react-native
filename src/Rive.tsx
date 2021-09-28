import React, { useCallback, useImperativeHandle, useRef } from 'react';
import {
  requireNativeComponent,
  UIManager,
  findNodeHandle,
  ViewStyle,
  NativeSyntheticEvent,
  StyleSheet,
  View,
} from 'react-native';
import { RiveRef, Direction, LoopMode, RNRiveError } from './types';
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

    const play = useCallback<RiveRef['play']>(
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
          UIManager.getViewManagerConfig(VIEW_NAME).Commands.play,
          [animationNamesArray, loop, direction, areStateMachines]
        );
      },
      []
    );

    const pause = useCallback<RiveRef['pause']>(
      (animationNames = [], areStateMachines = false) => {
        const animationNamesArray = Array.isArray(animationNames)
          ? animationNames
          : [animationNames];

        UIManager.dispatchViewManagerCommand(
          findNodeHandle(riveRef.current),
          UIManager.getViewManagerConfig(VIEW_NAME).Commands.pause,
          [animationNamesArray, areStateMachines]
        );
      },
      []
    );

    const stop = useCallback<RiveRef['stop']>(
      (animationNames = [], areStateMachines = false) => {
        const animationNamesArray = Array.isArray(animationNames)
          ? animationNames
          : [animationNames];

        UIManager.dispatchViewManagerCommand(
          findNodeHandle(riveRef.current),
          UIManager.getViewManagerConfig(VIEW_NAME).Commands.stop,
          [animationNamesArray, areStateMachines]
        );
      },
      []
    );

    const reset = useCallback(() => {
      UIManager.dispatchViewManagerCommand(
        findNodeHandle(riveRef.current),
        UIManager.getViewManagerConfig(VIEW_NAME).Commands.reset,
        []
      );
    }, []);

    const fireState = useCallback<RiveRef['fireState']>(
      (triggerStateMachineName, inputName) => {
        UIManager.dispatchViewManagerCommand(
          findNodeHandle(riveRef.current),
          UIManager.getViewManagerConfig(VIEW_NAME).Commands.fireState,
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
            UIManager.getViewManagerConfig(VIEW_NAME).Commands.setBooleanState,
            [triggerStateMachineName, inputName, value]
          );
        } else if (typeof value === 'number') {
          UIManager.dispatchViewManagerCommand(
            findNodeHandle(riveRef.current),
            UIManager.getViewManagerConfig(VIEW_NAME).Commands.setNumberState,
            [triggerStateMachineName, inputName, value]
          );
        }
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
      }),
      [play, pause, stop, reset, setInputState, fireState]
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

        <View style={styles.children}>{children}</View>
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
