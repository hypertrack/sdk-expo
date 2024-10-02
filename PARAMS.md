# Plugin configuration parameters

You can provide these params to the plugin in `app.json` to configure the plugin like this:

```json
{
    "plugins": [
      [
        "hypertrack-sdk-expo",
        {
          <param>: <value>
        }
      ]
    ],
}
```

## Parameters

allowMockLocation?: boolean;
foregroundNotificationText?: string;
foregroundNotificationTitle?: string;
locationPermission?: string;
motionPermission?: string;
publishableKey: string;
proxyDevicePushTokenCall?: boolean;
swizzlingDidReceiveRemoteNotificationEnabled?: boolean;

Check [SDK configuration](https://hypertrack.com/docs/sdk-config) doc for more detailed informtion about the params.

| Param                       | Type      | Description                                                                                                                                                                     |
| --------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| allowMockLocation           | `boolean` | Allow mocking locations (if set to false any mocked location will be filtered and the outage will be displayed in the Dashboard). Default: false                                |
| foregroundNotificationText  | `string`  | Text for the foreground service notification on Android                                                                                                                         |
| foregroundNotificationTitle | `string`  | Title for the foreground service notification on Android                                                                                                                        |
| locationPermission          | `string`  | Location permission permission purpose string (see [Configuring permission purpose strings](README.md#configuring-permission-purpose-strings))                                  |
| motionPermission            | `string`  | Motion permission purpose string (see [Configuring permission purpose strings](README.md#configuring-permission-purpose-strings))                                               |
| publishableKey              | `string`  | HyperTrack publishable key                                                                                                                                                      |
| proxyDevicePushTokenCall    | `boolean` | Proxy device push token call to the plugin. See [Working around missing device push token on iOS](README.md#working-around-missing-device-push-token-on-ios). False by default. |
