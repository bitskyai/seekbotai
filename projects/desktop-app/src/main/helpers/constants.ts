import {
  PORT_RANGE,
  DEFAULT_MEILISEARCH_PORT,
  DEFAULT_HOST_NAME,
  DEFAULT_MEILISEARCH_MASTER_KEY,
  DEFAULT_API_KEY,
} from "../../bitskyLibs/shared";
import { AppOptions } from "../../types";
import { app } from "electron";
import _ from "lodash";
import * as path from "path";

const appName = "bitsky-desktop-app";

const DEFAULT_USER_DATA_PATH = path.join(
  app.getPath("home"),
  `.${_.snakeCase(appName)}`,
);

// should same with folder name in `dist/web-app`
const webAppName = "web-app";

export const DEFAULT_APP_OPTIONS: AppOptions = {
  VERSION: "1.0.0",
  DESKTOP_APP_USER_DATA_PATH: DEFAULT_USER_DATA_PATH,
  DESKTOP_APP_HOME_PATH: app.getPath("userData"),
  DESKTOP_APP_FIRST_TIME_RUN_FILE_NAME: _.snakeCase(`${appName}_first_run`),
  DESKTOP_APP_LOG_FILES_FOLDER: "logs",
  DESKTOP_APP_CONFIG_FILE_NAME: "config.json",
  DESKTOP_APP_PREFERENCES_JSON_FILE_NAME: "preferences.json",
  WEB_APP_LOG_LEVEL: "info",
  WEB_APP_LOG_MAX_SIZE: 10 * 1024 * 1024, //10mb
  WEB_APP_SAVE_RAW_PAGE: false,
  WEB_APP_MASTER_KEY: DEFAULT_API_KEY,
  WEB_APP_SETUP_DB: true,
  WEB_APP_SEED_DB: true,
  WEB_APP_NAME: webAppName,
  WEB_APP_PORT: PORT_RANGE[0],
  WEB_APP_DATABASE_NAME: `bitsky.db`,
  WEB_APP_HOST_NAME: DEFAULT_HOST_NAME,
  SEARCH_ENGINE_INDEXING_FREQUENCY: 1000 * 60 * 5, // 5 minutes
  SEARCH_ENGINE_MASTER_KEY: DEFAULT_MEILISEARCH_MASTER_KEY,
  SEARCH_ENGINE_START: true,
  SEARCH_ENGINE_NAME: "search_engine",
  SEARCH_ENGINE_PORT: DEFAULT_MEILISEARCH_PORT,
};
