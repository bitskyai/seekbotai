// preferences settings only support main process

import { AppPreferences } from "../../types";
import { getAppConfig } from "./config";
import { DEFAULT_APP_OPTIONS, appName } from "./constants";
import logger from "./logger";
import * as fs from "fs-extra";
import path from "path";

/**
 * Get preferences JSON, if this JSON file doesn't exist, then return default prefrences and write to disk
 * @returns {Partial<AppPreferences>}
 */
export function getPreferencesJSON(
  preferencesPath: string,
): Partial<AppPreferences> {
  try {
    // if doesn't exist then return default preferences
    let preferencesJSON: Partial<AppPreferences> = {};

    // if file exist then return
    fs.ensureFileSync(preferencesPath);
    try {
      // incase preferences.json is empt
      const preferencesJSONStr = fs.readFileSync(preferencesPath)?.toString();
      if (preferencesJSONStr) {
        preferencesJSON = JSON.parse(preferencesJSONStr);
      }
    } catch (err) {
      logger.error(err);
    }

    return preferencesJSON ?? {};
  } catch (err) {
    logger.error("getPreferencesJSON fail, error: ", err);
    return {};
  }
}

/**
 * Update current preferences. Passed preferences JSON will be merged with currently preferences
 * @param preferencesJSON {object}
 * @returns true
 */
export function updatePreferencesJSON(
  preferencesJSON: Partial<AppPreferences>,
  preferencesPath: string,
): Partial<AppPreferences> {
  try {
    let curPreferencesJSON = getPreferencesJSON(preferencesPath);

    curPreferencesJSON = {
      ...curPreferencesJSON,
      ...preferencesJSON,
    };

    fs.outputJSONSync(preferencesPath, curPreferencesJSON);
    return curPreferencesJSON;
  } catch (err) {
    logger.error(
      "updatePreferencesJSON-> Output preferences JSON fail. Path: ",
      preferencesPath,
      "Preference JSON: ",
      preferencesJSON,
      "Error: ",
      err,
    );
    return {};
  }
}

// Get default preferences
export function getDefaultPreferences(): AppPreferences {
  return {
    DESKTOP_APP_USER_DATA_PATH: DEFAULT_APP_OPTIONS.DESKTOP_APP_USER_DATA_PATH,
    WEB_APP_LOG_LEVEL: DEFAULT_APP_OPTIONS.WEB_APP_LOG_LEVEL,
    WEB_APP_LOG_MAX_SIZE: DEFAULT_APP_OPTIONS.WEB_APP_LOG_MAX_SIZE,
    WEB_APP_SAVE_RAW_PAGE: DEFAULT_APP_OPTIONS.WEB_APP_SAVE_RAW_PAGE,
    WEB_APP_MASTER_KEY: DEFAULT_APP_OPTIONS.WEB_APP_MASTER_KEY,
    SEARCH_ENGINE_INDEXING_FREQUENCY:
      DEFAULT_APP_OPTIONS.SEARCH_ENGINE_INDEXING_FREQUENCY,
    SEARCH_ENGINE_MASTER_KEY: DEFAULT_APP_OPTIONS.SEARCH_ENGINE_MASTER_KEY,
  };
}

export async function updateUserDataPath(selectedFolderPath: string) {
  // * Update `preferences.json` file with `DESKTOP_APP_USER_DATA_PATH`
  // * Update `config.json`(under `DESKTOP_APP_HOME_PATH`) file with `DESKTOP_APP_USER_DATA_PATH` - The reason is next time when user open the app, it will use the new `DESKTOP_APP_USER_DATA_PATH` to store data
  // * Force getAppConfig update

  // Get current App Config
  const config = await getAppConfig();

  // Ensure new user data path exist
  const userDataPath = path.join(selectedFolderPath, `${appName}`);
  fs.ensureDirSync(userDataPath);

  // If config.DESKTOP_APP_USER_DATA_PATH exist, then copy all the files from current user data path to new user data path
  if (fs.existsSync(config.DESKTOP_APP_USER_DATA_PATH)) {
    fs.copySync(config.DESKTOP_APP_USER_DATA_PATH, userDataPath);
  }

  // Update app `preferences.json` in new user data path
  await updatePreferencesJSON(
    { DESKTOP_APP_USER_DATA_PATH: userDataPath },
    path.join(userDataPath, config.PREFERENCES_JSON_FILE_NAME),
  );

  // Update desktop `preferences.json` in `DESKTOP_APP_HOME_PATH`, the reason is next time when user open the app, need to know where is the new user data path
  await updatePreferencesJSON(
    { DESKTOP_APP_USER_DATA_PATH: userDataPath },
    path.join(config.DESKTOP_APP_HOME_PATH, config.PREFERENCES_JSON_FILE_NAME),
  );

  // remove previous user data path
  fs.removeSync(config.DESKTOP_APP_USER_DATA_PATH);

  // Force getAppConfig update
  await getAppConfig({ DESKTOP_APP_USER_DATA_PATH: userDataPath });
}
