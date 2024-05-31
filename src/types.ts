export type RiveRef = {
  fireState: (stateMachineName: string, inputName: string) => void;
  setInputState: (
    stateMachineName: string,
    inputName: string,
    value: boolean | number
  ) => void;
  play: (
    animationName?: string,
    loop?: LoopMode,
    direction?: Direction,
    isStateMachine?: boolean
  ) => void;
  pause: () => void;
  stop: () => void;
  reset: () => void;
  touchBegan: (x: number, y: number) => void;
  touchEnded: (x: number, y: number) => void;
  setTextRunValue: (textRunName: string, value: string) => void;
};

export enum ViewManagerMethod {
  play = 'play',
  pause = 'pause',
  stop = 'stop',
  reset = 'reset',
  fireState = 'fireState',
  setBooleanState = 'setBooleanState',
  setNumberState = 'setNumberState',
  touchBegan = 'touchBegan',
  touchEnded = 'touchEnded',
  setTextRunValue = 'setTextRunValue',
}

export enum Fit {
  Cover = 'cover',
  Contain = 'contain',
  Fill = 'fill',
  FitWidth = 'fitWidth',
  FitHeight = 'fitHeight',
  None = 'none',
  ScaleDown = 'scaleDown',
}

export enum Alignment {
  TopLeft = 'topLeft',
  TopCenter = 'topCenter',
  TopRight = 'topRight',
  CenterLeft = 'centerLeft',
  Center = 'center',
  CenterRight = 'centerRight',
  BottomLeft = 'bottomLeft',
  BottomCenter = 'bottomCenter',
  BottomRight = 'bottomRight',
}

export enum LoopMode {
  OneShot = 'oneShot',
  Loop = 'loop',
  PingPong = 'pingPong',
  Auto = 'auto',
}

export enum Direction {
  Backwards = 'backwards',
  Auto = 'auto',
  Forwards = 'forwards',
}

export enum RiveRendererIOS {
  Rive = 'riveRenderer',
  Skia = 'skiaRenderer',
  CoreGraphics = 'cgRenderer',
}

export enum RiveRendererAndroid {
  Rive = 'riveRenderer',
  Skia = 'skiaRenderer',
  Canvas = 'canvasRenderer',
}

export enum RNRiveErrorType {
  FileNotFound = 'FileNotFound',
  UnsupportedRuntimeVersion = 'UnsupportedRuntimeVersion',
  IncorrectRiveFileUrl = 'IncorrectRiveFileUrl',
  IncorrectAnimationName = 'IncorrectAnimationName',
  MalformedFile = 'MalformedFile',
  IncorrectArtboardName = 'IncorrectArtboardName',
  IncorrectStateMachineName = 'IncorrectStateMachineName',
  IncorrectStateMachineInput = 'IncorrectStateMachineInput',
  TextRunNotFoundError = 'TextRunNotFoundError',
}

export type RNRiveError = {
  message: string;
  type: RNRiveErrorType;
};

export interface RiveEventProperties {
  [key: string]: number | boolean | string;
}

export interface RiveEvent {
  name: string;
  type: number;
  delay?: number;
  properties?: RiveEventProperties;
}

export interface RiveGeneralEvent extends RiveEvent {}

export interface RiveOpenUrlEvent extends RiveEvent {
  url?: string;
  target?: string;
}

export interface RiveRendererInterface {
  defaultRenderer(
    iosRenderer: RiveRendererIOS,
    androidRenderer: RiveRendererAndroid
  ): void;
}
