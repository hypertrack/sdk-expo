"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withHyperTrackIOS = void 0;
const config_plugins_1 = require("@expo/config-plugins");
const generateCode_1 = require("@expo/config-plugins/build/utils/generateCode");
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
function addHyperTrackAppDelegateImport(src) {
    return (0, generateCode_1.mergeContents)({
        tag: "hypertrack-sdk-expo-import",
        src,
        newSrc: `#import <CoreLocation/CoreLocation.h>
      #import <HyperTrack/HyperTrack-Swift.h>`,
        anchor: /#import "AppDelegate\.h"/,
        offset: 1,
        comment: "//",
    });
}
function addHyperTrackAppDelegateInit(src) {
    return (0, generateCode_1.mergeContents)({
        tag: "hypertrack-sdk-expo-didFinishLaunchingWithOptions",
        src,
        newSrc: `[HTSDK registerForRemoteNotifications];`,
        anchor: `return YES;`,
        offset: 0,
        comment: "//",
    });
}
function addHyperTrackAppDelegateDidRegisterForRemoteNotificationsWithDeviceToken(src) {
    return (0, generateCode_1.mergeContents)({
        tag: "hypertrack-sdk-expo-didRegisterForRemoteNotificationsWithDeviceToken",
        src,
        newSrc: `[HTSDK didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];`,
        anchor: /return \[super application:application didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];$/,
        offset: 0,
        comment: "//",
    });
}
function addHyperTrackAppDelegateDidFailToRegisterForRemoteNotificationsWithError(src) {
    return (0, generateCode_1.mergeContents)({
        tag: "hypertrack-sdk-expo-didFailToRegisterForRemoteNotificationsWithError",
        src,
        newSrc: `[HTSDK didFailToRegisterForRemoteNotificationsWithError:error];`,
        anchor: /return \[super application:application didFailToRegisterForRemoteNotificationsWithError:error];$/,
        offset: 0,
        comment: "//",
    });
}
function addHyperTrackAppDelegateDidReceiveRemoteNotification(src) {
    return (0, generateCode_1.mergeContents)({
        tag: "hypertrack-sdk-expo-didReceiveRemoteNotification",
        src,
        newSrc: `[HTSDK didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];`,
        anchor: /return \[super application:application didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];$/,
        offset: 0,
        comment: "//",
    });
}
const withHyperTrackAppDelegate = (config, props) => {
    return (0, config_plugins_1.withAppDelegate)(config, (config) => {
        if (["objc", "objcpp"].includes(config.modResults.language)) {
            try {
                config.modResults.contents = addHyperTrackAppDelegateImport(config.modResults.contents).contents;
                config.modResults.contents = addHyperTrackAppDelegateInit(config.modResults.contents).contents;
                config.modResults.contents =
                    addHyperTrackAppDelegateDidRegisterForRemoteNotificationsWithDeviceToken(config.modResults.contents).contents;
                config.modResults.contents =
                    addHyperTrackAppDelegateDidFailToRegisterForRemoteNotificationsWithError(config.modResults.contents).contents;
                config.modResults.contents =
                    addHyperTrackAppDelegateDidReceiveRemoteNotification(config.modResults.contents).contents;
            }
            catch (error) {
                if (error.code === "ERR_NO_MATCH") {
                    throw new Error(`Cannot add HyperTrack to the project's AppDelegate because it's malformed. Please report this with a copy of your project AppDelegate.`);
                }
                throw error;
            }
        }
        else {
            throw new Error("Cannot setup HyperTrack because the AppDelegate is not Objective C");
        }
        return config;
    });
};
const withHyperTrackIOS = (config, props) => {
    withBackgroundModes(config, props);
    withHyperTrackAppDelegate(config, props);
    return config;
};
exports.withHyperTrackIOS = withHyperTrackIOS;
