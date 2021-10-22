![Build Status](https://github.com/rive-app/rive-react-native/actions/workflows/typecheck-lint.yml/badge.svg)
![Discord badge](https://img.shields.io/discord/532365473602600965)
![Twitter handle](https://img.shields.io/twitter/follow/rive_app.svg?style=social&label=Follow)

# rive-react-native

This package implements native binding for Rive Runtime for iOS and Android.
`Expo CLI` is not supported by this lib.

Further runtime documentation can be found in [Rive's help center](https://help.rive.app/runtimes).

## Installation

- install `rive-react-native` dependency using yarn or npm

```sh
npm install rive-react-native
```

or

```sh
yarn add rive-react-native
```

- install pods for your ios project. Go to the project `ios` directory and run

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

Put `.riv` files inside your project:

- `raw` directory on Android
- `Assets` directory on iOS

### Expo

Since rive-react-native has native bindings to iOS and Android, you need to generate a native project in order to run you app. This can be done with `expo run:android` or `expo run:ios`. See https://docs.expo.dev/workflow/customizing/ for more information.

## Usage

```tsx
import Rive from 'rive-react-native';

const resourceName = 'truck_v7'; // file truck_v7.riv

function App() {
  return <Rive resourceName={resourceName} />;
}
```

You can download the [truck_v7.riv](https://github.com/rive-app/rive-react-native/raw/main/example/ios/Assets/truck_v7.riv) file from the example/ios/Assets folder. A more detailed guide about usage can be found [here](./docs/usage-guide.md)

## Rive component

`Rive` is a component that can render a native rive animation.

- [Props documentation](./docs/rive-react-native-reference.md#props)
- [Ref methods documentation](./docs/rive-react-native-reference.md#ref-methods)

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.
