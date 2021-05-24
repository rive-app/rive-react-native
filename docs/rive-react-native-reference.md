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
type: [`Alignment`](./types.md#Alignment)

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

A reference method that will play animation/animations. For an animation currently playing it is no-op.

type: `(animationNames?: string | string[], loop?: LoopMode, direction?: Direction, areStateMachines?: boolean) => void`

##### animationNames

default: `[]`

Specifies which animations should be played. String can be passed in case of a single animation. If this argument hasn't been passed the first animation will be played.

##### loop

default: `LoopMode.None`

Specifies which [`LoopMode`]('./types#LoopMode') should be used for playing the animations.

##### direction

default: `Direction.Auto`

Specifies which [`Direction`](./types#Direction') should be used for playing the animations.

##### areStateMachines

default: `false`

Specifies whether passed animationNames are state machines or just animations.

```tsx
import Rive, { RiveRef } from 'rive-react-native';

const resourceName = 'truck_v7'

function App() {
  const riveRef = React.useRef<RiveRef>(null);

  const handlePlay = () => { riveRef.current?.play() };

  return (
    <>
      <Rive ref={riveRef} resourceName={resourceName} autoplay={false} />
      <Button onPress={handlePlay} title="Play">
    </>
  );
}
```

### pause

A reference method that will pause animation/animations. For the animations currently stopped/paused it is no-op.

type: `(animationNames?: string | string[], areStateMachines?: boolean) => void`

##### animationNames

default: `[]`

Specifies which animations should be paused. String can be passed in case of a single animation. If this argument hasn't been passed all currently playing animations will be played.

##### areStateMachines

default: `false`

Specifies whether passed animationNames are state machines or just animations.

```tsx
import Rive, { RiveRef } from 'rive-react-native';

const resourceName = 'truck_v7'

function App() {
  const riveRef = React.useRef<RiveRef>(null);

  const handlePause = () => { riveRef.current?.pause() };

  return (
    <>
      <Rive ref={riveRef} resourceName={resourceName} />
      <Button onPress={handlePause} title="Pause">
    </>
  );
}
```

### stop

A reference method that will stop animation/animations. For the animations currently stopped/paused it is no-op.

type: `(animationNames?: string | string[], areStateMachines?: boolean) => void`

##### animationNames

default: `[]`

Specifies which animations should be stopped. String can be passed in case of a single animation. If this argument hasn't been passed whole artboard will be reset and paused.

##### areStateMachines

default: `false`

Specifies whether passed animationNames are state machines or just animations.

```tsx
import Rive, { RiveRef } from 'rive-react-native';

const resourceName = 'truck_v7'

function App() {
  const riveRef = React.useRef<RiveRef>(null);

  const handleStop = () => { riveRef.current?.stop() };

  return (
    <>
      <Rive ref={riveRef} resourceName={resourceName} />
      <Button onPress={handleStop} title="Stop">
    </>
  );
}
```

### reset

A reference method that will reset whole artboard. It will play `animationName` or the first animation _(if `animationName` hasn't been passed)_ immediately if `autoplay` hasn't been set to `false` explicitly.

type: `() => void`

```tsx
import Rive, { RiveRef } from 'rive-react-native';

const resourceName = 'truck_v7'

function App() {
  const riveRef = React.useRef<RiveRef>(null);

  const handleReset = () => { riveRef.current?.reset() };

  return (
    <>
      <Rive ref={riveRef} resourceName={resourceName} autoplay={true} />
      <Button onPress={handleReset} title="Reset">
    </>
  );
}
```

### fireState

A reference method that will fire `trigger` identified by the `inputName` on all active matching state machines.

type: `(stateMachineName: string, inputName: string) => void`

##### stateMachineName

Specifies state machine name which will be matched against all active state machines.

##### inputName

Specifies name of the `trigger` that should be fired.

```tsx
import Rive, { RiveRef } from 'rive-react-native';

const resourceName = 'ui_swipe_left_to_delete'

function App() {
  const riveRef = React.useRef<RiveRef>(null);

  const handleFireState = () => { riveRef.current?.fireState('Swipe to delete', 'Trigger Delete') };

  return (
    <>
      <Rive ref={riveRef} resourceName={resourceName} autoplay={true} />
      <Button onPress={handleFireState} title="FireState">
    </>
  );
}
```

### setInputState

A reference method that will set `input` state identified by the `inputName` on all active matching state machines to the given `value`.

type: `(stateMachineName: string, inputName: string, value: boolean | number) => void`

##### stateMachineName

Specifies state machine name which will be matched against all active state machines.

##### inputName

Specifies name of the `input` which state should be updated.

##### value

Specifies value which `input` state should be set to.

```tsx
import Rive, { RiveRef } from 'rive-react-native';

const resourceName = 'ui_swipe_left_to_delete'
const threshold = 50

function App() {
  const riveRef = React.useRef<RiveRef>(null);

  const handleFireState = () => {
    riveRef.current?.setInputState(
      'Swipe to delete',
      'Swipe Threshold',
      threshold
    );
  };

  return (
    <>
      <Rive ref={riveRef} resourceName={resourceName} autoplay={true} />
      <Button onPress={handleFireState} title="FireState">
    </>
  );
}
```
