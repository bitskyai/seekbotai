import { bool, cleanEnv, num, str } from "envalid";
import _ from "lodash";
import { AppConfig } from "../types";
import { DEFAULT_APP_CONFIG } from "./constants";

let _app_config = getCleanEnv();

function getCleanEnv(overwriteProcessEnv?: object) {
  return cleanEnv(_.merge({}, process.env, overwriteProcessEnv ?? {}), {
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
  });
}

export function overwriteAppConfig(appConfig: object): AppConfig {
  _app_config = getCleanEnv(appConfig);
  return _app_config;
}

export function getAppConfig(): AppConfig {
  return _app_config;
}
