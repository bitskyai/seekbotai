import {
  SearchEngineOptions,
  SearchEnginePreferences,
  WebAppOptions,
  WebAppPreferences,
} from "./web-app/src/types";

export interface NpmVersion {
  version: string;
  name?: string;
  localPath?: string;
}

export const enum DirType {
  "file" = "file",
  "directory" = "directory",
}

export interface DirStructure {
  type: DirType;
  name: string;
  path: string;
  children?: Array<DirStructure>;
}

export interface OpenFile {
  path: string;
  name: string;
  extName: string;
  content?: string;
}

export interface OpenFilesHash {
  [key: string]: OpenFile;
}

export interface LogItem {
  timestamp: number;
  text: string;
}

export const enum LogLevel {
  "error" = "error",
  "warn" = "warn",
  "info" = "info",
  "debug" = "debug",
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface BaseAppPreferences {}

export interface BaseAppOptions {
  PREFERENCES_JSON_FILE_NAME: string;
}

// xxxPreferences are user configurable preferences
// xxxOptions are included xxxPreferences and system options(that are not configurable from user, but can be changed by environment variables)
// xxxConfig are included xxxOptions and dynamic generated config

// user configurable preferences for desktop app
export interface DesktopAppPreferences extends BaseAppPreferences {
  DESKTOP_APP_USER_DATA_PATH: string; // Home path for current user, used to store user's data
}

export interface DesktopAppOptions
  extends DesktopAppPreferences,
    BaseAppOptions {
  DESKTOP_APP_HOME_PATH: string;
  DESKTOP_APP_FIRST_TIME_RUN_FILE_NAME: string;
  DESKTOP_APP_LOG_FILES_FOLDER: string;
}

// user configurable preferences for app
export interface AppPreferences
  extends WebAppPreferences,
    SearchEnginePreferences,
    DesktopAppPreferences {}

export interface AppOptions
  extends DesktopAppOptions,
    WebAppOptions,
    SearchEngineOptions {}

// app config that contains all the configs from web app, search engine and desktop app
// also contains dynamic generated config
export interface AppConfig extends AppOptions {
  DESKTOP_APP_LOG_FILES_PATH: string; // DESKTOP_APP_USER_DATA_HOME_PATH/DESKTOP_APP_LOG_FILES_FOLDER
  DESKTOP_APP_FIRST_TIME_RUN_FILE_PATH: string; // DESKTOP_APP_USER_DATA_HOME_PATH/DESKTOP_APP_FIRST_TIME_RUN_FILE_NAME
  WEB_APP_HOME_PATH: string; // DESKTOP_APP_USER_DATA_HOME_PATH/WEB_APP_NAME
  SEARCH_ENGINE_HOME_PATH: string; // DESKTOP_APP_HOME_PATH/SEARCH_ENGINE_NAME
}
