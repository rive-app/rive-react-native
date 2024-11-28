# Types and enums

## Fit

```ts
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
```

## Alignment

```ts
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
```

## LoopMode

```ts
export enum LoopMode {
  OneShot = 'oneShot',
  Loop = 'loop',
  PingPong = 'pingPong',
  Auto = 'auto',
}
```

## Direction

```ts
export enum Direction {
  Backwards = 'backwards',
  Auto = 'auto',
  Forwards = 'forwards',
}
```

## HandledAssetsConfig

```ts
export type HandledAssetsConfig = {
  [name: string]:
    | {
        assetUrl: string;
      }
    | {
        // On iOS, this must include the file extension.
        // On Android, this must exclude the file extension. The asset must be placed in the `android/app/src/main/res/raw` directory
        bundledAssetName: string;
      };
}
```

## RNRiveError

```ts
export type RNRiveError = {
  message: string;
  type: RNRiveErrorType;
};
```

## RnRiveErrorType

```ts
export enum RNRiveErrorType {
  FileNotFound = 'FileNotFound',
  UnsupportedRuntimeVersion = 'UnsupportedRuntimeVersion',
  IncorrectRiveFileUrl = 'IncorrectRiveFileUrl',
  IncorrectAnimationName = 'IncorrectAnimationName',
  MalformedFile = 'MalformedFile',
  IncorrectArtboardName = 'IncorrectArtboardName',
  IncorrectStateMachineName = 'IncorrectStateMachineName',
  IncorrectStateMachineInput = 'IncorrectStateMachineInput',
}
```
