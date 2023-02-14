import os from "os";
import { AppConfig } from "../types";
const packageJson = require("../../package.json");

export const DEFAULT_APP_CONFIG: AppConfig = {
  APP_HOME_FOLDER: os.homedir(),
  COMBINED_LOG_FILE_NAME: "combined.log",
  DATABASE_URL: `file:${os.homedir()}/${packageJson.name}.db`,
  ERROR_LOG_FILE_NAME: "error.log",
  LOG_FILES_PATH: "./log", // relative to `APP_HOME_FOLDER`
  LOG_LEVEL: "error",
  LOG_MAX_SIZE: 50 * 1024 * 1024, // 50MB
  NODE_ENV: "development",
  PORT: 4000,
  SERVICE_NAME: packageJson.name,
};
