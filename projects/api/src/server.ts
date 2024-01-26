import { getAppConfig } from "./helpers/config";
import getLogger from "./helpers/logger";
import { startSearchEngine, stopSearchEngine } from "./searchEngine";
import { SearchEngineOptions, WebAppOptions } from "./types";
import { startWebApp, stopWebApp } from "./webApp";
import _ from "lodash";

// Recommended to use env variables to configure the app
export async function startWebAppAndSearchEngine(
  webAppOptions?: WebAppOptions,
  searchEngineOptions?: SearchEngineOptions,
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
