import React, { useCallback, useImperativeHandle, useRef } from 'react';
import {
  requireNativeComponent,
  UIManager,
  findNodeHandle,
  ViewStyle,
} from 'react-native';
import type { RiveRef } from './types';
import type { XOR } from './helpers';

import { Alignment, Fit } from './types';

type RiveProps = {
  fit: Fit;
  style?: ViewStyle;
  resourceName?: string;
  url?: string;
  ref: any;
  testID?: string;
  alignment: Alignment;
};

const VIEW_NAME = 'RiveReactNativeView';

type Props = {
  fit?: Fit;
  style?: ViewStyle;
  testID?: string;
  alignment?: Alignment;
} & XOR<{ resourceName: string }, { url: string }>;

export const RiveViewManager = requireNativeComponent<RiveProps>(VIEW_NAME);

const RiveContainer = React.forwardRef<RiveRef, Props>(
  (
    {
      style,
      resourceName,
      url,
      alignment = Alignment.Center,
      fit = Fit.Contain,
    },
    ref
  ) => {
    const riveRef = useRef(null);
    const play = useCallback(() => {
      UIManager.dispatchViewManagerCommand(
        findNodeHandle(riveRef.current),
        UIManager.getViewManagerConfig(VIEW_NAME).Commands.play,
        []
      );
    }, []);

    const pause = useCallback(() => {
      UIManager.dispatchViewManagerCommand(
        findNodeHandle(riveRef.current),
        UIManager.getViewManagerConfig(VIEW_NAME).Commands.pause,
        []
      );
    }, []);

    const stop = useCallback(() => {
      UIManager.dispatchViewManagerCommand(
        findNodeHandle(riveRef.current),
        UIManager.getViewManagerConfig(VIEW_NAME).Commands.stop,
        []
      );
    }, []);

    useImperativeHandle(
      ref,
      () => ({
        play,
        pause,
        stop,
      }),
      [play, pause, stop]
    );

    return (
      <RiveViewManager
        style={style}
        ref={riveRef}
        resourceName={resourceName}
        fit={fit}
        url={url}
        alignment={alignment}
      />
    );
  }
);

export default RiveContainer;
