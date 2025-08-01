import {
  ConfigPlugin,
  withInfoPlist,
  withAppDelegate,
  withXcodeProject,
} from "@expo/config-plugins";
import { withBuildSourceFile } from "@expo/config-plugins/build/ios/XcodeProjectFile";
import * as codegen from "@expo/config-plugins/build/utils/generateCode";

import { Props } from ".";

export const withHyperTrackIOS: ConfigPlugin<Props> = (config, props) => {
  withBackgroundModes(config, props);
  if (props.proxyDevicePushTokenCall !== undefined) {
    if (typeof props.proxyDevicePushTokenCall !== "boolean") {
      throw new Error("'proxyDevicePushTokenCall' param must be a boolean");
    }
    if (props.proxyDevicePushTokenCall === true) {
      withHTRNProxy(config, props);
    }
  }
  return config;
};

const withHTRNProxy: ConfigPlugin<Props> = (config, props) => {
  let modifiedConfig = withBuildSourceFile(config, {
    filePath: "HyperTrack.swift",
    contents: `
import Foundation
import HyperTrack

@objc public final class HyperTrackRNProxy: NSObject {
  @objc public static func didRegisterForRemoteNotifications(deviceToken: Data) {
    HyperTrack.didRegisterForRemoteNotificationsWithDeviceToken(deviceToken)
  }
}
`,
    overwrite: true,
  });
  // add proxied function calls to AppDelegate
  return withHyperTrackAppDelegate(modifiedConfig, props);
};

const withHyperTrackAppDelegate: ConfigPlugin<Props> = (config, props) => {
  let projectName: string | undefined = undefined;
  let _ = withXcodeProject(config, (config) => {
    projectName = config.modRequest.projectName;
    return config;
  });

  return withAppDelegate(config, (config) => {
    if (["objc", "objcpp"].includes(config.modResults.language)) {
      try {
        // work around source: https://github.com/expo/expo/issues/17705#issuecomment-1196251146
        //> Using #import "ExpoModulesCore-Swift.h" just before #import "ProjectName-Swift.h" in AppDelegate.mm should resolve the problem
        // then import the bridging header for the project
        config.modResults.contents = codegen.mergeContents({
          tag: "hypertrack-sdk-expo-import",
          src: config.modResults.contents,
          newSrc: `
#import "ExpoModulesCore-Swift.h"
#import "${projectName}-Swift.h"
`,
          anchor: /#import "AppDelegate\.h"/,
          offset: 1,
          comment: "//",
        }).contents;

        // generate didRegisterForRemoteNotificationsWithDeviceToken proxy call
        config.modResults.contents = codegen.mergeContents({
          tag: "hypertrack-sdk-expo-didRegisterForRemoteNotifications",
          src: config.modResults.contents,
          newSrc: `[HyperTrackRNProxy didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];`,
          anchor:
            /return \[super application:application didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];$/,
          offset: 0,
          comment: "//",
        }).contents;
      } catch (error) {
        if (error.code === "ERR_NO_MATCH") {
          throw new Error(
            `Cannot add HyperTrack to the project's AppDelegate because it's malformed. Please report this with a copy of your project AppDelegate.`
          );
        }
        throw error;
      }
    } else if (config.modResults.language === "swift") {
      try {
        // Add import for HyperTrackRNProxy
        config.modResults.contents = codegen.mergeContents({
          tag: "hypertrack-sdk-expo-swift-import",
          src: config.modResults.contents,
          newSrc: `import HyperTrack`,
          anchor: /import Expo/,
          offset: 1,
          comment: "//",
        }).contents;

        // Add didRegisterForRemoteNotificationsWithDeviceToken method for Swift
        config.modResults.contents = codegen.mergeContents({
          tag: "hypertrack-sdk-expo-swift-didRegisterForRemoteNotifications",
          src: config.modResults.contents,
          newSrc: `
  public override func application(
    _ application: UIApplication,
    didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data
  ) {
    HyperTrackRNProxy.didRegisterForRemoteNotifications(deviceToken: deviceToken)
    super.application(application, didRegisterForRemoteNotificationsWithDeviceToken: deviceToken)
  }
`,
          anchor: /var reactNativeFactory: RCTReactNativeFactory?/,
          offset: 2,
          comment: "//",
        }).contents;
      } catch (error) {
        if (error.code === "ERR_NO_MATCH") {
          throw new Error(
            `Cannot add HyperTrack to the project's Swift AppDelegate because it's malformed: ${error.message}`
          );
        }
        throw error;
      }
    } else {
      throw new Error(
        `Cannot setup HyperTrack because the AppDelegate is not Objective C or Swift: ${config.modResults.language}`
      );
    }
    return config;
  });
};

const withBackgroundModes: ConfigPlugin<Props> = (config, props) => {
  // the plugin param key name is on the left side!
  const {
    locationPermission: locationPermissionDescription,
    motionPermission: motionPermissionDescription,
    allowMockLocation,
    publishableKey,
    swizzlingDidReceiveRemoteNotificationEnabled,
  } = props || {};

  const BACKGROUND_MODE_KEYS = ["location", "remote-notification"];
  return withInfoPlist(config, (newConfig) => {
    // Set UIBackgroundModes
    if (!Array.isArray(newConfig.modResults.UIBackgroundModes)) {
      newConfig.modResults.UIBackgroundModes = [];
    }
    for (const key of BACKGROUND_MODE_KEYS) {
      if (!newConfig.modResults.UIBackgroundModes.includes(key)) {
        newConfig.modResults.UIBackgroundModes.push(key);
      }
    }

    // Set permission descriptions
    newConfig.modResults.NSLocationAlwaysAndWhenInUseUsageDescription =
      locationPermissionDescription;
    newConfig.modResults.NSLocationAlwaysUsageDescription =
      locationPermissionDescription;
    newConfig.modResults.NSLocationWhenInUseUsageDescription =
      locationPermissionDescription;
    newConfig.modResults.NSMotionUsageDescription = motionPermissionDescription;

    // Set SDK init params
    if (publishableKey !== undefined) {
      newConfig.modResults.HyperTrackPublishableKey = publishableKey;
    } else {
      throw new Error(
        "'publishableKey' param is required for HyperTrack Expo plugin"
      );
    }
    if (swizzlingDidReceiveRemoteNotificationEnabled !== undefined) {
      if (typeof swizzlingDidReceiveRemoteNotificationEnabled !== "boolean") {
        throw new Error(
          "'swizzlingDidReceiveRemoteNotificationEnabled' param must be a boolean"
        );
      }
      newConfig.modResults.HyperTrackSwizzlingDidReceiveRemoteNotificationEnabled =
        swizzlingDidReceiveRemoteNotificationEnabled;
    }
    if (allowMockLocation !== undefined) {
      if (typeof allowMockLocation !== "boolean") {
        throw new Error("'allowMockLocation' param must be a boolean");
      }
      newConfig.modResults.HyperTrackAllowMockLocation = allowMockLocation;
    }
    return newConfig;
  });
};
