"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withHyperTrackAndroid = exports.addAndroidPackagingOptions = exports.withAndroidPackagingOptions = exports.addMaven = exports.withAndroidPackage = void 0;
const config_plugins_1 = require("@expo/config-plugins");
const generateCode_1 = require("@expo/config-plugins/build/utils/generateCode");
const withAndroidPackage = (config) => {
    return (0, config_plugins_1.withProjectBuildGradle)(config, (config) => {
        if (config.modResults.language === "groovy") {
            config.modResults.contents = addMaven(config.modResults.contents).contents;
        }
        else {
            config_plugins_1.WarningAggregator.addWarningAndroid("hypertrack-sdk-expo", `Cannot automatically configure project build.gradle if it's not groovy`);
        }
        return config;
    });
};
exports.withAndroidPackage = withAndroidPackage;
function addMaven(src) {
    return (0, generateCode_1.mergeContents)({
        tag: "hypertrack-sdk-expo-build-gradle",
        src,
        newSrc: `maven {
        name 'hypertrack'
        url 'https://s3-us-west-2.amazonaws.com/m2.hypertrack.com/'
    }`,
        anchor: /mavenCentral {/,
        offset: -2,
        comment: "//",
    });
}
exports.addMaven = addMaven;
const withAndroidPackagingOptions = (config) => {
    return (0, config_plugins_1.withAppBuildGradle)(config, (config) => {
        if (config.modResults.language === "groovy") {
            config.modResults.contents = addAndroidPackagingOptions(config.modResults.contents).contents;
        }
        else {
            config_plugins_1.WarningAggregator.addWarningAndroid("hypertrack-sdk-expo", `Cannot automatically configure app build.gradle if it's not groovy`);
        }
        return config;
    });
};
exports.withAndroidPackagingOptions = withAndroidPackagingOptions;
function addAndroidPackagingOptions(src) {
    return (0, generateCode_1.mergeContents)({
        tag: "hypertrack-sdk-expo-packaging-options",
        src,
        newSrc: packagingOptionsContents,
        anchor: /android(?:\s+)?\{/,
        // Inside the android block.
        offset: 1,
        comment: "//",
    });
}
exports.addAndroidPackagingOptions = addAndroidPackagingOptions;
const packagingOptionsContents = `
    packagingOptions {
        pickFirst 'lib/x86/libc++_shared.so'
        pickFirst 'lib/x86_64/libjsc.so'
        pickFirst 'lib/arm64-v8a/libjsc.so'
        pickFirst 'lib/arm64-v8a/libc++_shared.so'
        pickFirst 'lib/x86_64/libc++_shared.so'
        pickFirst 'lib/armeabi-v7a/libc++_shared.so'
    }
`;
const withHyperTrackAndroid = (config, props) => {
    (0, exports.withAndroidPackage)(config);
    (0, exports.withAndroidPackagingOptions)(config);
    return config;
};
exports.withHyperTrackAndroid = withHyperTrackAndroid;
