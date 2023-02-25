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

// Preferences are configurable
export interface Preferences {
  WEB_APP_LOG_LEVEL: LogLevel;
  WEB_APP_LOG_MAX_SIZE: number;
  WEB_APP_PORT: number;
  WEB_APP_HOME_PATH: string;
  APP_HOME_PATH: string;
  WEB_APP_DATABASE_URL: string;
  LOG_FILES_PATH: string;
  version: string;
}
