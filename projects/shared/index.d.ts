declare enum SUPPORT_PROTOCOLS {
  http = "http",
  https = "https",
}

declare type ProtocolValue = SUPPORT_PROTOCOLS.http | SUPPORT_PROTOCOLS.https;

declare const APP_READY_MESSAGE: string;
declare const APP_DISPLAY_EXTENSION_SETTINGS_OPTION: string;
declare const APP_NAVIGATE_TO_EXTENSION_SETTINGS: string;
declare const PORT_RANGE: [number, number];
declare const DEFAULT_HOST_NAME: string;
declare const DEFAULT_API_KEY: string;
declare const DEFAULT_PROTOCOL: ProtocolValue;
declare const DEFAULT_SELF_IDENTIFICATION: string;
export {
  APP_READY_MESSAGE,
  APP_DISPLAY_EXTENSION_SETTINGS_OPTION,
  APP_NAVIGATE_TO_EXTENSION_SETTINGS,
  PORT_RANGE,
  DEFAULT_HOST_NAME,
  DEFAULT_API_KEY,
  DEFAULT_PROTOCOL,
  SUPPORT_PROTOCOLS,
  DEFAULT_SELF_IDENTIFICATION,
};
