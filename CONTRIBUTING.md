# Contributing

We love contributions! If you want to run the project locally to test out changes, run the examples, or just see how things work under the hood, read on below.

## Setup Dependencies

In order to run the `example/` React Native project in this repo, you may need to ensure you have the following dependencies and considerations below installed and taken into account.

### General setup

You'll be using [Yarn](https://yarnpkg.com/) for most commands in this project, so ensure this is [installed](https://yarnpkg.com/getting-started/install) globally.

Run `yarn --version` to test and make sure you can call `yarn` in your terminal.

### React Native setup
Follow dependency installation instructions from the [React Native docs here](https://reactnative.dev/docs/environment-setup#installing-dependencies) to get setup with iOS and Android. Make sure to select the following tabs in the docs:
- Select the **React Native CLI Quickstart** tab
- **Development OS**: `macOS` or other OS you're working with
- **Target OS**: Select either `Android` or `iOS` based on whichever platform you're trying to work with/set up

### iOS setup

- You may need to run `pod install` (first time) or `pod update RiveRuntime` (updates to the underlying Rive iOS runtime) in the `example/iOS` folder to get the runtime installed or updated

### Android setup
- Follow dependency installation instructions from the [React Native docs here](https://reactnative.dev/docs/environment-setup#installing-dependencies) to get setup with the Android SDK
- Ensure that if you installed a new version of JDK, it is set as the `JAVA_HOME` appropriately in your env system (i.e `.zshrc`). You can also verify the new JDK via `java -version` in the command-line. Set the env variable like so:
```
export JAVA_HOME=/Library/Java/JavaVirtualMachines/adoptopenjdk-11.jdk/Contents/Home`
```

### M1 considerations

If you're running on an M1, you may need to run terminal-based commands off [Rosetta](https://www.courier.com/blog/tips-and-tricks-to-setup-your-apple-m1-for-development/) as it may not support new M1 architecture.

## Local Development

To get started with the project, run `yarn` in the root directory to install the required dependencies for each package:

```sh
yarn
```

> While it's possible to use [`npm`](https://github.com/npm/cli), the tooling is built around [`yarn`](https://classic.yarnpkg.com/), so you'll have an easier time if you use `yarn` for development.

The main API that consumers of this package will interface with is in the `src/Rive.tsx` file, so any changes to the API will most likely take place there. Check out the types defined in `src/types.ts` that help round out the full picture on types for pieces such as Layout options, error types, and more.

The top-level `ios/` and `android/` folder define how the underlying Rive iOS and Android runtimes connect to React Native views. Usually you may have to dig into this code when bumping the underlying runtime versions, or hooking up new features/functionality for the Rive React Native API. See [an example here](https://github.com/rive-app/rive-react-native/pull/130/files), where we added Listeners functionality for this runtime.

To start the metro server for the example app:

```sh
yarn example start
```

To run the example app on Android, you can run the Android project in `example/android` in Android Studio, OR at the top level of the project, run the following command to start up the device:

```sh
yarn example android
```

To run the example app on iOS devices or simulators, you can run the iOS project in `example/ios` in XCode, OR at the top level of the project, run the following command to start up the device:

```sh
yarn example ios
```

While developing, you can run the [example app](/example/) to test your changes. Any changes you make in the `src/` JavaScript code will be reflected in the example app without a rebuild on save. If you change any native code in the `ios/` or `android/` folders, then you'll need to rebuild the example app (i.e `yarn example start` again).

To edit the Objective-C files, open `example/ios/RiveReactNativeExample.xcworkspace` in XCode and find the source files at `Pods > Development Pods > rive-react-native`.

To edit the Kotlin files, open `example/android` in Android studio and find the source files at `rivereactnative` under `Android`.

## Linting and Testing

Make sure your code passes TypeScript and ESLint. Run the following to verify:

```sh
yarn typescript
yarn lint
```

To fix formatting errors, run the following:

```sh
yarn lint --fix
```

Remember to add tests for your change if possible. Run the unit tests by:

```sh
yarn test
```

We use the following tools to help enforce certain patterns and practices within this codebase: [ESLint](https://eslint.org/), [Prettier](https://prettier.io/), [TypeScript](https://www.typescriptlang.org/).

We use [TypeScript](https://www.typescriptlang.org/) for type checking, [ESLint](https://eslint.org/) with [Prettier](https://prettier.io/) for linting and formatting the code, and [Jest](https://jestjs.io/) for testing.

Our pre-commit hooks verify that the linter and tests pass when committing.

## Upgrading Rive iOS and Android runtime dependencies

When an underlying runtime like [rive-ios](https://github.com/rive-app/rive-ios) or [rive-android](https://github.com/rive-app/rive-android) has a new feature or bug fix introduced, we usually want to patch those changes through to this runtime by bumping the versions of those libraries. See below how to do this for each of the platforms.

### Updating iOS RiveRuntime

Before running `yarn` at the root level of the project, set the appropriate version of the iOS runtime in `rive-react-native.podspec` at the root of the folder:

```
s.dependency "RiveRuntime", "1.0.18"
```

In the example folder, run the following command to update the example project to retrieve the expected `RiveRuntime` dependency you're upgrading to:

```
pod update RiveRuntime
```

### Updating Android runtime

In the top-level `android` folder, change the dependency version in `build.gradle` to the version you're looking to upgrade to in the dependencies:

```
implementation 'app.rive:rive-android:2.0.26'
```

### Debugging against local rive-android

Sometimes it maybe necessary to debug the react native package against local installs of the runtime.

Build your local `rive-android` package (run the `rive-android:kotlin[build]` gradle command) and then simply update the `android/build.gradle` file.

Comment out the rive-android dependency and replace it with the file pointer to the release. e.g.:

```sh
// implementation 'app.rive:rive-android:0.2.14'
implementation files("/Users/maxwelltalbot/development/rive/rive-android/kotlin/build/outputs/aar/kotlin-release.aar")
```

If you are looking to debug actual log outputs from the rive-android bundle as opposed to react-native itself, you may need to connect logcat to this process.

## Contributing changes

Create a feature branch off of the `main` branch and submit a PR to the `main` branch with any changes.

> **Working on your first pull request?** You can learn how from this _free_ series: [How to Contribute to an Open Source Project on GitHub](https://egghead.io/series/how-to-contribute-to-an-open-source-project-on-github).

When you're sending a pull request:

- Prefer small pull requests focused on one change.
- Verify that linters and tests are passing.
- Review the documentation to make sure it looks good.
- Follow the pull request template when opening a pull request.
- For pull requests that change the API or implementation, discuss with maintainers first by opening an issue.

See below for some notes on commit messages and version bumps.

### Commit message convention

We follow the [conventional commits specification](https://www.conventionalcommits.org/en) for our commit messages, all lower-case:

- `fix`: bug fixes, e.g. fix crash due to deprecated method.
- `feat`: new features, e.g. add new method to the module.
- `refactor`: code refactor, e.g. migrate from class components to hooks.
- `docs`: changes into documentation, e.g. add usage example for the module..
- `test`: adding or updating tests, e.g. add integration tests using detox.
- `chore`: tooling changes, e.g. change CI config.

Our pre-commit hooks verify that your commit message matches this format when committing.

### Version bumps

When changes are merged back to the `main` branch, there is a Github action workflow that by default bumps the package's patch version (i.e `1.0.0` -> `1.0.1`). If you wish to bump the minor version or major version, you should change the version in `package.json` to reflect the version you'd like the Github action workflow to deploy and release.

We use [release-it](https://github.com/release-it/release-it) to make it easier to publish new versions. It handles common tasks like bumping version based on semver, creating tags and releases etc.

### Packaging

The Rive React Native runtime deploys to [NPM](https://www.npmjs.com/package/rive-react-native).

### Scripts

The `package.json` file contains various scripts for common tasks:

- `yarn bootstrap`: setup project by installing all dependencies and pods.
- `yarn typescript`: type-check files with TypeScript.
- `yarn lint`: lint files with ESLint.
- `yarn test`: run unit tests with Jest.
- `yarn example start`: start the Metro server for the example app.
- `yarn example android`: run the example app on Android.
- `yarn example ios`: run the example app on iOS.

## Code of Conduct

### Our Pledge

We as members, contributors, and leaders pledge to make participation in our community a harassment-free experience for everyone, regardless of age, body size, visible or invisible disability, ethnicity, sex characteristics, gender identity and expression, level of experience, education, socio-economic status, nationality, personal appearance, race, religion, or sexual identity and orientation.

We pledge to act and interact in ways that contribute to an open, welcoming, diverse, inclusive, and healthy community.

### Our Standards

Examples of behavior that contributes to a positive environment for our community include:

- Demonstrating empathy and kindness toward other people
- Being respectful of differing opinions, viewpoints, and experiences
- Giving and gracefully accepting constructive feedback
- Accepting responsibility and apologizing to those affected by our mistakes, and learning from the experience
- Focusing on what is best not just for us as individuals, but for the overall community

Examples of unacceptable behavior include:

- The use of sexualized language or imagery, and sexual attention or
  advances of any kind
- Trolling, insulting or derogatory comments, and personal or political attacks
- Public or private harassment
- Publishing others' private information, such as a physical or email
  address, without their explicit permission
- Other conduct which could reasonably be considered inappropriate in a
  professional setting

### Enforcement Responsibilities

Community leaders are responsible for clarifying and enforcing our standards of acceptable behavior and will take appropriate and fair corrective action in response to any behavior that they deem inappropriate, threatening, offensive, or harmful.

Community leaders have the right and responsibility to remove, edit, or reject comments, commits, code, wiki edits, issues, and other contributions that are not aligned to this Code of Conduct, and will communicate reasons for moderation decisions when appropriate.

### Scope

This Code of Conduct applies within all community spaces, and also applies when an individual is officially representing the community in public spaces. Examples of representing our community include using an official e-mail address, posting via an official social media account, or acting as an appointed representative at an online or offline event.

### Enforcement

Instances of abusive, harassing, or otherwise unacceptable behavior may be reported to the community leaders responsible for enforcement at [INSERT CONTACT METHOD]. All complaints will be reviewed and investigated promptly and fairly.

All community leaders are obligated to respect the privacy and security of the reporter of any incident.

### Enforcement Guidelines

Community leaders will follow these Community Impact Guidelines in determining the consequences for any action they deem in violation of this Code of Conduct:

#### 1. Correction

**Community Impact**: Use of inappropriate language or other behavior deemed unprofessional or unwelcome in the community.

**Consequence**: A private, written warning from community leaders, providing clarity around the nature of the violation and an explanation of why the behavior was inappropriate. A public apology may be requested.

#### 2. Warning

**Community Impact**: A violation through a single incident or series of actions.

**Consequence**: A warning with consequences for continued behavior. No interaction with the people involved, including unsolicited interaction with those enforcing the Code of Conduct, for a specified period of time. This includes avoiding interactions in community spaces as well as external channels like social media. Violating these terms may lead to a temporary or permanent ban.

#### 3. Temporary Ban

**Community Impact**: A serious violation of community standards, including sustained inappropriate behavior.

**Consequence**: A temporary ban from any sort of interaction or public communication with the community for a specified period of time. No public or private interaction with the people involved, including unsolicited interaction with those enforcing the Code of Conduct, is allowed during this period. Violating these terms may lead to a permanent ban.

#### 4. Permanent Ban

**Community Impact**: Demonstrating a pattern of violation of community standards, including sustained inappropriate behavior, harassment of an individual, or aggression toward or disparagement of classes of individuals.

**Consequence**: A permanent ban from any sort of public interaction within the community.

### Attribution

This Code of Conduct is adapted from the [Contributor Covenant][homepage], version 2.0,
available at https://www.contributor-covenant.org/version/2/0/code_of_conduct.html.

Community Impact Guidelines were inspired by [Mozilla's code of conduct enforcement ladder](https://github.com/mozilla/diversity).

[homepage]: https://www.contributor-covenant.org

For answers to common questions about this code of conduct, see the FAQ at
https://www.contributor-covenant.org/faq. Translations are available at https://www.contributor-covenant.org/translations.
