import { AppConfig, AppOptions } from "../../types";
import { DEFAULT_APP_OPTIONS } from "./constants";
import { getAvailablePort } from "./index";
import { getPreferencesJSON, getDefaultPreferences } from "./preferences";
import { bool, cleanEnv, num, str } from "envalid";
import * as fs from "fs-extra";
import _ from "lodash";
import * as path from "path";

let _app_config: AppConfig;

function getCleanEnv(overwriteProcessEnv?: object): AppOptions {
  const env = _.merge({}, process.env, overwriteProcessEnv ?? {}) ?? {};
  const spec = {
    VERSION: str({
      default: DEFAULT_APP_OPTIONS.VERSION,
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
    DESKTOP_APP_CONFIG_FILE_NAME: str({
      default: DEFAULT_APP_OPTIONS.DESKTOP_APP_CONFIG_FILE_NAME,
    }),
    DESKTOP_APP_LOG_FILES_FOLDER: str({
      default: DEFAULT_APP_OPTIONS.DESKTOP_APP_LOG_FILES_FOLDER,
    }),
    DESKTOP_APP_PREFERENCES_JSON_FILE_NAME: str({
      default: DEFAULT_APP_OPTIONS.DESKTOP_APP_PREFERENCES_JSON_FILE_NAME,
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
    WEB_APP_DATABASE_NAME: str({
      default: DEFAULT_APP_OPTIONS.WEB_APP_DATABASE_NAME,
    }),
    WEB_APP_HOST_NAME: str({
      default: DEFAULT_APP_OPTIONS.WEB_APP_HOST_NAME,
    }),
    SEARCH_ENGINE_INDEXING_FREQUENCY: num({
      default: DEFAULT_APP_OPTIONS.SEARCH_ENGINE_INDEXING_FREQUENCY,
    }),
    SEARCH_ENGINE_MASTER_KEY: str({
      default: DEFAULT_APP_OPTIONS.SEARCH_ENGINE_MASTER_KEY,
    }),
    SEARCH_ENGINE_START: bool({
      default: DEFAULT_APP_OPTIONS.SEARCH_ENGINE_START,
    }),
    SEARCH_ENGINE_NAME: str({
      default: DEFAULT_APP_OPTIONS.SEARCH_ENGINE_NAME,
    }),
    SEARCH_ENGINE_PORT: num({
      default: DEFAULT_APP_OPTIONS.SEARCH_ENGINE_PORT,
    }),
  };
  const envValues = cleanEnv(env, spec);

  // TODO: need to improve this. The reason is if _.merge(envValues,{}) will throw an exception
  return {
    VERSION: envValues.VERSION,
    DESKTOP_APP_USER_DATA_PATH: envValues.DESKTOP_APP_USER_DATA_PATH,
    DESKTOP_APP_HOME_PATH: envValues.DESKTOP_APP_HOME_PATH,
    DESKTOP_APP_FIRST_TIME_RUN_FILE_NAME:
      envValues.DESKTOP_APP_FIRST_TIME_RUN_FILE_NAME,
    DESKTOP_APP_CONFIG_FILE_NAME: envValues.DESKTOP_APP_CONFIG_FILE_NAME,
    DESKTOP_APP_LOG_FILES_FOLDER: envValues.DESKTOP_APP_LOG_FILES_FOLDER,
    DESKTOP_APP_PREFERENCES_JSON_FILE_NAME:
      envValues.DESKTOP_APP_PREFERENCES_JSON_FILE_NAME,
    WEB_APP_LOG_LEVEL: envValues.WEB_APP_LOG_LEVEL,
    WEB_APP_LOG_MAX_SIZE: envValues.WEB_APP_LOG_MAX_SIZE,
    WEB_APP_SAVE_RAW_PAGE: envValues.WEB_APP_SAVE_RAW_PAGE,
    WEB_APP_MASTER_KEY: envValues.WEB_APP_MASTER_KEY,
    WEB_APP_SETUP_DB: envValues.WEB_APP_SETUP_DB,
    WEB_APP_SEED_DB: envValues.WEB_APP_SEED_DB,
    WEB_APP_NAME: envValues.WEB_APP_NAME,
    WEB_APP_PORT: envValues.WEB_APP_PORT,
    WEB_APP_DATABASE_NAME: envValues.WEB_APP_DATABASE_NAME,
    WEB_APP_HOST_NAME: envValues.WEB_APP_HOST_NAME,
    SEARCH_ENGINE_INDEXING_FREQUENCY:
      envValues.SEARCH_ENGINE_INDEXING_FREQUENCY,
    SEARCH_ENGINE_MASTER_KEY: envValues.SEARCH_ENGINE_MASTER_KEY,
    SEARCH_ENGINE_START: envValues.SEARCH_ENGINE_START,
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

export function getAppOptions(appOptionsPath: string): Partial<AppOptions> {
  try {
    // if doesn't exist then return default preferences
    let appOptions: Partial<AppOptions> = {};

    // if file exist then return
    fs.ensureFileSync(appOptionsPath);
    try {
      const appOptionsStr = fs.readFileSync(appOptionsPath)?.toString();
      if (appOptionsStr) {
        appOptions = JSON.parse(appOptionsStr);
      }
    } catch (err) {
      console.info(err);
    }
    return appOptions;
  } catch (err) {
    console.error(
      `getAppOptions fail. appOptionsPath:${appOptionsPath}. error: `,
      err,
    );
    return {};
  }
}

export function updateAppOptions(
  appOptions: Partial<AppOptions>,
  appOptionsPath: string,
): Partial<AppOptions> {
  try {
    let curAppOptions = getAppOptions(appOptionsPath);

    curAppOptions = {
      ...curAppOptions,
      ...appOptions,
    };

    fs.outputJSONSync(appOptionsPath, curAppOptions);
    return curAppOptions;
  } catch (err) {
    console.error(
      "updateAppOptions fail. Path: ",
      appOptionsPath,
      "appOptions: ",
      appOptions,
      "Error: ",
      err,
    );
    return {};
  }
}

export async function getAppConfig(forceUpdate?: boolean): Promise<AppConfig> {
  if (_app_config && !forceUpdate) {
    return _app_config;
  }
  const appOptionsWithDefaultValue = getCleanEnv();
  const preferencesJSONPath = path.join(
    appOptionsWithDefaultValue.DESKTOP_APP_USER_DATA_PATH,
    appOptionsWithDefaultValue.DESKTOP_APP_PREFERENCES_JSON_FILE_NAME,
  );
  const appConfigPath = path.join(
    appOptionsWithDefaultValue.DESKTOP_APP_HOME_PATH,
    appOptionsWithDefaultValue.DESKTOP_APP_CONFIG_FILE_NAME,
  );
  const preferences = getPreferencesJSON(preferencesJSONPath);
  const appOptionsFromFile = getAppOptions(appConfigPath);
  const defaultPreferences = getDefaultPreferences();
  const appOptions = _.merge(
    appOptionsFromFile,
    defaultPreferences,
    appOptionsWithDefaultValue,
    preferences,
  );

  appOptions.WEB_APP_PORT = await getAvailablePort(appOptions.WEB_APP_PORT);
  appOptions.SEARCH_ENGINE_PORT = await getAvailablePort(
    appOptions.SEARCH_ENGINE_PORT,
  );

  // update app options
  updateAppOptions(appOptions, appConfigPath);

  const dynamicAppConfig = {
    DESKTOP_APP_PREFERENCES_JSON_FILE_PATH: preferencesJSONPath,
    DESKTOP_APP_CONFIG_FILE_PATH: appConfigPath,
    DESKTOP_APP_LOG_FILES_PATH: path.join(
      appOptions.DESKTOP_APP_USER_DATA_PATH,
      appOptions.DESKTOP_APP_LOG_FILES_FOLDER,
    ),
    DESKTOP_APP_FIRST_TIME_RUN_FILE_PATH: path.join(
      appOptions.DESKTOP_APP_USER_DATA_PATH,
      appOptions.DESKTOP_APP_FIRST_TIME_RUN_FILE_NAME,
    ),
    APP_HOME_PATH: appOptions.DESKTOP_APP_USER_DATA_PATH,
  };

  const appConfig = _.merge(appOptions, dynamicAppConfig);
  _app_config = appConfig;
  return appConfig;
}
