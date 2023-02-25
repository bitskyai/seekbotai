export interface ServerOptions {
  PORT: number;
  DATABASE_URL: string;
  APP_HOME_PATH: string;
  LOG_LEVEL: string;
  LOG_MAX_SIZE: number;
}

export interface AppConfig extends ServerOptions {
  [key: string]: string | number | boolean | undefined;
  LOG_FILES_FOLDER: string;
  SERVICE_NAME: string;
  NODE_ENV: string;
}
