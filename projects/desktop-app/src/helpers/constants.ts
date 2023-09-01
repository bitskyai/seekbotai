import {
  PORT_RANGE,
  DEFAULT_MEILISEARCH_PORT,
  DEFAULT_HOST_NAME,
  DEFAULT_MEILISEARCH_MASTER_KEY,
} from "../bitskyLibs/shared";
import { app } from "electron";
import * as path from "path";

const appFolder = ".bitsky_app_home";
export const homePath = path.join(app.getPath("home"));

export const APP_HOME_PATH = path.join(homePath, appFolder);

export const LOG_FILES_FOLDER = "log";

export const WEB_APP_PORT = PORT_RANGE[0];
export const WEB_APP_MEILISEARCH_PORT = DEFAULT_MEILISEARCH_PORT;
export const WEB_APP_HOST_NAME = DEFAULT_HOST_NAME;
export const WEB_APP_MEILISEARCH_MASTER_KEY = DEFAULT_MEILISEARCH_MASTER_KEY;

export const WEB_APP_NAME = "web-app";
export const WEB_APP_MEILISEARCH_NAME = "meilisearch";

export const WEB_APP_DATABASE_URL = `file:${APP_HOME_PATH}/${WEB_APP_NAME}/bi.db`;

export const WEB_APP_LOG_MAX_SIZE = 10 * 1024 * 1024; //10mb

export const PREFERENCES_JSON_PATH = path.join(
  APP_HOME_PATH,
  "preferences.json",
);

export const FIRST_TIME_RUN_FILE = "bookmark-intelligence-first-run";
