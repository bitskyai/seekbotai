import { AppConfig } from "../types";
import { DEFAULT_APP_CONFIG } from "./constants";
import { bool, cleanEnv, num, str } from "envalid";
import _ from "lodash";

let _app_config = getCleanEnv();

function getCleanEnv(overwriteProcessEnv?: object) {
  return cleanEnv(_.merge({}, process.env, overwriteProcessEnv ?? {}), {
    DESKTOP_MODE: bool({ default: true }),
    SAVE_RAW_PAGE: bool({ default: DEFAULT_APP_CONFIG.SAVE_RAW_PAGE }),
    APP_HOME_PATH: str({
      default: DEFAULT_APP_CONFIG.APP_HOME_PATH,
    }),
    APP_SOURCE_PATH: str({
      default: DEFAULT_APP_CONFIG.APP_SOURCE_PATH,
    }),
    DATABASE_URL: str({
      default: DEFAULT_APP_CONFIG.DATABASE_URL,
    }),
    DATABASE_PROVIDER: str({
      default: DEFAULT_APP_CONFIG.DATABASE_PROVIDER,
    }),
    SETUP_DB: bool({
      default: DEFAULT_APP_CONFIG.SETUP_DB,
    }),
    SEED_DB: bool({
      default: DEFAULT_APP_CONFIG.SEED_DB,
    }),
    LOG_FILES_FOLDER: str({
      default: DEFAULT_APP_CONFIG.LOG_FILES_FOLDER,
    }),
    LOG_LEVEL: str({
      default: DEFAULT_APP_CONFIG.LOG_LEVEL,
    }),
    LOG_MAX_SIZE: num({
      default: DEFAULT_APP_CONFIG.LOG_MAX_SIZE,
    }),
    NODE_ENV: str({
      default: DEFAULT_APP_CONFIG.NODE_ENV,
    }),
    PORT: num({
      default: DEFAULT_APP_CONFIG.PORT,
    }),
    SERVICE_NAME: str({
      default: DEFAULT_APP_CONFIG.SERVICE_NAME,
    }),
    VERSION: str({
      default: "1.0.0",
    }),
    HOST_NAME: str({
      default: DEFAULT_APP_CONFIG.HOST_NAME,
    }),
    START_MEILISEARCH: bool({
      default: DEFAULT_APP_CONFIG.START_MEILISEARCH,
    }),
    MEILISEARCH_PORT: num({
      default: DEFAULT_APP_CONFIG.MEILISEARCH_PORT,
    }),
    MEILISEARCH_MASTER_KEY: str({
      default: DEFAULT_APP_CONFIG.MEILISEARCH_MASTER_KEY,
    }),
    MEILISEARCH_DB_FOLDER: str({
      default: DEFAULT_APP_CONFIG.MEILISEARCH_DB_FOLDER,
    }),
    MEILI_MAX_INDEXING_MEMORY: num({
      default: DEFAULT_APP_CONFIG.MEILI_MAX_INDEXING_MEMORY,
    }),
    MEILI_MAX_INDEXING_THREADS: num({
      default: DEFAULT_APP_CONFIG.MEILI_MAX_INDEXING_THREADS,
    }),
  });
}

export function overwriteAppConfig(appConfig: object): AppConfig {
  _app_config = getCleanEnv(appConfig);
  return _app_config;
}

export function getAppConfig(): AppConfig {
  return _app_config;
}
