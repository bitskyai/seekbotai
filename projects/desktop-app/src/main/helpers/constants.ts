import {
  DEFAULT_API_KEY,
  DEFAULT_MEILISEARCH_MASTER_KEY,
  DEFAULT_MEILISEARCH_PORT,
  PORT_RANGE,
} from "../../bitskyLibs/shared";
import { AppOptions } from "../../types";
import { app } from "electron";
import _ from "lodash";
import * as path from "path";

export const appName = "Bitsky";
export const preferencesFileName = "preferences.json";
export const configFileName = "config.json";

const DEFAULT_USER_DATA_PATH = path.join(app.getPath("home"), `${appName}`);

// should same with folder name in `dist/web-app`
const webAppName = "web-app";

export const DEFAULT_APP_OPTIONS: AppOptions = {
  VERSION: "1.0.0",
  PREFERENCES_JSON_FILE_NAME: preferencesFileName,
  DESKTOP_APP_USER_DATA_PATH: DEFAULT_USER_DATA_PATH,
  DESKTOP_APP_HOME_PATH: app.getPath("userData"),
  DESKTOP_APP_FIRST_TIME_RUN_FILE_NAME: _.snakeCase(`${appName}_first_run`),
  DESKTOP_APP_LOG_FILES_FOLDER: "logs",
  WEB_APP_LOG_LEVEL: "info",
  WEB_APP_LOG_MAX_SIZE: 10 * 1024 * 1024, //10mb
  WEB_APP_SAVE_RAW_PAGE: false,
  WEB_APP_MASTER_KEY: DEFAULT_API_KEY,
  WEB_APP_SETUP_DB: true,
  WEB_APP_SEED_DB: false,
  WEB_APP_NAME: webAppName,
  WEB_APP_PORT: PORT_RANGE[0],
  SEARCH_ENGINE_INDEXING_FREQUENCY: 1000 * 60 * 5, // 5 minutes
  SEARCH_ENGINE_MASTER_KEY: DEFAULT_MEILISEARCH_MASTER_KEY,
  SEARCH_ENGINE_NAME: "search_engine",
  SEARCH_ENGINE_PORT: DEFAULT_MEILISEARCH_PORT,
};
