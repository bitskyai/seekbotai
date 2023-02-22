import path from "path";
import { AppConfig } from "../types";
const packageJson = require("../../package.json");

const appHomeFolder = path.join(__dirname, "../../", `.${packageJson.name}`);
export const DEFAULT_APP_CONFIG: AppConfig = {
  APP_HOME_FOLDER: appHomeFolder,
  COMBINED_LOG_FILE_NAME: "combined.log",
  DATABASE_URL: `file:${appHomeFolder}/${packageJson.name}.db`,
  ERROR_LOG_FILE_NAME: "error.log",
  LOG_FILES_PATH: "./log", // relative to `APP_HOME_FOLDER`
  LOG_LEVEL: "info",
  LOG_MAX_SIZE: 50 * 1024 * 1024, // 50MB
  NODE_ENV: "development",
  PORT: 4000,
  SERVICE_NAME: packageJson.name,
};
