import { AppConfig, AppOptions } from "../../types";
import { DEFAULT_APP_OPTIONS } from "./constants";
import { getAvailablePort } from "./index";
import { getDefaultPreferences, getPreferencesJSON } from "./preferences";
import { app } from "electron";
import { bool, cleanEnv, num, str } from "envalid";
import _ from "lodash";
import * as path from "path";

let _app_config: AppConfig;

function getCleanEnv(overwriteProcessEnv?: object): AppOptions {
  const env = _.merge({}, process.env, overwriteProcessEnv ?? {}) ?? {};
  const spec = {
    VERSION: str({
      default: DEFAULT_APP_OPTIONS.VERSION,
    }),
    PREFERENCES_JSON_FILE_NAME: str({
      default: DEFAULT_APP_OPTIONS.PREFERENCES_JSON_FILE_NAME,
    }),
    DESKTOP_APP_USER_DATA_PATH: str({
      default: DEFAULT_APP_OPTIONS.DESKTOP_APP_USER_DATA_PATH,
    }),
    DESKTOP_APP_HOME_PATH: str({
      default: DEFAULT_APP_OPTIONS.DESKTOP_APP_HOME_PATH,
    }),
    DESKTOP_APP_FIRST_TIME_RUN_FILE_NAME: str({
      default: DEFAULT_APP_OPTIONS.DESKTOP_APP_FIRST_TIME_RUN_FILE_NAME,
    }),
    DESKTOP_APP_LOG_FILES_FOLDER: str({
      default: DEFAULT_APP_OPTIONS.DESKTOP_APP_LOG_FILES_FOLDER,
    }),
    WEB_APP_HOST_NAME: str({
      default: DEFAULT_APP_OPTIONS.WEB_APP_HOST_NAME,
    }),
    WEB_APP_LOG_LEVEL: str({
      default: DEFAULT_APP_OPTIONS.WEB_APP_LOG_LEVEL,
    }),
    WEB_APP_LOG_MAX_SIZE: num({
      default: DEFAULT_APP_OPTIONS.WEB_APP_LOG_MAX_SIZE,
    }),
    WEB_APP_SAVE_RAW_PAGE: bool({
      default: DEFAULT_APP_OPTIONS.WEB_APP_SAVE_RAW_PAGE,
    }),
    WEB_APP_MASTER_KEY: str({
      default: DEFAULT_APP_OPTIONS.WEB_APP_MASTER_KEY,
    }),
    WEB_APP_SETUP_DB: bool({
      default: DEFAULT_APP_OPTIONS.WEB_APP_SETUP_DB,
    }),
    WEB_APP_SEED_DB: bool({
      default: DEFAULT_APP_OPTIONS.WEB_APP_SEED_DB,
    }),
    WEB_APP_NAME: str({
      default: DEFAULT_APP_OPTIONS.WEB_APP_NAME,
    }),
    WEB_APP_PORT: num({
      default: DEFAULT_APP_OPTIONS.WEB_APP_PORT,
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
    SEARCH_ENGINE_NAME: str({
      default: DEFAULT_APP_OPTIONS.SEARCH_ENGINE_NAME,
    }),
    SEARCH_ENGINE_PORT: num({
      default: DEFAULT_APP_OPTIONS.SEARCH_ENGINE_PORT,
    }),
  };
  const envValues = cleanEnv(env, spec);

  const webAppSourcePath = path.join(
    app.getAppPath(),
    "dist",
    envValues.WEB_APP_NAME,
  );

  // TODO: need to improve this. The reason is if _.merge(envValues,{}) will throw an exception
  return {
    VERSION: envValues.VERSION,
    PREFERENCES_JSON_FILE_NAME: envValues.PREFERENCES_JSON_FILE_NAME,
    DESKTOP_APP_USER_DATA_PATH: envValues.DESKTOP_APP_USER_DATA_PATH,
    DESKTOP_APP_HOME_PATH: envValues.DESKTOP_APP_HOME_PATH,
    DESKTOP_APP_FIRST_TIME_RUN_FILE_NAME:
      envValues.DESKTOP_APP_FIRST_TIME_RUN_FILE_NAME,
    DESKTOP_APP_LOG_FILES_FOLDER: envValues.DESKTOP_APP_LOG_FILES_FOLDER,
    WEB_APP_HOST_NAME: envValues.WEB_APP_HOST_NAME,
    WEB_APP_LOG_LEVEL: envValues.WEB_APP_LOG_LEVEL,
    WEB_APP_LOG_MAX_SIZE: envValues.WEB_APP_LOG_MAX_SIZE,
    WEB_APP_SAVE_RAW_PAGE: envValues.WEB_APP_SAVE_RAW_PAGE,
    WEB_APP_MASTER_KEY: envValues.WEB_APP_MASTER_KEY,
    WEB_APP_SOURCE_ROOT_PATH: webAppSourcePath,
    WEB_APP_SETUP_DB: envValues.WEB_APP_SETUP_DB,
    WEB_APP_SEED_DB: envValues.WEB_APP_SEED_DB,
    WEB_APP_NAME: envValues.WEB_APP_NAME,
    WEB_APP_PORT: envValues.WEB_APP_PORT,
    SEARCH_ENGINE_HOST_NAME: envValues.SEARCH_ENGINE_HOST_NAME,
    SEARCH_ENGINE_INDEXING_FREQUENCY:
      envValues.SEARCH_ENGINE_INDEXING_FREQUENCY,
    SEARCH_ENGINE_MASTER_KEY: envValues.SEARCH_ENGINE_MASTER_KEY,
    SEARCH_ENGINE_NAME: envValues.SEARCH_ENGINE_NAME,
    SEARCH_ENGINE_PORT: envValues.SEARCH_ENGINE_PORT,
  };
}

/**
 * Update preferences json to process envs.
 * All properties in preferences json will be used as environment variable name
 * @param preferencesJSON
 * @returns {boolean} - true: successful, otherwise will throw an exception
 */
export function updateProcessEnvs(appConfig: AppConfig): boolean {
  try {
    _.forOwn(appConfig, function (value, key) {
      process.env[key.toUpperCase()] = value.toString();
      console.debug(`process.env.${key.toUpperCase()}: `, value);
    });
    return true;
  } catch (err) {
    console.error("updateProcessEnvs failed. Error: ", err);
    return false;
  }
}

export async function getAppConfig(
  overwriteProcessEnv?: object,
): Promise<AppConfig> {
  if (_app_config && !overwriteProcessEnv) {
    return _app_config;
  }
  let appOptionsWithDefaultValue = getCleanEnv(overwriteProcessEnv);
  const desktopAppPreferencesPath = path.join(
    appOptionsWithDefaultValue.DESKTOP_APP_HOME_PATH,
    appOptionsWithDefaultValue.PREFERENCES_JSON_FILE_NAME,
  );

  // Get desktop app preferences
  const desktopAppPreferencesJSON = getPreferencesJSON(
    desktopAppPreferencesPath,
  );

  // To overwrite default app options with preferences
  // `DESKTOP_APP_USER_DATA_PATH` is possible re-configure in desktop app preferences
  appOptionsWithDefaultValue = _.merge(
    {},
    appOptionsWithDefaultValue,
    desktopAppPreferencesJSON ?? {},
  );

  const appPreferencesJSONPath = path.join(
    appOptionsWithDefaultValue.DESKTOP_APP_USER_DATA_PATH,
    appOptionsWithDefaultValue.PREFERENCES_JSON_FILE_NAME,
  );
  const appPreferencesJSON = getPreferencesJSON(appPreferencesJSONPath);

  const defaultPreferences = getDefaultPreferences();
  const appOptions = _.merge(
    defaultPreferences,
    appOptionsWithDefaultValue,
    appPreferencesJSON,
  );

  appOptions.WEB_APP_PORT = await getAvailablePort(appOptions.WEB_APP_PORT);
  appOptions.SEARCH_ENGINE_PORT = await getAvailablePort(
    appOptions.SEARCH_ENGINE_PORT,
  );

  const dynamicAppConfig = {
    DESKTOP_APP_LOG_FILES_PATH: path.join(
      appOptions.DESKTOP_APP_USER_DATA_PATH,
      appOptions.DESKTOP_APP_LOG_FILES_FOLDER,
    ),
    DESKTOP_APP_FIRST_TIME_RUN_FILE_PATH: path.join(
      appOptions.DESKTOP_APP_USER_DATA_PATH,
      appOptions.DESKTOP_APP_FIRST_TIME_RUN_FILE_NAME,
    ),
    APP_HOME_PATH: appOptions.DESKTOP_APP_USER_DATA_PATH,
    WEB_APP_HOME_PATH: path.join(
      appOptions.DESKTOP_APP_USER_DATA_PATH,
      appOptions.WEB_APP_NAME,
    ),
    SEARCH_ENGINE_HOME_PATH: path.join(
      appOptions.DESKTOP_APP_HOME_PATH,
      // appOptions.DESKTOP_APP_USER_DATA_PATH,
      appOptions.SEARCH_ENGINE_NAME,
    ),
  };

  const appConfig = _.merge(appOptions, dynamicAppConfig);
  _app_config = appConfig;
  return appConfig;
}
