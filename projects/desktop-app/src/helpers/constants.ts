import { app } from "electron";
import * as path from "path";

const appFolder = ".bookmark_intelligence";
export const homePath = path.join(app.getPath("home"));

export const APP_HOME_PATH = path.join(homePath, appFolder);

export const LOG_FILES_FOLDER = "log";

export const WEB_APP_PORT = 56789;

export const WEB_APP_NAME = "webapp";

export const WEB_APP_DATABASE_URL = `file:${APP_HOME_PATH}/${WEB_APP_NAME}/bi.db`;

export const WEB_APP_LOG_MAX_SIZE = 10 * 1024 * 1024; //10mb

export const PREFERENCES_JSON_PATH = path.join(
  APP_HOME_PATH,
  "preferences.json"
);

export const FIRST_TIME_RUN_FILE = "bookmark-intelligence-first-run";
