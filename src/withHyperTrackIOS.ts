import {
  ConfigPlugin,
  ExportedConfigWithProps,
  withInfoPlist,
  withDangerousMod,
  withAppDelegate,
} from "@expo/config-plugins";
import * as codegen from "@expo/config-plugins/build/utils/generateCode";

import { Props } from ".";
import * as fs from "fs";
import * as path from "path";

export const withHyperTrackIOS: ConfigPlugin<Props> = (config, props) => {
  withBackgroundModes(config, props);
  if (props.proxyDevicePushTokenCall) {
    withHTRNProxy(config, props);
  }
  return config;
};

const withHTRNProxy: ConfigPlugin<Props> = (config, props) => {
  let modifiedConfig = withDangerousMod(config, [
    "ios",
    async (config) => {
      // proxy HyperTrack SDK calls
      const newFileName = "HyperTrack.swift";
      const newFileContent = `
import Foundation
import HyperTrack

@objc public final class HyperTrackRNProxy: NSObject {
  @objc public static func didRegisterForRemoteNotifications(deviceToken: Data) {
    HyperTrack.didRegisterForRemoteNotificationsWithDeviceToken(deviceToken)
  }
}
`;
      const newFilePath = path.resolve(
        config.modRequest.platformProjectRoot,
        newFileName
      );
      if (!fs.existsSync(newFilePath)) {
        fs.writeFileSync(newFilePath, newFileContent);
      }
      return config;
    },
  ]);
  // add proxied function calls to AppDelegate
  return withHyperTrackAppDelegate(modifiedConfig, props);
};

const withHyperTrackAppDelegate: ConfigPlugin<Props> = (config, props) => {
  return withAppDelegate(config, (config) => {
    if (["objc", "objcpp"].includes(config.modResults.language)) {
      try {
        let projectName = config.name;
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
    } else {
      throw new Error(
        "Cannot setup HyperTrack because the AppDelegate is not Objective C"
      );
    }
    return config;
  });
};

const withBackgroundModes: ConfigPlugin<Props> = (config, props) => {
  const {
    locationPermission: locationPermissionDescription,
    motionPermission: motionPermissionDescription,
    publishableKey,
  } = props || {};

  if (!publishableKey) {
    throw new Error("'publishableKey' param is required");
  }

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
    newConfig.modResults.HyperTrackPublishableKey =
      publishableKey ?? "INVALID_PUBLISHABLE_KEY"; // TODO: should we crash here?

    return newConfig;
  });
};
