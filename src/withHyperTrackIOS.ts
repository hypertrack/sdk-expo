import { ConfigPlugin, withInfoPlist } from "@expo/config-plugins";
import { Props } from ".";

const LOCATION_PERMISSION_HINT =
  "You need this permission to allow HyperTrack to track your location";

const NSLocationAlwaysAndWhenInUseUsageDescription = LOCATION_PERMISSION_HINT;
const NSLocationAlwaysUsageDescription = LOCATION_PERMISSION_HINT;
const NSLocationWhenInUseUsageDescription = LOCATION_PERMISSION_HINT;
const NSMotionUsageDescription =
  "To track your movement accurately, HyperTrack Live needs to access motion sensors";

export const withHyperTrackIOS: ConfigPlugin<Props> = (config, props) => {
  withBackgroundModes(config, props);
  return config;
};

const withBackgroundModes: ConfigPlugin<Props> = (config, props) => {
  const {
    locationPermission: locationPermissionDescription,
    motionPermission: motionPermissionDescription,
    publishableKey,
    automaticallyRequestPermissions,
    allowMockLocations,
    loggingEnabled,
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
      locationPermissionDescription ??
      NSLocationAlwaysAndWhenInUseUsageDescription;
    newConfig.modResults.NSLocationAlwaysUsageDescription =
      locationPermissionDescription ?? NSLocationAlwaysUsageDescription;
    newConfig.modResults.NSLocationWhenInUseUsageDescription =
      locationPermissionDescription ?? NSLocationWhenInUseUsageDescription;
    newConfig.modResults.NSMotionUsageDescription =
      motionPermissionDescription ?? NSMotionUsageDescription;

    // Set SDK init params
    newConfig.modResults.HyperTrackPublishableKey =
      publishableKey ?? "INVALID_PUBLISHABLE_KEY";
    newConfig.modResults.HyperTrackAutomaticallyRequestPermissions =
      automaticallyRequestPermissions ?? false;
    newConfig.modResults.HyperTrackAllowMockLocations =
      allowMockLocations ?? false;
    newConfig.modResults.HyperTrackLoggingEnabled = loggingEnabled ?? false;

    return newConfig;
  });
};
