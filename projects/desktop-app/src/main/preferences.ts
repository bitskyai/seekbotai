// preferences settings only support main process
import * as fs from "fs-extra";
import * as _ from "lodash";
import * as path from "path";
import {
  APP_HOME_PATH,
  LOG_FILES_FOLDER,
  PREFERENCES_JSON_PATH,
  WEB_APP_DATABASE_URL,
  WEB_APP_LOG_MAX_SIZE,
  WEB_APP_NAME,
  WEB_APP_PORT,
} from "../helpers/constants";
import logger from "../helpers/logger";
import { LogLevel, Preferences } from "../interfaces";

/**
 * Get preferences JSON, if this JSON file doesn't exist, then return default prefrences and write to disk
 * @returns {Preferences}
 */
export function getPreferencesJSON(): Preferences {
  try {
    const defaultPreferencesJSON = getDefaultPreferences();
    // if doesn't exist then return default preferences
    let preferencesJSON: Preferences;
    // let mergedPreferencesJSON: Preferences;
    // if file exist then return
    fs.ensureFileSync(PREFERENCES_JSON_PATH);
    try {
      // to avoid if user delete preference.json
      preferencesJSON = fs.readJSONSync(PREFERENCES_JSON_PATH);
    } catch (err) {
      preferencesJSON = defaultPreferencesJSON;
    }
    const mergedPreferencesJSON = _.merge(
      {},
      defaultPreferencesJSON,
      preferencesJSON
    );

    if (!_.isEqual(preferencesJSON, mergedPreferencesJSON)) {
      // if merged preferences isn't same with preferences get from local, need to update
      // 1. maybe we change the default perferences
      // console.log('===preferencesJSON: ');
      // console.log(preferencesJSON);

      // console.log('===mergedPreferencesJSON: ');
      // console.log(mergedPreferencesJSON);
      fs.writeJSONSync(PREFERENCES_JSON_PATH, mergedPreferencesJSON);
      logger.info(
        "getPreferencesJSON-> Output preferences JSON successful. Path: ",
        PREFERENCES_JSON_PATH,
        "Preference JSON: ",
        mergedPreferencesJSON
      );
    }

    return mergedPreferencesJSON;
  } catch (err) {
    logger.error("getPreferencesJSON fail, error: ", err);
    throw err;
  }
}

/**
 * Update preferences json to process envs.
 * All properties in preferences json will be used as environment variable name
 * @param preferencesJSON
 * @returns {boolean} - true: successful, otherwise will throw an exception
 */
export function updateProcessEnvs(preferencesJSON: Preferences): boolean {
  try {
    _.forOwn(preferencesJSON, function (value, key) {
      process.env[key.toUpperCase()] = value.toString();
      logger.debug(`process.env.${key.toUpperCase()}: `, value);
    });
    return true;
  } catch (err) {
    logger.error("updateProcessEnvs failed. Error: ", err);
    throw err;
  }
}

/**
 * Update current preferences. Passed preferences JSON will be merged with currently preferences
 * @param preferencesJSON {object}
 * @returns true
 */
export function updatePreferencesJSON(
  preferencesJSON: Partial<Preferences>
): Preferences {
  try {
    let curPreferencesJSON = getPreferencesJSON();
    // preferencesJSON = _.merge(curPreferencesJSON, preferencesJSON, {
    //   version: curPreferencesJSON.version
    // });
    curPreferencesJSON = {
      ...curPreferencesJSON,
      ...preferencesJSON,
      ...{ version: curPreferencesJSON.version },
    };
    curPreferencesJSON = cleanPreferences(curPreferencesJSON);
    fs.outputJSONSync(PREFERENCES_JSON_PATH, curPreferencesJSON);
    return curPreferencesJSON;
  } catch (err) {
    logger.error(
      "updatePreferencesJSON-> Output preferences JSON fail. Path: ",
      PREFERENCES_JSON_PATH,
      "Preference JSON: ",
      preferencesJSON,
      "Error: ",
      err
    );
    throw err;
  }
}

// Get default preferences
export function getDefaultPreferences(): Preferences {
  return {
    WEB_APP_LOG_LEVEL: LogLevel.info,
    WEB_APP_LOG_MAX_SIZE,
    WEB_APP_PORT: WEB_APP_PORT,
    WEB_APP_HOME_PATH: path.join(APP_HOME_PATH, WEB_APP_NAME),
    APP_HOME_PATH,
    WEB_APP_DATABASE_URL: WEB_APP_DATABASE_URL,
    LOG_FILES_PATH: path.join(APP_HOME_PATH, LOG_FILES_FOLDER),
    version: "1.0.0",
  };
}

/**
 * remove unnecessary field
 * @param Preferences
 */
export function cleanPreferences(preferences: Preferences): Preferences {
  console.log("cleanPreferences");
  return preferences;
}
