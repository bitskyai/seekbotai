import { WebAppConfig, WebAppOptions } from "../types";
import { DEFAULT_APP_OPTIONS } from "./constants";
import { bool, cleanEnv, num, str } from "envalid";
import _ from "lodash";
import * as path from "path";

let _app_config: WebAppConfig;

// @deprecated
// Previous name ` getCleanEnv`, The reason is `cleanEnv` is immutable
function getCleanEnvV0(overwriteProcessEnv?: object): Required<WebAppOptions> {
  return cleanEnv(_.merge({}, process.env, overwriteProcessEnv ?? {}), {
    APP_ROOT_PATH: str({
      default: DEFAULT_APP_OPTIONS.APP_ROOT_PATH,
    }),
    DESKTOP_MODE: bool({
      default: true,
    }),
    NODE_ENV: str({
      default: DEFAULT_APP_OPTIONS.NODE_ENV,
    }),
    SEARCH_ENGINE_HOME_PATH: str({
      default: DEFAULT_APP_OPTIONS.SEARCH_ENGINE_HOME_PATH,
    }),
    SEARCH_ENGINE_HOST_NAME: str({
      default: DEFAULT_APP_OPTIONS.SEARCH_ENGINE_HOST_NAME,
    }),
    SEARCH_ENGINE_INDEXING_FREQUENCY: num({
      default: DEFAULT_APP_OPTIONS.SEARCH_ENGINE_INDEXING_FREQUENCY,
    }),
    SEARCH_ENGINE_MASTER_KEY: str({
      default: DEFAULT_APP_OPTIONS.SEARCH_ENGINE_MASTER_KEY,
    }),
    SEARCH_ENGINE_MAX_INDEXING_MEMORY: num({
      default: DEFAULT_APP_OPTIONS.SEARCH_ENGINE_MAX_INDEXING_MEMORY,
    }),
    SEARCH_ENGINE_MAX_INDEXING_THREADS: num({
      default: DEFAULT_APP_OPTIONS.SEARCH_ENGINE_MAX_INDEXING_THREADS,
    }),
    SEARCH_ENGINE_NAME: str({
      default: DEFAULT_APP_OPTIONS.SEARCH_ENGINE_NAME,
    }),
    SEARCH_ENGINE_PORT: num({
      default: DEFAULT_APP_OPTIONS.SEARCH_ENGINE_PORT,
    }),
    VERSION: str({
      default: "1.0.0",
    }),
    WEB_APP_COMBINED_LOG_FILE_NAME: str({
      default: DEFAULT_APP_OPTIONS.WEB_APP_COMBINED_LOG_FILE_NAME,
    }),
    WEB_APP_DATABASE_PROVIDER: str({
      default: DEFAULT_APP_OPTIONS.WEB_APP_DATABASE_PROVIDER,
    }),
    WEB_APP_DATABASE_URL: str({
      default: DEFAULT_APP_OPTIONS.WEB_APP_DATABASE_URL,
    }),
    WEB_APP_ERROR_LOG_FILE_NAME: str({
      default: DEFAULT_APP_OPTIONS.WEB_APP_ERROR_LOG_FILE_NAME,
    }),
    WEB_APP_LOG_FILES_FOLDER: str({
      default: DEFAULT_APP_OPTIONS.WEB_APP_LOG_FILES_FOLDER,
    }),
    WEB_APP_LOG_LEVEL: str({
      default: DEFAULT_APP_OPTIONS.WEB_APP_LOG_LEVEL,
    }),
    WEB_APP_LOG_MAX_SIZE: num({
      default: DEFAULT_APP_OPTIONS.WEB_APP_LOG_MAX_SIZE,
    }),
    WEB_APP_MASTER_KEY: str({
      default: DEFAULT_APP_OPTIONS.WEB_APP_MASTER_KEY,
    }),
    WEB_APP_NAME: str({
      default: DEFAULT_APP_OPTIONS.WEB_APP_NAME,
    }),
    WEB_APP_PORT: num({
      default: DEFAULT_APP_OPTIONS.WEB_APP_PORT,
    }),
    WEB_APP_SAVE_FULL_SIZE_SCREENSHOT: bool({
      default: DEFAULT_APP_OPTIONS.WEB_APP_SAVE_FULL_SIZE_SCREENSHOT,
    }),
    WEB_APP_SAVE_RAW_PAGE: bool({
      default: DEFAULT_APP_OPTIONS.WEB_APP_SAVE_RAW_PAGE,
    }),
    WEB_APP_SCREENSHOT_FOLDER: str({
      default: DEFAULT_APP_OPTIONS.WEB_APP_SCREENSHOT_FOLDER,
    }),
    WEB_APP_SCREENSHOT_FULL_SIZE_FOLDER: str({
      default: DEFAULT_APP_OPTIONS.WEB_APP_SCREENSHOT_FULL_SIZE_FOLDER,
    }),
    WEB_APP_SCREENSHOT_PREVIEW_CROP_HEIGHT: num({
      default: DEFAULT_APP_OPTIONS.WEB_APP_SCREENSHOT_PREVIEW_CROP_HEIGHT,
    }),
    WEB_APP_SCREENSHOT_PREVIEW_CROP_WIDTH: num({
      default: DEFAULT_APP_OPTIONS.WEB_APP_SCREENSHOT_PREVIEW_CROP_WIDTH,
    }),
    WEB_APP_SCREENSHOT_PREVIEW_FOLDER: str({
      default: DEFAULT_APP_OPTIONS.WEB_APP_SCREENSHOT_PREVIEW_FOLDER,
    }),
    WEB_APP_SEED_DB: bool({
      default: DEFAULT_APP_OPTIONS.WEB_APP_SEED_DB,
    }),
    WEB_APP_SETUP_DB: bool({
      default: DEFAULT_APP_OPTIONS.WEB_APP_SETUP_DB,
    }),
    WEB_APP_SOURCE_ROOT_PATH: str({
      default: DEFAULT_APP_OPTIONS.WEB_APP_SOURCE_ROOT_PATH,
    }),
    WEB_APP_START_SEARCH_ENGINE: bool({
      default: DEFAULT_APP_OPTIONS.WEB_APP_START_SEARCH_ENGINE,
    }),
  });
}

function getCleanEnv(overwriteProcessEnv?: object): Required<WebAppOptions> {
  return (
    _.merge({}, process.env, overwriteProcessEnv ?? {}), DEFAULT_APP_OPTIONS
  );
}

export function overwriteAppConfig(appConfig: object): WebAppConfig {
  const currentAppConfig = getAppConfig();
  _app_config = _.merge({}, currentAppConfig, appConfig);
  return _app_config;
}

export function getAppConfig(forceUpdate?: boolean): WebAppConfig {
  if (_app_config && !forceUpdate) {
    return _app_config;
  }
  const appOptionsWithDefaultValue = getCleanEnv();
  const dynamicAppConfig = {
    WEB_APP_HOME_PATH: path.join(
      appOptionsWithDefaultValue.APP_ROOT_PATH,
      _.snakeCase(appOptionsWithDefaultValue.WEB_APP_NAME),
    ),
    WEB_APP_SCREENSHOT_PATH: path.join(
      appOptionsWithDefaultValue.APP_ROOT_PATH,
      _.snakeCase(appOptionsWithDefaultValue.WEB_APP_NAME),
      _.snakeCase(appOptionsWithDefaultValue.WEB_APP_SCREENSHOT_FOLDER),
    ),
    WEB_APP_SCREENSHOT_PREVIEW_PATH: path.join(
      appOptionsWithDefaultValue.APP_ROOT_PATH,
      _.snakeCase(appOptionsWithDefaultValue.WEB_APP_NAME),
      _.snakeCase(appOptionsWithDefaultValue.WEB_APP_SCREENSHOT_FOLDER),
      _.snakeCase(appOptionsWithDefaultValue.WEB_APP_SCREENSHOT_PREVIEW_FOLDER),
    ),
    WEB_APP_SCREENSHOT_FULL_SIZE_PATH: path.join(
      appOptionsWithDefaultValue.APP_ROOT_PATH,
      _.snakeCase(appOptionsWithDefaultValue.WEB_APP_NAME),
      _.snakeCase(appOptionsWithDefaultValue.WEB_APP_SCREENSHOT_FOLDER),
      _.snakeCase(
        appOptionsWithDefaultValue.WEB_APP_SCREENSHOT_FULL_SIZE_FOLDER,
      ),
    ),
    WEB_APP_LOG_FILES_PATH: path.join(
      appOptionsWithDefaultValue.APP_ROOT_PATH,
      _.snakeCase(appOptionsWithDefaultValue.WEB_APP_NAME),
      _.snakeCase(appOptionsWithDefaultValue.WEB_APP_LOG_FILES_FOLDER),
    ),
    WEB_APP_COMBINED_LOG_FILE_PATH: path.join(
      appOptionsWithDefaultValue.APP_ROOT_PATH,
      _.snakeCase(appOptionsWithDefaultValue.WEB_APP_NAME),
      _.snakeCase(appOptionsWithDefaultValue.WEB_APP_LOG_FILES_FOLDER),
      _.snakeCase(appOptionsWithDefaultValue.WEB_APP_COMBINED_LOG_FILE_NAME),
    ),
    WEB_APP_ERROR_LOG_FILE_PATH: path.join(
      appOptionsWithDefaultValue.APP_ROOT_PATH,
      _.snakeCase(appOptionsWithDefaultValue.WEB_APP_NAME),
      _.snakeCase(appOptionsWithDefaultValue.WEB_APP_LOG_FILES_FOLDER),
      _.snakeCase(appOptionsWithDefaultValue.WEB_APP_ERROR_LOG_FILE_NAME),
    ),
  };

  const appConfig = _.merge({}, appOptionsWithDefaultValue, dynamicAppConfig);
  _app_config = appConfig;
  return _app_config;
}
