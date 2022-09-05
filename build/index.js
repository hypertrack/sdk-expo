"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_plugins_1 = require("@expo/config-plugins");
const withHyperTrackAndroid_1 = require("./withHyperTrackAndroid");
const withHyperTrackIOS_1 = require("./withHyperTrackIOS");
const withHyperTrack = (config, props) => {
    config = (0, withHyperTrackIOS_1.withHyperTrackIOS)(config, props);
    config = (0, withHyperTrackAndroid_1.withHyperTrackAndroid)(config, props);
    return config;
};
exports.default = (0, config_plugins_1.createRunOncePlugin)(withHyperTrack, "hypertrack-sdk-expo", "1.0.0");
