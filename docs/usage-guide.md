# Rive component usage guide

Rive component allows setup and interaction with the native implementation of the Rive runtime on iOS and Android.

## 1. Installing dependencies

To install the SDK run the following command in your terminal:

```sh
yarn add rive-react-native
```

For iOS you will have to run `pod install` inside `ios` directory in order to install needed native dependencies. Android won't require any additional steps.

## 2. Rendering `Rive` component in your app

To render the animation in your app just use [`Rive`](./rive-react-native-reference.md) component wherever you need it.

```jsx
import Rive from 'rive-react-native';

export default function App() {
  return (
    <View>
      <Rive />
    </View>
  );
}
```

## 3. Setting `resourceName` and other useful props

To load and play the animation use[`resourceName`](./rive-react-native-reference.md#resourceName-optional) prop.
In order to play the animation directly after loading [`autoplay`](./rive-react-native-reference.md#autoplay-optional) prop can be used.

```jsx
<Rive resourceName="truck_v7" autoplay />
```

You can also set the url as an animation source or control its layout/placement using component props. The whole list of available props can be found [here](rive-react-native-reference.md#props).

## 4. Triggering play/pause manually

In addition to configuring the rive animation view declaratively there is also a way to trigger some actions imperatively using component's ref.

On of those actions are `play` and `pause` which can be used to manually pause and start the animation.

```tsx
import Rive, { RiveRef } from 'rive-react-native'

export default function App() {
  const riveRef = React.useRef<RiveRef>(null);

  const handlePlayPress = () => {
    riveRef?.current?.play();
  };

  return (
    <View>
      <Rive
        resourceName="truck_v7"
        ref={riveRef}
      />

      <Button onPress={handlePlayPress} title="play">
    </View>
  );
}
```

The list of all available methods can be found [here](./rive-react-native-reference.md#ref-methods).
