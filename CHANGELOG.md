# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2023-03-03
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
