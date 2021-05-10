import React, { useCallback, useImperativeHandle, useRef } from 'react';
import {
  requireNativeComponent,
  UIManager,
  findNodeHandle,
  ViewStyle,
} from 'react-native';
import type { RiveRef } from './types';
import { Alignment } from './types';

type RiveProps = {
  resourceName?: string;
  url?: string;
  style?: ViewStyle;
  ref: any;
  testID?: string;
  alignment: Alignment;
};

const VIEW_NAME = 'RiveReactNativeView';

type Props = {
  resourceName?: string;
  url?: string;
  style?: ViewStyle;
  testID?: string;
  alignment?: Alignment;
};

export const RiveViewManager = requireNativeComponent<RiveProps>(VIEW_NAME);

const RiveContainer = React.forwardRef<RiveRef, Props>(
  ({ style, resourceName, url, alignment = Alignment.Center }, ref) => {
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
        url={url}
        alignment={alignment}
      />
    );
  }
);

export default RiveContainer;
