const SUPPORT_PROTOCOLS = Object.freeze({
  http: "http",
  https: "https",
});

module.exports = {
  APP_READY_MESSAGE: `__BITSKY_APP_READY__`,
  APP_DISPLAY_EXTENSION_SETTINGS_OPTION: `__BITSKY_APP_DISPLAY_EXTENSION_SETTINGS_OPTION__`,
  APP_NAVIGATE_TO_EXTENSION_SETTINGS:
    "__BITSKY_APP_NAVIGATE_TO_EXTENSION_SETTINGS__",
  PORT_RANGE: [46897, 46997],
  SUPPORT_PROTOCOLS,
  // this is a default host name, user able to change it in extension and desktop app settings page
  DEFAULT_HOST_NAME: "127.0.0.1",
  // this is a default API KEY, user able to change it in extension and desktop app settings page
  DEFAULT_API_KEY: "40407dcf-e486-4c0e-b053-e9aadf2c205b",
  // this is a default protocol, user able to change it in extension and desktop app settings page
  DEFAULT_PROTOCOL: SUPPORT_PROTOCOLS.http,
  // this is a default port, user able to change it in extension and desktop app settings page
  DEFAULT_SELF_IDENTIFICATION: "c810f737-5680-4c58-9f6c-aee2b93f8b79",
};
