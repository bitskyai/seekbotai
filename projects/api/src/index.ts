import { getAppConfig } from "./helpers/config";
import getLogger from "./helpers/logger";
import { startSearchEngine, stopSearchEngine } from "./searchEngine";
import { startWebApp, stopWebApp } from "./server";
import {
  SearchEnginePreferences,
  WebAppPreferences,
  SearchEngineOptions,
  WebAppOptions,
} from "./types";
import _ from "lodash";

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
  // init app config
  getAppConfig(_.merge({}, webAppOptions, searchEngineOptions));
  const logger = getLogger();
  logger.info("startWebAppAndSearchEngine...");
  await startSearchEngine(searchEngineOptions);
  await startWebApp(webAppOptions);
  logger.info("finished startWebAppAndSearchEngine");
}

export async function stopWebAppAndSearchEngine() {
  const logger = getLogger();
  logger.info("stopWebAppAndSearchEngine...");
  await stopSearchEngine();
  await stopWebApp();
  logger.info("finished stopWebAppAndSearchEngine");
}
