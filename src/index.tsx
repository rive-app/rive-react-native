import { requireNativeComponent, ViewStyle } from 'react-native';

type RiveReactNativeProps = {
  color: string;
  style: ViewStyle;
};

export const RiveReactNativeViewManager = requireNativeComponent<RiveReactNativeProps>(
'RiveReactNativeView'
);

export default RiveReactNativeViewManager;
