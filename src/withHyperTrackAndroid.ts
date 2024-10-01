import {
  AndroidConfig,
  ConfigPlugin,
  WarningAggregator,
  withAndroidManifest,
  withAppBuildGradle,
  withProjectBuildGradle,
  withStringsXml,
} from "@expo/config-plugins";
import { mergeContents } from "@expo/config-plugins/build/utils/generateCode";
import { Props } from ".";
import {
  ManifestApplication,
  addMetaDataItemToMainApplication,
} from "@expo/config-plugins/build/android/Manifest";
import { ExpoConfig } from "@expo/config-types";

export const withHyperTrackAndroid: ConfigPlugin<Props> = (config, props) => {
  withAndroidPackage(config);
  withAndroidPackagingOptions(config);
  addCustomStrings(config, props);
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

export function addCustomStrings(config: any, props: Props) {
  const { foregroundNotificationText, foregroundNotificationTitle } = props || {};
  if (foregroundNotificationText !== undefined) {
    withCustomString(
      config,
      "hypertrack_foreground_notification_text",
      foregroundNotificationText
    );
  }
  if (foregroundNotificationTitle !== undefined) {
    withCustomString(
      config,
      "hypertrack_foreground_notification_title",
      foregroundNotificationTitle
    );
  }
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
      allowMockLocations,
      foregroundNotificationText,
      foregroundNotificationTitle,
      publishableKey,
    } = props || {};

    if (!publishableKey) {
      throw new Error("'publishableKey' param is required");
    }

    const applications = () => newConfig.modResults.manifest.application;

    newConfig.modResults.manifest.application = applications()?.map(
      (application: ManifestApplication) => {
        return addMetaDataItemToMainApplication(
          application,
          "HyperTrackPublishableKey",
          publishableKey!
        );
      }
    );

    if (allowMockLocations !== undefined) {
      newConfig.modResults.manifest.application = applications()?.map(
        (application: ManifestApplication) => {
          return addMetaDataItemToMainApplication(
            application,
            "HyperTrackAllowMockLocations",
            allowMockLocations.toString()
          );
        }
      );
    }

    if (foregroundNotificationText !== undefined) {
      newConfig.modResults.manifest.application = applications()?.map(
        (application: ManifestApplication) => {
          return addMetaDataItemToMainApplication(
            application,
            "HyperTrackForegroundNotificationText",
            "@string/hypertrack_foreground_notification_text",
            "resource"
          );
        }
      );
    }

    if (foregroundNotificationTitle !== undefined) {
      newConfig.modResults.manifest.application = applications()?.map(
        (application: ManifestApplication) => {
          return addMetaDataItemToMainApplication(
            application,
            "HyperTrackForegroundNotificationTitle",
            "@string/hypertrack_foreground_notification_title",
            "resource"
          );
        }
      );
    }

    return newConfig;
  });
};

function withCustomString(
  config: any,
  name: string,
  value: string
): ExpoConfig {
  return withStringsXml(config, (config) => {
    config.modResults = AndroidConfig.Strings.setStringItem(
      [
        // XML represented as JSON
        // <string name="expo_custom_value" translatable="false">value</string>
        { $: { name, translatable: "false" }, _: value },
      ],
      config.modResults
    );
    return config;
  });
}
