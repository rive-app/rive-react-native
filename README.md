# rive-react-native

This package implements native binding for Rive Runtime for iOS and Android.

## Installation

- install `rive-react-native` dependency using yarn or npm

```sh
npm install rive-react-native
```

or

```sh
yarn add rive-react-native
```

- install pods for your ios project. Go to the `ios` directory and run

```sh
pod install
```

- Add empty swift file in order to create `Bridging-Header` file if it doesn't exist. _(optional)_

- add this dependency to your project inside `android/app/build.gradle`

```groovy
dependencies {
  implementation "androidx.startup:startup-runtime:1.0.0"
}
```

More info [here](https://github.com/rive-app/rive-android#manually-initializing-rive).

## Usage

```tsx
import Rive from 'rive-react-native';

const resourceName = 'truck_v7'; // file truck_v7.riv

function App() {
  return <Rive resourceName={resourceName} />;
}
```

A more detailed guide about usage can be found [here](./docs/usage-guide.md)

## Rive component

`Rive` is a component that can render a native rive animation.

- [Props documentation](./docs/rive-react-native-reference.md#props)
- [Ref methods documentation](./docs/rive-react-native-reference.md#ref-methods)

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.
