export type RiveRef = {
  fireState: (stateMachineName: string, inputName: string) => void;
  setInputState: (
    stateMachineName: string,
    inputName: string,
    value: boolean | number
  ) => void;
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
  stop: (
    animationNames?: string | string[],
    areStateMachines?: boolean
  ) => void;
  reset: () => void;
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

export enum LayerState {
  Any = 'any',
  Exit = 'exit',
  Entry = 'entry',
  Animation = 'animation',
}
