# HyperTrack Expo config plugin for React Native HyperTrack SDK

![GitHub](https://img.shields.io/github/license/hypertrack/sdk-expo.svg) 
![npm](https://img.shields.io/npm/v/hypertrack-sdk-expo.svg) 

[HyperTrack](https://www.hypertrack.com) lets you add live location tracking to your mobile app. Live location is made available along with ongoing activity, tracking controls and tracking outage with reasons.

React Native HyperTrack SDK is a wrapper around native iOS and Android SDKs that allows to integrate HyperTrack into React Native apps.

Expo [config plugin](https://docs.expo.io/guides/config-plugins/) enables usage of React Native HyperTrack SDK with Expo managed workflow.

For information about how to get started with Expo and React Native HyperTrack SDK, please check this [Guide](https://www.hypertrack.com/docs/install-sdk-expo).

## Installation

1. Install HyperTrack Expo [NPM package](https://www.npmjs.com/package/hypertrack-sdk-expo) 
  - `npx expo install hypertrack-sdk-expo`
2. Install React Native HyperTrack SDK [NPM package](https://www.npmjs.com/package/hypertrack-sdk-react-native) 
  - `npx expo install hypertrack-sdk-react-native`

### 3. Add HyperTrack Expo plugin to the app

Add `hypertrack-sdk-expo` to [`plugins`](https://docs.expo.io/versions/latest/config/app/#plugins) array of your `app.json` or `app.config.js`:

```json
{
  "expo": {
    "plugins": [
      [
        "hypertrack-sdk-expo",
        {
          "locationPermission":
            "PUT_YOUR_PERMISSION_HINT_MESSAGE_HERE",
          "motionPermission":
            "PUT_YOUR_PERMISSION_HINT_MESSAGE_HERE"
        }
      ]
    ]
  }
}
```

Configuring permission permission purpose strings (`locationPermission`, `motionPermission`) is described below.

### 4. Set required build properties

Use [expo-build-properties](https://docs.expo.dev/versions/latest/sdk/build-properties/) to set build properties.

Run `npx expo install expo-build-properties` and add this to `plugins` in `app.json` or `app.config.js`:
```json
[
  "expo-build-properties",
  {
    "android": {
      "minSdkVersion": 23
    }
  }
]
```

### 5. Set up push notifications

- For iOS, to enable push notifcations you need to add [push notifications credentials](https://docs.expo.dev/app-signing/managed-credentials/#ios)
- For Android, to enable push notifcations you need to use [FCM for Push Notifications](https://docs.expo.dev/push-notifications/using-fcm/)

## Sample code

[Quickstart Expo app](https://github.com/hypertrack/quickstart-expo)

## Wrapper API Documentation

[Wrapper API Documentation](https://hypertrack.github.io/sdk-react-native/)

## Versioning

Ensure you use versions that work together!

|  `expo`  | `hypertrack-sdk-expo` | `hypertrack-sdk-react-native` |
| -------- | --------------------- | ----------------------------- |
| 45.0.0   | 1.0.0                 | ^7.19.1                       |
| 46.0.14+ | 1.1.0                 | ^8.2.1                        |
| 46.0.14+ | 1.2.0                 | ^8.2.1                        |
| 46.0.14+ | 2.0.0                 | ^9.0.0                        |

## Configuring permission purpose strings

iOS requires specifying [permission purpose strings](https://hypertrack.com/docs/install-sdk-ios/#add-location-and-motion-purpose-strings) in `Info.plist` for app to build.

You can use plugin parameters described below to set the strings. 

 Every time you change the props or plugins, you'll need to rebuild (and `prebuild`) the native app. 

 If no extra properties are added, defaults will be used.

- `locationPermission` (_string_): Sets `NSLocationAlwaysAndWhenInUseUsageDescription`, `NSLocationAlwaysUsageDescription`, `NSLocationWhenInUseUsageDescription` 

- `motionPermission` (_string_): Sets `NSMotionUsageDescription` 

## Manual Setup

For bare workflow projects, you can follow the [manual setup guide](https://hypertrack.com/docs/install-sdk-react-native/#step-4-set-up-silent-push-notifications).
