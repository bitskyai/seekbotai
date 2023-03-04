import { AppConfig } from "../types";
import path from "path";

const packageJson = require("../../package.json");

const appHomePath = path.join(__dirname, "../../", `.${packageJson.name}`);
export const DEFAULT_APP_CONFIG: AppConfig = {
  APP_HOME_PATH: appHomePath,
  APP_SOURCE_PATH: path.join(__dirname, "../../"),
  COMBINED_LOG_FILE_NAME: "combined.log",
  SETUP_DB: true,
  SEED_DB: false,
  DATABASE_PROVIDER: "sqlite",
  DATABASE_URL: `file:${appHomePath}/${packageJson.name}.db`,
  ERROR_LOG_FILE_NAME: "error.log",
  LOG_FILES_FOLDER: "log", // relative to `APP_HOME_PATH`
  LOG_LEVEL: "info",
  LOG_MAX_SIZE: 50 * 1024 * 1024, // 50MB
  NODE_ENV: "development",
  PORT: 4000,
  SERVICE_NAME: packageJson.name,
};
