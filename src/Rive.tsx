import React, { useCallback, useImperativeHandle, useRef } from 'react';
import {
  requireNativeComponent,
  UIManager,
  findNodeHandle,
  ViewStyle,
  NativeSyntheticEvent,
} from 'react-native';
import { RiveRef, Direction, LoopMode } from './types';
import type { XOR } from './helpers';

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
      isStateMachine: boolean;
    }>
  ) => void;
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
  onLoopEnd?: (animationName: string, isStateMachine: boolean) => void;
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
      onPlay,
      onPause,
      onStop,
      onLoopEnd,
      style,
      autoplay = true,
      resourceName,
      url,
      alignment = Alignment.Center,
      fit = Fit.Contain,
      artboardName,
      animationName,
      stateMachineName,
    },
    ref
  ) => {
    const riveRef = useRef(null);

    const onPlayHandler = useCallback(
      (
        event: NativeSyntheticEvent<{
          animationName: string;
          isStateMachine: boolean;
        }>
      ) => {
        const { animationName, isStateMachine } = event.nativeEvent;
        onPlay?.(animationName, isStateMachine);
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
        const { animationName, isStateMachine } = event.nativeEvent;
        onPause?.(animationName, isStateMachine);
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
        const { animationName, isStateMachine } = event.nativeEvent;
        onStop?.(animationName, isStateMachine);
      },
      [onStop]
    );

    const onLoopEndHandler = useCallback(
      (
        event: NativeSyntheticEvent<{
          animationName: string;
          isStateMachine: boolean;
        }>
      ) => {
        const { animationName, isStateMachine } = event.nativeEvent;
        onLoopEnd?.(animationName, isStateMachine);
      },
      [onLoopEnd]
    );

    const play = useCallback<RiveRef['play']>(
      (
        animationNames = [],
        loop = LoopMode.None,
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

    const stop = useCallback(() => {
      UIManager.dispatchViewManagerCommand(
        findNodeHandle(riveRef.current),
        UIManager.getViewManagerConfig(VIEW_NAME).Commands.stop,
        []
      );
    }, []);

    const reset = useCallback(() => {
      UIManager.dispatchViewManagerCommand(
        findNodeHandle(riveRef.current),
        UIManager.getViewManagerConfig(VIEW_NAME).Commands.reset,
        []
      );
    }, []);

    useImperativeHandle(
      ref,
      () => ({
        play,
        pause,
        stop,
        reset,
      }),
      [play, pause, stop, reset]
    );

    return (
      <RiveViewManager
        style={style}
        ref={riveRef}
        resourceName={resourceName}
        autoplay={autoplay}
        fit={fit}
        url={url}
        onPlay={onPlayHandler}
        onPause={onPauseHandler}
        onStop={onStopHandler}
        onLoopEnd={onLoopEndHandler}
        alignment={alignment}
        artboardName={artboardName}
        animationName={animationName}
        stateMachineName={stateMachineName}
      />
    );
  }
);

export default RiveContainer;
