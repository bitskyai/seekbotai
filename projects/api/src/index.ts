import getEventEmitter, {
  emitBrowserExtensionConnected,
  listenBrowserExtensionConnected,
} from "./event";
import {
  startWebAppAndSearchEngine,
  stopWebAppAndSearchEngine,
} from "./server";
import {
  BrowserExtensionConnectedData,
  SearchEngineOptions,
  SearchEnginePreferences,
  WebAppOptions,
  WebAppPreferences,
} from "./types";

// Normally following two functions are used if you want to programmatically start or stop
// if you don't want to use default app config, make sure you set the env variables before calling these functions and use dynamic import
export {
  emitBrowserExtensionConnected,
  getEventEmitter,
  listenBrowserExtensionConnected,
  startWebAppAndSearchEngine,
  stopWebAppAndSearchEngine,
};
export type {
  BrowserExtensionConnectedData,
  SearchEngineOptions,
  SearchEnginePreferences,
  WebAppOptions,
  WebAppPreferences,
};
