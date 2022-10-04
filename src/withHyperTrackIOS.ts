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

export const withHyperTrackIOS: ConfigPlugin<Props> = (config, props) => {
  withBackgroundModes(config, props);
  return config;
};
