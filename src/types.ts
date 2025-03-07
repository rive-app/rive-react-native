export type RiveRef = {
  fireState: (stateMachineName: string, inputName: string) => void;
  setInputState: (
    stateMachineName: string,
    inputName: string,
    value: boolean | number
  ) => void;
  getBooleanState: (inputName: string) => Promise<boolean | null>;
  getNumberState: (inputName: string) => Promise<number | null>;
  getBooleanStateAtPath: (
    inputName: string,
    path: string
  ) => Promise<boolean | null>;
  getNumberStateAtPath: (
    inputName: string,
    path: string
  ) => Promise<number | null>;
  fireStateAtPath: (inputName: string, path: string) => void;
  setInputStateAtPath: (
    inputName: string,
    value: boolean | number,
    path: string
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
  setTextRunValueAtPath: (
    textRunName: string,
    value: string,
    path: string
  ) => void;
};

export enum ViewManagerMethod {
  play = 'play',
  pause = 'pause',
  stop = 'stop',
  reset = 'reset',
  fireState = 'fireState',
  setBooleanState = 'setBooleanState',
  getBooleanState = 'getBooleanState',
  getBooleanStateAtPath = 'getBooleanStateAtPath',
  setNumberState = 'setNumberState',
  getNumberState = 'getNumberState',
  getNumberStateAtPath = 'getNumberStateAtPath',
  fireStateAtPath = 'fireStateAtPath',
  setBooleanStateAtPath = 'setBooleanStateAtPath',
  setNumberStateAtPath = 'setNumberStateAtPath',
  touchBegan = 'touchBegan',
  touchEnded = 'touchEnded',
  setTextRunValue = 'setTextRunValue',
  setTextRunValueAtPath = 'setTextRunValueAtPath',
}

export enum Fit {
  Cover = 'cover',
  Contain = 'contain',
  Fill = 'fill',
  FitWidth = 'fitWidth',
  FitHeight = 'fitHeight',
  None = 'none',
  ScaleDown = 'scaleDown',
  Layout = 'layout',
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
  Rive = 'rive',
  CoreGraphics = 'coreGraphics',
}

export enum RiveRendererAndroid {
  Rive = 'rive',
  Canvas = 'canvas',
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

export interface FileAssetSource {
  sourceUrl?: string;
  sourceAsset?: string;
  sourceAssetId?: string;
  path?: string;
}

export interface FileHandlerOptions {
  source: RiveAssetPropType | FileAssetSource;
}

export type RiveAssetPropType =
  | RiveAssetRequireSource
  | RiveAssetUriSource
  | RiveAssetPackagedSource;

export type RiveAssetRequireSource = number;

export interface RiveAssetUriSource {
  uri: string;
}

export interface RiveAssetPackagedSource {
  fileName: string;
  path?: string; // only needed for Android assets
}

export interface FilesHandledMapping {
  [assetName: string]: FileHandlerOptions;
}
