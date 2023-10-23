import {
  AndroidConfig,
  ConfigPlugin,
  createRunOncePlugin,
} from "@expo/config-plugins";
import { withHyperTrackAndroid } from "./withHyperTrackAndroid";
import { withHyperTrackIOS } from "./withHyperTrackIOS";

export type Props = {
  locationPermission?: string;
  publishableKey?: string;
};
const withHyperTrack: ConfigPlugin<Props> = (config, props) => {
  config = withHyperTrackIOS(config, props);
  config = withHyperTrackAndroid(config, props);
  return config;
};

export default createRunOncePlugin(
  withHyperTrack,
  "hypertrack-sdk-expo",
  "4.0.0"
);
