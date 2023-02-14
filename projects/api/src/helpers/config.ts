import { cleanEnv, num, str } from "envalid";
import { AppConfig } from "../types";
import { DEFAULT_APP_CONFIG } from "./constants";
export function getAppConfig(): AppConfig {
  return cleanEnv(process.env, {
    APP_HOME_FOLDER: str({
      default: DEFAULT_APP_CONFIG.APP_HOME_FOLDER,
    }),
    DATABASE_URL: str({
      default: DEFAULT_APP_CONFIG.DATABASE_URL,
    }),
    LOG_FILES_PATH: str({
      default: DEFAULT_APP_CONFIG.LOG_FILES_PATH,
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
