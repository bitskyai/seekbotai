import { startSearchEngine, stopSearchEngine } from "./searchEngine";
import { startWebApp, stopWebApp } from "./server";
import {
  SearchEnginePreferences,
  WebAppPreferences,
  SearchEngineOptions,
  WebAppOptions,
} from "./types";

export { startSearchEngine, stopSearchEngine, startWebApp, stopWebApp };
export type {
  SearchEnginePreferences,
  WebAppPreferences,
  SearchEngineOptions,
  WebAppOptions,
};

export async function startWebAppAndSearchEngine(
  webAppOptions: WebAppOptions,
  searchEngineOptions: SearchEngineOptions,
) {
  await startSearchEngine(searchEngineOptions);
  await startWebApp(webAppOptions);
}
