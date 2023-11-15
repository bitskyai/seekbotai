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

// xxxPreferences are user configurable preferences
// xxxOptions are included xxxPreferences and system options(that are not configurable from user, but can be changed by environment)
// xxxConfig are included xxxOptions and dynamic generated config

// user configurable preferences for web app
export interface WebAppPreferences {
  WEB_APP_LOG_LEVEL: string;
  WEB_APP_LOG_MAX_SIZE: number;
  WEB_APP_SAVE_RAW_PAGE: boolean;
  WEB_APP_MASTER_KEY: string;
  WEB_APP_SETUP_DB: boolean;
  WEB_APP_SEED_DB: boolean;
}

// AppConfig are configurable
export interface WebAppOptions extends WebAppPreferences {
  WEB_APP_NAME: string;
  WEB_APP_PORT: number;
  WEB_APP_DATABASE_NAME: string;
  WEB_APP_HOST_NAME: string;
}

// user configurable preferences for search engine
export interface SearchEnginePreferences {
  SEARCH_ENGINE_INDEXING_FREQUENCY: number;
  SEARCH_ENGINE_MASTER_KEY: string;
}

export interface SearchEngineOptions extends SearchEnginePreferences {
  SEARCH_ENGINE_START: boolean;
  SEARCH_ENGINE_NAME: string;
  SEARCH_ENGINE_PORT: number;
}

// user configurable preferences for desktop app
export interface DesktopAppPreferences {
  DESKTOP_APP_USER_DATA_PATH: string; // Home path for current user, used to store user's data
}

export interface DesktopAppOptions extends DesktopAppPreferences {
  VERSION: string;
  DESKTOP_APP_HOME_PATH: string;
  DESKTOP_APP_FIRST_TIME_RUN_FILE_NAME: string;
  DESKTOP_APP_LOG_FILES_FOLDER: string;
  DESKTOP_APP_CONFIG_FILE_NAME: string;
  DESKTOP_APP_PREFERENCES_JSON_FILE_NAME: string;
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
  DESKTOP_APP_PREFERENCES_JSON_FILE_PATH: string; // DESKTOP_APP_USER_DATA_HOME_PATH/DESKTOP_APP_PREFERENCES_JSON_FILE_NAME
  DESKTOP_APP_CONFIG_FILE_PATH: string; // DESKTOP_APP_HOME_PATH/DESKTOP_APP_CONFIG_FILE_NAME
  DESKTOP_APP_LOG_FILES_PATH: string; // DESKTOP_APP_USER_DATA_HOME_PATH/DESKTOP_APP_LOG_FILES_FOLDER
  DESKTOP_APP_FIRST_TIME_RUN_FILE_PATH: string; // DESKTOP_APP_USER_DATA_HOME_PATH/DESKTOP_APP_FIRST_TIME_RUN_FILE_NAME
  WEB_APP_HOME_PATH: string; // DESKTOP_APP_USER_DATA_HOME_PATH/WEB_APP_NAME
  SEARCH_ENGINE_HOME_PATH: string; // DESKTOP_APP_HOME_PATH/SEARCH_ENGINE_NAME
}
