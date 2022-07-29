import {
  ConfigPlugin,
  withInfoPlist,
  withAppDelegate,
} from "@expo/config-plugins";
import { Props } from ".";
import {
  mergeContents,
  MergeResults,
} from "@expo/config-plugins/build/utils/generateCode";

const NSLocationAlwaysAndWhenInUseUsageDescription =
  "To let your friends and family track you live, you need to allow HyperTrack Live to access this device's location";
const NSLocationAlwaysUsageDescription =
  "To let your friends and family track you live, you need to allow HyperTrack Live to access this device's location";
const NSLocationWhenInUseUsageDescription =
  "To let your friends and family track you live, you need to allow HyperTrack Live to access this device's location";
const NSMotionUsageDescription =
  "To track your movement accurately, HyperTrack Live needs to access motion sensors";

const withBackgroundModes: ConfigPlugin<Props> = (config, props) => {
  const BACKGROUND_MODE_KEYS = ["location", "remote-notification"];
  return withInfoPlist(config, (newConfig) => {
    if (!Array.isArray(newConfig.modResults.UIBackgroundModes)) {
      newConfig.modResults.UIBackgroundModes = [];
    }
    for (const key of BACKGROUND_MODE_KEYS) {
      if (!newConfig.modResults.UIBackgroundModes.includes(key)) {
        newConfig.modResults.UIBackgroundModes.push(key);
      }
    }
    const { locationPermission, motionPermission } = props || {};

    newConfig.modResults.NSLocationAlwaysAndWhenInUseUsageDescription =
      locationPermission ?? NSLocationAlwaysAndWhenInUseUsageDescription;
    newConfig.modResults.NSLocationAlwaysUsageDescription =
      locationPermission ?? NSLocationAlwaysUsageDescription;
    newConfig.modResults.NSLocationWhenInUseUsageDescription =
      locationPermission ?? NSLocationWhenInUseUsageDescription;
    newConfig.modResults.NSMotionUsageDescription =
      motionPermission ?? NSMotionUsageDescription;

    return newConfig;
  });
};

function addHyperTrackAppDelegateImport(src: string): MergeResults {
  return mergeContents({
    tag: "hypertrack-sdk-expo-import",
    src,
    newSrc: `#import <CoreLocation/CoreLocation.h>
      #import <HyperTrack/HyperTrack-Swift.h>`,
    anchor: /#import "AppDelegate\.h"/,
    offset: 1,
    comment: "//",
  });
}

function addHyperTrackAppDelegateInit(src: string): MergeResults {
  return mergeContents({
    tag: "hypertrack-sdk-expo-didFinishLaunchingWithOptions",
    src,
    newSrc: `[HTSDK registerForRemoteNotifications];`,
    anchor: `return YES;`,
    offset: 0,
    comment: "//",
  });
}

function addHyperTrackAppDelegateDidRegisterForRemoteNotificationsWithDeviceToken(
  src: string
): MergeResults {
  return mergeContents({
    tag: "hypertrack-sdk-expo-didRegisterForRemoteNotificationsWithDeviceToken",
    src,
    newSrc: `[HTSDK didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];`,
    anchor:
      /return \[super application:application didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];$/,
    offset: 0,
    comment: "//",
  });
}

function addHyperTrackAppDelegateDidFailToRegisterForRemoteNotificationsWithError(
  src: string
): MergeResults {
  return mergeContents({
    tag: "hypertrack-sdk-expo-didFailToRegisterForRemoteNotificationsWithError",
    src,
    newSrc: `[HTSDK didFailToRegisterForRemoteNotificationsWithError:error];`,
    anchor:
      /return \[super application:application didFailToRegisterForRemoteNotificationsWithError:error];$/,
    offset: 0,
    comment: "//",
  });
}

function addHyperTrackAppDelegateDidReceiveRemoteNotification(
  src: string
): MergeResults {
  return mergeContents({
    tag: "hypertrack-sdk-expo-didReceiveRemoteNotification",
    src,
    newSrc: `[HTSDK didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];`,
    anchor:
      /return \[super application:application didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];$/,
    offset: 0,
    comment: "//",
  });
}

const withHyperTrackAppDelegate: ConfigPlugin<Props> = (config, props) => {
  return withAppDelegate(config, (config) => {
    if (["objc", "objcpp"].includes(config.modResults.language)) {
      try {
        config.modResults.contents = addHyperTrackAppDelegateImport(
          config.modResults.contents
        ).contents;
        config.modResults.contents = addHyperTrackAppDelegateInit(
          config.modResults.contents
        ).contents;
        config.modResults.contents =
          addHyperTrackAppDelegateDidRegisterForRemoteNotificationsWithDeviceToken(
            config.modResults.contents
          ).contents;
        config.modResults.contents =
          addHyperTrackAppDelegateDidFailToRegisterForRemoteNotificationsWithError(
            config.modResults.contents
          ).contents;
        config.modResults.contents =
          addHyperTrackAppDelegateDidReceiveRemoteNotification(
            config.modResults.contents
          ).contents;
      } catch (error: any) {
        if (error.code === "ERR_NO_MATCH") {
          throw new Error(
            `Cannot add HyperTrack to the project's AppDelegate because it's malformed. Please report this with a copy of your project AppDelegate.`
          );
        }
        throw error;
      }
    } else {
      throw new Error(
        "Cannot setup HyperTrack because the AppDelegate is not Objective C"
      );
    }
    return config;
  });
};

export const withHyperTrackIOS: ConfigPlugin<Props> = (config, props) => {
  withBackgroundModes(config, props);
  withHyperTrackAppDelegate(config, props);
  return config;
};
