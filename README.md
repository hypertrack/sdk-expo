# Expo config plugin for React Native HyperTrack SDK

[![GitHub](https://img.shields.io/github/license/hypertrack/sdk-expo?color=orange)](./LICENSE)
[![npm](https://img.shields.io/npm/v/hypertrack-sdk-expo)](https://www.npmjs.com/package/hypertrack-sdk-expo)

[HyperTrack](https://www.hypertrack.com) lets you add live location tracking to your mobile app. Live location is made available along with ongoing activity, tracking controls and tracking outage with reasons.

React Native HyperTrack SDK is a wrapper around native iOS and Android SDKs that allows to integrate HyperTrack into React Native apps.

Expo [config plugin](https://docs.expo.io/guides/config-plugins/) enables usage of React Native HyperTrack SDK with Expo managed workflow.

For information about how to get started with Expo and React Native HyperTrack SDK, please check this [Guide](https://www.hypertrack.com/docs/install-sdk-expo).

## Installation

### Install HyperTrack SDK React Native

```
npx expo install hypertrack-sdk-react-native \
hypertrack-sdk-react-native-plugin-android-location-services-google \
hypertrack-sdk-react-native-plugin-android-activity-service-google \
hypertrack-sdk-react-native-plugin-android-push-service-firebase
```

Check the detailed installation guide for React Native [here](https://hypertrack.com/docs/install-sdk-react-native).

### Install Expo plugin

```
npx expo install hypertrack-sdk-expo
```

### Add HyperTrack Expo plugin to the app

Add `hypertrack-sdk-expo` to [`plugins`](https://docs.expo.io/versions/latest/config/app/#plugins) array of your `app.json` or `app.config.js`:

```json
{
  "expo": {
    "plugins": [
      [
        "hypertrack-sdk-expo",
        {
          "publishableKey": "YourPublishableKey", // find this in the HyperTrack dashboard
          "locationPermission": "We need your location to track delivered orders.",
          "motionPermission": "We need your motion to improve in-app experience."
        }
      ]
    ]
  }
}
```

You can check more plugin configuration options [here](PARAMS.md).

### Set up push notifications

- For iOS, to enable push notifcations you need to add [push notifications credentials](https://docs.expo.dev/app-signing/managed-credentials/#ios)
- For Android, to enable push notifcations you need to use [FCM for Push Notifications](https://docs.expo.dev/push-notifications/using-fcm/)

#### Manual Setup

For `Bare workflow projects, you can follow the [manual setup guide for React Native](https://hypertrack.com/docs/install-sdk-react-native/#set-up-silent-push-notifications).

## Sample code

[Quickstart Expo app](https://github.com/hypertrack/quickstart-expo)

## Wrapper API Documentation

[Wrapper API Documentation](https://hypertrack.github.io/sdk-react-native/)

## Versioning

Ensure you use versions that work together! These are the ones that have been tested by us at the time of release:

| `expo`   | `hypertrack-sdk-expo` | `hypertrack-sdk-react-native` |
| -------- | --------------------- | ----------------------------- |
| ^51.0.32 | ^4.3.0                | ^13.5.1                       |
| ^50.0.4  | 4.2.0                 | ^13.1.0                       |
| ^50.0.4  | 4.1.0                 | ^13.1.0                       |
| ^49.0.13 | 4.0.1                 | ^11.0.9                       |
| ^49.0.0  | 4.0.0                 | ^11.0.2                       |
| ^48.0.0  | 3.0.0                 | ^9.0.0                        |
| ^47.0.0  | 2.0.0                 | ^9.0.0                        |
| ^46.0.14 | 1.2.0                 | ^8.2.1                        |
| ^46.0.14 | 1.1.0                 | ^8.2.1                        |
| ^45.0.0  | 1.0.0                 | ^7.19.1                       |

## FAQ

### Working around missing device push token on iOS

If your devices are missing the push token, as a workaround you can set `proxyDevicePushTokenCall` plugin property to `true`. This will ensure you are calling HyperTrack SDK as soon as the device token is received in the AppDelegate.

### Configuring permission purpose strings

iOS requires specifying [permission purpose strings](https://hypertrack.com/docs/install-sdk-ios/#add-location-and-motion-purpose-strings) in `Info.plist` for app to build.

You can use plugin parameters described below to set the strings.

Every time you change the props or plugins, you'll need to rebuild (and `prebuild`) the native app.

- `locationPermission` (_string_): Sets `NSLocationAlwaysAndWhenInUseUsageDescription`, `NSLocationAlwaysUsageDescription`, `NSLocationWhenInUseUsageDescription`

- `motionPermission` (_string_): Sets `NSMotionUsageDescription`

Edit `hypertrack-sdk-expo` item in your `app.json` or `app.config.js`:

```json
{
  "expo": {
    "plugins": [
      [
        "hypertrack-sdk-expo",
        {
          "locationPermission": "PUT_YOUR_PERMISSION_HINT_MESSAGE_HERE",
          "motionPermission": "PUT_YOUR_PERMISSION_HINT_MESSAGE_HERE"
        }
      ]
    ]
  }
}
```
