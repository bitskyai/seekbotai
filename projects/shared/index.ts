export enum SUPPORT_PROTOCOLS {
  http = "http",
  https = "https",
}
export const APP_READY_MESSAGE = `__BITSKY_APP_READY__`;
export const APP_DISPLAY_EXTENSION_SETTINGS_OPTION = `__BITSKY_APP_DISPLAY_EXTENSION_SETTINGS_OPTION__`;
export const APP_NAVIGATE_TO_EXTENSION_SETTINGS =
  "__BITSKY_APP_NAVIGATE_TO_EXTENSION_SETTINGS__";
export const PORT_RANGE = [46897, 48897];
// this is a default host name, user able to change it in extension and desktop app settings page
export const DEFAULT_HOST_NAME = "127.0.0.1";
// this is a default API KEY, user able to change it in extension and desktop app settings page
export const DEFAULT_API_KEY = "40407dcf-e486-4c0e-b053-e9aadf2c205b";
// this is a default protocol, user able to change it in extension and desktop app settings page
export const DEFAULT_PROTOCOL = SUPPORT_PROTOCOLS.http;
// this is a default port, user able to change it in extension and desktop app settings page
export const DEFAULT_SELF_IDENTIFICATION =
  "c810f737-5680-4c58-9f6c-aee2b93f8b79";
// this is a default master key for meilisearch. TODO: make it configurable
export const DEFAULT_MEILISEARCH_MASTER_KEY =
  "8499a9f9-a7a5-4bb2-a445-bc82afe1366c";
export const DEFAULT_MEILISEARCH_PORT = 47700;

export const HISTORY_TAG = "History";
export const SCREENSHOT_PREVIEW_CROP_HEIGHT = 300;
export const SCREENSHOT_PREVIEW_CROP_WIDTH = 485;
