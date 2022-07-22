![Build Status](https://github.com/rive-app/rive-react-native/actions/workflows/typecheck-lint.yml/badge.svg)
![Discord badge](https://img.shields.io/discord/532365473602600965)
![Twitter handle](https://img.shields.io/twitter/follow/rive_app.svg?style=social&label=Follow)

# Rive React Native

![Rive hero image](https://rive-app.notion.site/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2Fff44ed5f-1eea-4154-81ef-84547e61c3fd%2Frive_notion.png?table=block&id=f198cab2-c0bc-4ce8-970c-42220379bcf3&spaceId=9c949665-9ad9-445f-b9c4-5ee204f8b60c&width=2000&userId=&cache=v2)

A React Native runtime library for [Rive](https://rive.app).

This library is a wrapper around the iOS/Android runtime, providing a component and ref pattern for React Native applications.

## Table of contents

- :star: [Rive Overview](#rive-overview)
- 🚀 [Getting Started & API docs](#getting-started)
- :mag: [Supported Devices](#supported-devices)
- :books: [Examples](#examples)
- 👨‍💻 [Contributing](#contributing)
- :question: [Issues](#issues)

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
  - Target SDK version: **31**

## Examples

Check out the `example/` folder to run an example application using the Rive React Native runtime. It runs on the local build of this library, and showcases a number of ways to use the Rive component and `useRef` hook pattern:

- Setting a Rive file via a URL, or asset in the Android/iOS projects
- Setting layout and loop mode options
- Displaying single or multiple animations / artboards on one component
- Setting up and maniuplating a state machine via inputs
- ...and more!

## Contributing

We love contributions! Check out our [contributing docs](./CONTRIBUTING.md) to get more details into how to run this project, the examples, and more all locally.

## Issues

Have an issue with using the runtime, or want to suggest a feature/API to help make your development life better? Log an issue in our [issues](https://github.com/rive-app/rive-react-native/issues) tab! You can also browse older issues and discussion threads there to see solutions that may have worked for common problems.
