import {
  ConfigPlugin,
  WarningAggregator,
  withAndroidManifest,
  withAppBuildGradle,
  withProjectBuildGradle,
} from "@expo/config-plugins";
import { mergeContents } from "@expo/config-plugins/build/utils/generateCode";
import { Props } from ".";
import { ExpoConfig } from "@expo/config-types";
import {
  ManifestApplication,
  addMetaDataItemToMainApplication,
} from "@expo/config-plugins/build/android/Manifest";

export const withHyperTrackAndroid: ConfigPlugin<Props> = (config, props) => {
  withAndroidPackage(config);
  withAndroidPackagingOptions(config);
  updateAndroidManifest(config, props);
  return config;
};

export const withAndroidPackage: ConfigPlugin = (config) => {
  return withProjectBuildGradle(config, (config) => {
    if (config.modResults.language === "groovy") {
      config.modResults.contents = addMaven(
        config.modResults.contents
      ).contents;
    } else {
      WarningAggregator.addWarningAndroid(
        "hypertrack-sdk-expo",
        `Cannot automatically configure project build.gradle if it's not groovy`
      );
    }
    return config;
  });
};

export function addMaven(src: string) {
  return mergeContents({
    tag: "hypertrack-sdk-expo-build-gradle",
    src,
    newSrc: `        maven {
            name 'hypertrack'
            url 'https://s3-us-west-2.amazonaws.com/m2.hypertrack.com/'
          }`,
    anchor: /allprojects {/,
    offset: 2,
    comment: "//",
  });
}

export const withAndroidPackagingOptions: ConfigPlugin = (config) => {
  return withAppBuildGradle(config, (config) => {
    if (config.modResults.language === "groovy") {
      config.modResults.contents = addAndroidPackagingOptions(
        config.modResults.contents
      ).contents;
    } else {
      WarningAggregator.addWarningAndroid(
        "hypertrack-sdk-expo",
        `Cannot automatically configure app build.gradle if it's not groovy`
      );
    }
    return config;
  });
};

export function addAndroidPackagingOptions(src: string) {
  return mergeContents({
    tag: "hypertrack-sdk-expo-packaging-options",
    src,
    newSrc: packagingOptionsContents,
    anchor: /android(?:\s+)?\{/,
    // Inside the android block.
    offset: 1,
    comment: "//",
  });
}

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

const updateAndroidManifest: ConfigPlugin<Props> = (config, props) => {
  return withAndroidManifest(config, (newConfig) => {
    const {
      publishableKey,
      allowMockLocations,
      loggingEnabled,
      automaticallyRequestPermissions,
    } = props || {};

    const applications = () => newConfig.modResults.manifest.application;

    newConfig.modResults.manifest.application = applications()
      ?.map((application: ManifestApplication) => {
        return addMetaDataItemToMainApplication(
          application,
          "HyperTrackPublishableKey",
          publishableKey!
        );
      })
      ?.map((application: ManifestApplication) => {
        return addMetaDataItemToMainApplication(
          application,
          "HyperTrackAllowMockLocations",
          allowMockLocations ? "true" : "false"
        );
      })
      ?.map((application: ManifestApplication) => {
        return addMetaDataItemToMainApplication(
          application,
          "HyperTrackLoggingEnabled",
          loggingEnabled ? "true" : "false"
        );
      })
      ?.map((application: ManifestApplication) => {
        return addMetaDataItemToMainApplication(
          application,
          "HyperTrackAutomaticallyRequestPermissions",
          automaticallyRequestPermissions ? "true" : "false"
        );
      });

    return newConfig;
  });
};
