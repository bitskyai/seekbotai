import {
  startWebAppAndSearchEngine,
  stopWebAppAndSearchEngine,
} from "./server";
import {
  SearchEngineOptions,
  SearchEnginePreferences,
  WebAppOptions,
  WebAppPreferences,
} from "./types";

// Normally following two functions are used if you want to programmatically start or stop
// if you don't want to use default app config, make sure you set the env variables before calling these functions and use dynamic import
export { startWebAppAndSearchEngine, stopWebAppAndSearchEngine };
export type {
  SearchEngineOptions,
  SearchEnginePreferences,
  WebAppOptions,
  WebAppPreferences,
};
