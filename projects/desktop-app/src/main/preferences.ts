// preferences settings only support main process
import * as fs from "fs-extra";
import * as _ from "lodash";
import { LOG_FILES_PATH, PREFERENCES_JSON_PATH } from "../helpers/constants";
import logger from "../helpers/logger";
import { Preferences } from "../interfaces";

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
      process.env[key.toUpperCase()] = value;
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
  preferencesJSON: Preferences
): Preferences {
  try {
    const curPreferencesJSON = getPreferencesJSON();
    // preferencesJSON = _.merge(curPreferencesJSON, preferencesJSON, {
    //   version: curPreferencesJSON.version
    // });
    preferencesJSON = {
      ...curPreferencesJSON,
      ...preferencesJSON,
      ...{ version: curPreferencesJSON.version },
    };
    preferencesJSON = cleanPreferences(preferencesJSON);
    fs.outputJSONSync(PREFERENCES_JSON_PATH, preferencesJSON);
    return preferencesJSON;
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

// Get default prefences
export function getDefaultPreferences(): Preferences {
  return {
    LOG_FILES_PATH,
    version: "1.0.0",
  };
}

/**
 * remove unnecessary field
 * @param prefences
 */
export function cleanPreferences(preferences: Preferences): Preferences {
  console.log("cleanPreferences");
  return preferences;
}
