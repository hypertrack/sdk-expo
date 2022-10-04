# hypertrack-sdk-expo

Config plugin to auto configure `hypertrack-sdk-expo` when the native code is generated (`expo prebuild`).

## Versioning

Ensure you use versions that work together!

|  `expo`  | `hypertrack-sdk-expo` | `hypertrack-sdk-react-native` |
| -------- | --------------------- | ----------------------------- |
| 45.0.0   | 1.0.0                 | 7.19.1                        |
| 46.0.14  | 1.1.0                 | 8.2.1                         |

## Expo installation

> Tested against Expo SDK 45

> This package cannot be used in the "Expo Go" app because [it requires custom native code](https://docs.expo.io/workflow/customizing/).
> First install the package with yarn, npm, or [`expo install`](https://docs.expo.io/workflow/expo-cli/#expo-install).

```sh
#npm
npm install hypertrack-sdk-react-native hypertrack-sdk-expo expo-build-properties

#yarn
yarn add hypertrack-sdk-react-native hypertrack-sdk-expo expo-build-properties
```

After installing this npm package, add the [config plugin](https://docs.expo.io/guides/config-plugins/) to the [`plugins`](https://docs.expo.io/versions/latest/config/app/#plugins) array of your `app.json` or `app.config.js`:

```json
{
  "expo": {
    "plugins": [
      "hypertrack-sdk-expo",
      [
        "expo-build-properties",
        {
          "android": {
            "minSdkVersion": 23
          }
        }
      ]
    ]
  }
}
```

> NOTE: to work properly on Android, this package requires `minSdkVersion=23`

Next, rebuild your app as described in the ["Adding custom native code"](https://docs.expo.io/workflow/customizing/) guide.

## API

The plugin provides props for extra customization. Every time you change the props or plugins, you'll need to rebuild (and `prebuild`) the native app. If no extra properties are added, defaults will be used.

- `locationPermission` (_string_): Sets the iOS `NSLocationAlwaysAndWhenInUseUsageDescription NSLocationAlwaysUsageDescription NSLocationWhenInUseUsageDescription` permissions message to the `Info.plist`. Defaults to `To let your friends and family track you live, you need to allow HyperTrack Live to access this device's location`.
- `motionPermission` (_string_): Sets the iOS `NSMotionUsageDescription` permission message to the `Info.plist`. Defaults to `To track your movement accurately, HyperTrack Live needs to access motion sensors`.

`app.config.js`

```ts
export default {
  plugins: [
    [
      "hypertrack-sdk-expo",
      {
        locationPermission:
          "To let your friends and family track you live, you need to allow HyperTrack Live to access this device's location",
        motionPermission:
          "To track your movement accurately, HyperTrack Live needs to access motion sensors",
      },
    ],
  ],
};
```

## Important Notes

- For iOS, to enable push notifcations you need to add [push notifications credential](https://docs.expo.dev/app-signing/managed-credentials/#ios).
- For Android, to enable push notifcations you need to use [FCM for Push Notifications](https://docs.expo.dev/push-notifications/using-fcm/).
- For Android, this plugin changes the minimum sdk version to `23` (from `21`) which may break other packages in your app!

## Manual Setup

For bare workflow projects, you can follow the [manual setup guide](https://hypertrack.com/docs/install-sdk-react-native/#step-4-set-up-silent-push-notifications).
