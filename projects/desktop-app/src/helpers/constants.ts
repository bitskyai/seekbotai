import { app } from "electron";
import * as path from "path";

const appFolder = ".bookmark_intelligence";
export const homeFolder = path.join(app.getPath("home"));

export const APP_HOME_FOLDER = path.join(homeFolder, appFolder);

// log files path for supplier
export const LOG_FILES_PATH = path.join(APP_HOME_FOLDER, "./log");

export const PREFERENCES_JSON_PATH = path.join(
  APP_HOME_FOLDER,
  "preferences.json"
);

export const FIRST_TIME_RUN_FILE = "bookmark-intelligence-first-run";
