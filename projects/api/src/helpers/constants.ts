import {
  DEFAULT_HOST_NAME,
  DEFAULT_API_KEY,
  WEB_APP_SCREENSHOT_PREVIEW_CROP_HEIGHT,
  WEB_APP_SCREENSHOT_PREVIEW_CROP_WIDTH,
} from "../bitskyLibs/shared";
import { defaultPreference } from "../db/seedData/defaultPreference";
import { CHECK_NEW_INDEXES_INTERVAL } from "../searchEngine/constants";
import { WebAppOptions } from "../types";
import os from "os";
import path from "path";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const appRootPath = path.join(os.homedir(), ".bitsky-app");

export const DEFAULT_APP_OPTIONS: Required<WebAppOptions> = {
  APP_ROOT_PATH: path.join(os.homedir(), ".bitsky-app"),
  NODE_ENV: "development",
  SEARCH_ENGINE_HOME_PATH: path.join(appRootPath, "search-engine"),
  SEARCH_ENGINE_HOST_NAME: DEFAULT_HOST_NAME,
  SEARCH_ENGINE_INDEXING_FREQUENCY: CHECK_NEW_INDEXES_INTERVAL,
  // 5 minutes
  SEARCH_ENGINE_MASTER_KEY: defaultPreference.apiKey,
  SEARCH_ENGINE_MAX_INDEXING_MEMORY: 1024 * 1024 * 500,
  // 500MB
  SEARCH_ENGINE_MAX_INDEXING_THREADS: 1,
  SEARCH_ENGINE_NAME: "search_engine",
  SEARCH_ENGINE_PORT: 47700,
  WEB_APP_COMBINED_LOG_FILE_NAME: "combined.log",
  WEB_APP_DATABASE_PROVIDER: "sqlite",
  WEB_APP_DATABASE_URL: `file:${appRootPath}/bitsky.db`,
  WEB_APP_ERROR_LOG_FILE_NAME: "error.log",
  WEB_APP_LOG_FILES_FOLDER: "log",
  // relative to `WEB_APP_HOME_PATH`
  WEB_APP_LOG_LEVEL: defaultPreference.logLevel,
  WEB_APP_LOG_MAX_SIZE: defaultPreference.logSize,
  WEB_APP_MASTER_KEY: DEFAULT_API_KEY,
  WEB_APP_NAME: "bitsky-web-app",
  WEB_APP_PORT: 46997,
  WEB_APP_SAVE_FULL_SIZE_SCREENSHOT: true,
  WEB_APP_SAVE_RAW_PAGE: false,
  WEB_APP_SCREENSHOT_FOLDER: "screenshots",
  // relative to `WEB_APP_SCREENSHOT_FOLDER`
  WEB_APP_SCREENSHOT_FULL_SIZE_FOLDER: `full`,
  // relative to `WEB_APP_HOME_PATH`
  WEB_APP_SCREENSHOT_PREVIEW_CROP_HEIGHT,
  WEB_APP_SCREENSHOT_PREVIEW_CROP_WIDTH,
  // relative to `WEB_APP_HOME_PATH`
  WEB_APP_SCREENSHOT_PREVIEW_FOLDER: `preview`,
  WEB_APP_SEED_DB: false,
  WEB_APP_SETUP_DB: true,
  WEB_APP_SOURCE_ROOT_PATH: path.join(__dirname, "../../"),
  WEB_APP_START_SEARCH_ENGINE: true,
};
