import {
  DEFAULT_MEILISEARCH_MASTER_KEY,
  DEFAULT_HOST_NAME,
} from "../bitskyLibs/shared";
import { AppConfig } from "../types";
import path from "path";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const packageJson = require("../../package.json");

const appHomePath = path.join(__dirname, "../../", `.${packageJson.name}`);
export const DEFAULT_APP_CONFIG: AppConfig = {
  APP_HOME_PATH: appHomePath,
  APP_SOURCE_PATH: path.join(__dirname, "../../"),
  SAVE_RAW_PAGE: false,
  COMBINED_LOG_FILE_NAME: "combined.log",
  SETUP_DB: true,
  SEED_DB: false,
  DATABASE_PROVIDER: "sqlite",
  DATABASE_URL: `file:${appHomePath}/${packageJson.name}.db`,
  HOST_NAME: DEFAULT_HOST_NAME,
  ERROR_LOG_FILE_NAME: "error.log",
  LOG_FILES_FOLDER: "log", // relative to `APP_HOME_PATH`
  LOG_LEVEL: "info",
  LOG_MAX_SIZE: 50 * 1024 * 1024, // 50MB
  NODE_ENV: "development",
  PORT: 46997,
  SERVICE_NAME: packageJson.name,
  START_MEILISEARCH: true,
  MEILISEARCH_PORT: 47700,
  MEILISEARCH_MASTER_KEY: DEFAULT_MEILISEARCH_MASTER_KEY,
  MEILISEARCH_DB_FOLDER: "meilisearch",
  MEILI_MAX_INDEXING_MEMORY: 1024 * 1024 * 500, // 500MB
  MEILI_MAX_INDEXING_THREADS: 1,
};
