import { ConfigPlugin, withInfoPlist } from "@expo/config-plugins";
import { Props } from ".";

export const withHyperTrackIOS: ConfigPlugin<Props> = (config, props) => {
  withBackgroundModes(config, props);
  return config;
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
