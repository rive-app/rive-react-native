![Build Status](https://github.com/rive-app/rive-react-native/actions/workflows/typecheck-lint.yml/badge.svg)
![Discord badge](https://img.shields.io/discord/532365473602600965)
![Twitter handle](https://img.shields.io/twitter/follow/rive_app.svg?style=social&label=Follow)

# Rive React Native

![Rive hero image](https://cdn.rive.app/rive_logo_dark_bg.png)

> **🚀 New Runtime Available!**
>
> The new Rive React Native runtime is now available. Built with Nitro for improved performance and better React Native integration.
>
> **Try it now:**
>
> - [GitHub](https://github.com/rive-app/rive-nitro-react-native)
> - [NPM](https://www.npmjs.com/package/@rive-app/react-native)
>
> We're actively gathering feedback to improve the new runtime. Please share your thoughts and report any issues you
>
> **Migration Timeline:**
>
> - **Short term:** Complete the new runtime, see [Feature Support](https://github.com/rive-app/rive-nitro-react-native?tab=readme-ov-file#feature-support) and [Roadmap](https://github.com/rive-app/rive-nitro-react-native?tab=readme-ov-file#roadmap)
> - **Medium term:** Address major concerns in this legacy package while supporting migration
> - **Long term:** Full migration to the new package

A React Native runtime library for [Rive](https://rive.app).

This library is a wrapper around the iOS/Android runtime, providing a component and ref pattern for React Native applications.

## Table of contents

- :star: [Rive Overview](#rive-overview)
- 🚀 [Getting Started & API docs](#getting-started)
- :mag: [Supported Devices](#supported-devices)
- :books: [Examples](#examples)
- 🏃 [Migration Guides](#migration-guides)
- 👨‍💻 [Contributing](#contributing)
- :question: [Issues](#issues)
- :wrench: [Native SDK Version Customization](#native-sdk-version-customization)

## Rive Overview

[Rive](https://rive.app) is a real-time interactive design and animation tool that helps teams create and run interactive animations anywhere. Designers and developers use our collaborative editor to create motion graphics that respond to different states and user inputs. Our lightweight open-source runtime libraries allow them to load their animations into apps, games, and websites.

:house_with_garden: [Homepage](https://rive.app/)

:blue_book: [General help docs](https://help.rive.app/)

🛠 [Resources for building in Rive](https://rive.app/resources/)

## Getting Started

Follow along with the link below for a quick start in getting Rive React Native integrated into your multi-platform applications.

[Getting Started with Rive in React Native](https://help.rive.app/runtimes/overview/react-native)

[API documentation](https://help.rive.app/runtimes/overview/react-native/props)

## Supported Devices

Because this runtime library has a dependency on the [Rive Android](https://github.com/rive-app/rive-android) and [Rive iOS](https://github.com/rive-app/rive-ios) runtimes, the supported devices align with each of these dependencies minimum supported devices, as well as the minimum device requirements of the React Native framework.

- iOS: **14.0+**
- Android:
  - Minimum SDK version: **21**
  - Target SDK version: **33**

## Examples

Check out the `example/` folder to run an example application using the Rive React Native runtime. It runs on the local build of this library, and showcases a number of ways to use the Rive component and `useRef` hook pattern:

- Setting a Rive file via a URL, or asset in the Android/iOS projects
- Displaying single or multiple animations / artboards on one component
- Setting up and maniuplating a state machine via inputs
- ...and more!

Steps:

1. Run `yarn bootstrap`
2. cd `example`
3. `yarn expo run:android` or `yarn expo run:ios`

iOS:

- You may need to run `pod install` (first time) or `pod update RiveRuntime` (updates to the underlying Rive iOS runtime) in the `example/iOS` folder to get the runtime installed or updated

## Migration Guides

Using an older version of the runtime and need to learn how to upgrade to the latest version? Check out the migration guides below in our help center that help guide you through version bumps; breaking changes and all!

[Migration guides](https://help.rive.app/runtimes/overview/react-native/migrating-from-v3-to-v4)

## Contributing

We love contributions! Check out our [contributing docs](./CONTRIBUTING.md) to get more details into how to run this project, the examples, and more all locally.

## Issues

Have an issue with using the runtime, or want to suggest a feature/API to help make your development life better? Log an issue in our [issues](https://github.com/rive-app/rive-react-native/issues) tab! You can also browse older issues and discussion threads there to see solutions that may have worked for common problems.

## Native SDK Version Customization

> **⚠️ Advanced Configuration**
> This section is for advanced users who need to use specific versions of the Rive native SDKs. In most cases, you should use the default versions that come with the library. Only customize these versions if you have a specific requirement and understand the potential compatibility implications.
>
> **Important:** If you customize the native SDK versions and later update `rive-react-native` to a newer version, you should revisit your custom version settings. The custom versions you specified may not be compatible with the updated `rive-react-native` version. Always check the default versions in the new release and test thoroughly.

### Default Behavior

By default, `rive-react-native` uses the native SDK versions specified in `package.json`:

```json
"runtimeVersions": {
  "ios": "6.12.0",
  "android": "10.4.5"
}
```

These versions are tested and known to work well with this version of `rive-react-native`.

### Customizing Versions

You can override these default versions using platform-specific configuration files:

#### iOS (Vanilla React Native)

Create or edit `ios/Podfile.properties.json`:

```json
{
  "RiveRuntimeIOSVersion": "6.13.0"
}
```

Then run:

```bash
cd ios && pod install
```

#### Android (Vanilla React Native)

Add to `android/gradle.properties`:

```properties
Rive_RiveRuntimeAndroidVersion=10.5.0
```

#### Expo Projects

For Expo projects, use config plugins in your `app.config.ts`:

```typescript
import { ExpoConfig, ConfigContext } from 'expo/config';
import { withPodfileProperties } from '@expo/config-plugins';
import { withGradleProperties } from '@expo/config-plugins';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  plugins: [
    [
      withPodfileProperties,
      {
        RiveRuntimeIOSVersion: '6.13.0',
      },
    ],
    [
      withGradleProperties,
      {
        Rive_RiveRuntimeAndroidVersion: '10.5.0',
      },
    ],
  ],
});
```

### Version Resolution Priority

The library resolves versions in the following order:

**iOS:**

1. `ios/Podfile.properties.json` → `RiveRuntimeIOSVersion`
2. `package.json` → `runtimeVersions.ios` (default)

**Android:**

1. `android/gradle.properties` → `Rive_RiveRuntimeAndroidVersion`
2. `package.json` → `runtimeVersions.android` (default)
