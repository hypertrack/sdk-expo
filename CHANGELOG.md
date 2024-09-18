# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [4.3.0] - 2024-09-18

### Changed

- Updated Expo dependency to `51`

### Fixed

- Removed fixed package manager version

## [4.2.0] - 2024-06-06

### Added

- `swizzlingDidReceiveRemoteNotificationEnabled` config plugin property to disable method swizzling for `didReceiveRemoteNotification()` method on iOS

## [4.1.0] - 2024-01-31

### Added

- `proxyDevicePushTokenCall` config plugin property

## [4.0.1] - 2023-11-11

### Fixed

- Deleted leftover config plugin properties which were removed in new SDK version

## [4.0.0] - 2023-10-03

### Changed

- Updated expo required version to 49
- Updated [React Native HyperTrack SDK](https://github.com/hypertrack/sdk-react-native) version to `11.0.2`
  - binds iOS `5.0.2` and Android `7.0.3` native SDKs

## [3.0.0] - 2023-03-07

### Changed

- Updated expo required version to 48

## [2.0.0] - 2023-03-03

### Changed

- Updated expo required version to 47

### Removed

- AppDelegate methods for push notifications (we don't need them anymore for HyperTrack iOS SDK 4.14.0+)

## [1.2.0] - 2023-01-04

### Changed

- Bumped the minimum deployment target to iOS 13, in lockstep with Expo

## [1.1.0] - 2022-10-04

### Changed

- Use ExpoAppDelegateSubscriber protocol to proxy AppDelegate methods ([#2](https://github.com/hypertrack/sdk-expo/pull/2))

## [1.0.0] - 2022-07-29

### Added

- Initial release of the expo plugin.

[4.3.0]: https://github.com/hypertrack/sdk-expo/releases/tag/4.3.0
[4.2.0]: https://github.com/hypertrack/sdk-expo/releases/tag/4.2.0
[4.1.0]: https://github.com/hypertrack/sdk-expo/releases/tag/4.1.0
[4.0.1]: https://github.com/hypertrack/sdk-expo/releases/tag/4.0.1
[4.0.0]: https://github.com/hypertrack/sdk-expo/releases/tag/4.0.0
[3.0.0]: https://github.com/hypertrack/sdk-expo/releases/tag/3.0.0
[2.0.0]: https://github.com/hypertrack/sdk-expo/releases/tag/2.0.0
[1.2.0]: https://github.com/hypertrack/sdk-expo/releases/tag/1.2.0
[1.1.0]: https://github.com/hypertrack/sdk-expo/releases/tag/1.1.0
[1.0.0]: https://github.com/hypertrack/sdk-expo/releases/tag/1.0.0
