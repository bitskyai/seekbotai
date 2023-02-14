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

export interface Preferences {
  version: string;
  LOG_FILES_PATH: string;
}
