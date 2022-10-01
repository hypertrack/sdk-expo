"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withHyperTrackIOS = void 0;

const config_plugins_1 = require("@expo/config-plugins");

const NSLocationAlwaysAndWhenInUseUsageDescription = "To let your friends and family track you live, you need to allow HyperTrack Live to access this device's location";
const NSLocationAlwaysUsageDescription = "To let your friends and family track you live, you need to allow HyperTrack Live to access this device's location";
const NSLocationWhenInUseUsageDescription = "To let your friends and family track you live, you need to allow HyperTrack Live to access this device's location";
const NSMotionUsageDescription = "To track your movement accurately, HyperTrack Live needs to access motion sensors";

const withBackgroundModes = (config, props) => {
    const BACKGROUND_MODE_KEYS = ["location", "remote-notification"];
    return (0, config_plugins_1.withInfoPlist)(config, (newConfig) => {
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
            locationPermission !== null && locationPermission !== void 0 ? locationPermission : NSLocationAlwaysAndWhenInUseUsageDescription;
        newConfig.modResults.NSLocationAlwaysUsageDescription =
            locationPermission !== null && locationPermission !== void 0 ? locationPermission : NSLocationAlwaysUsageDescription;
        newConfig.modResults.NSLocationWhenInUseUsageDescription =
            locationPermission !== null && locationPermission !== void 0 ? locationPermission : NSLocationWhenInUseUsageDescription;
        newConfig.modResults.NSMotionUsageDescription =
            motionPermission !== null && motionPermission !== void 0 ? motionPermission : NSMotionUsageDescription;
        return newConfig;
    });
};

const withHyperTrackIOS = (config, props) => {
    withBackgroundModes(config, props);
    return config;
};

exports.withHyperTrackIOS = withHyperTrackIOS;
