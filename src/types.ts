export type RiveRef = {
  play: (
    animationNames?: string | string[],
    loop?: LoopMode,
    direction?: Direction,
    areStateMachines?: boolean
  ) => void;
  pause: (
    animationNames?: string | string[],
    areStateMachines?: boolean
  ) => void;
  stop: () => void;
};

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
  None = 'none',
}

export enum Direction {
  Backwards = 'backwards',
  Auto = 'auto',
  Forwards = 'forwards',
}
