# Rive component - reference

Rive component allows setup and interaction with the native implementation of the Rive runtime on iOS and Android.
This document contains information about available props, callbacks, and ref's methods.

Rive Android repo:
https://github.com/rive-app/rive-android

Rive iOS repo:
https://github.com/rive-app/rive-ios

Rive Web repo:
https://github.com/rive-app/rive-wasm

```tsx
import Rive from 'rive-react-native';

function App() {
  return <Rive resourceName="truck_v7" />;
}
```

## Props

### children _(optional)_

Can be used to display something positioned `absolutely` on top of the rive animation view.

### style _(optional)_

Style of the rive animation view wrapper.

default: `undefined`
type: `StyleProp<ViewStyle>`

### resourceName _(optional)_

A file name that matches the rive file without `.riv` extension.
You should provide either `resourceName` or `url` not both at the same time.

default: `undefined`
type: `string`

### url _(optional)_

A URL that provides a rive file.
You should provide either `resourceName` or `url` not both at the same time.

default: `undefined`
type: `string`

### autoplay _(optional)_

Opening a rive animation view or specifying new `resourceName` or `url` will make it automatically play, when it is ready.

default: `true`
type: `boolean`

### fit _(optional)_

Specifies how animation should be displayed inside rive animation view.

default: `Fit.Contain`
type: [`Fit`](./types.md#Fit)

### alignment _(optional)_

Specifies how animation should be aligned inside rive animation view.

default: `Alignment.None`
type: [`Fit`](./types.md#Alignment)

### artboardName _(optional)_

Specifies which animation artboard should be displayed in rive animation view.

default: `undefined`
type: `string`

### animationName _(optional)_

Specifies which animation should be played when `autoplay` is set to `true`.

default: `undefined`
type: `string`

### stateMachineName _(optional)_

Specifies which stateMachine should be played when `autoplay` is set to `true`.

default: `undefined`
type: `string`

### testID _(optional)_

Specifies testID which could be handy in tests.

default: `undefined`
type: `string`

### onPlay _(optional)_

type: `(animationName: string, isStateMachine: boolean) => void`

Callback function that is called when animation or stateMachine has been started.

### onPause _(optional)_

type: `(animationName: string, isStateMachine: boolean) => void`

Callback function that is called when animation or stateMachine has been paused.

### onStop _(optional)_

type: `(animationName: string, isStateMachine: boolean) => void`

Callback function that is called when animation or stateMachine has been stopped.

### onLoopEnd _(optional)_

type: `(animationName: string, isStateMachine: boolean) => void`

Callback function that is called when animation or stateMachine loop has been ended.

### onStateChanged _(optional)_

type: [`(layerState: LayerState) => void`]('./types.md#LayerState')

Callback function that is called when the internal animation state has been changed. It's tightly coupled with state machines feature.

## Ref methods

### play

A reference method that will play animation if it is has been stopped. For an animation currently playing it is no-op.
