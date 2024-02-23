import getEventEmitter, {
  emitBrowserExtensionConnected,
  emitImportBookmarks,
  emitSearch,
  listenBrowserExtensionConnected,
  listenImportBookmarks,
  listenSearch,
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
  emitImportBookmarks,
  emitSearch,
  getEventEmitter,
  listenBrowserExtensionConnected,
  listenImportBookmarks,
  listenSearch,
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
