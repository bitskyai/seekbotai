export interface ServerOptions {
  PORT: number;
  DATABASE_PROVIDER: string;
  DATABASE_URL: string;
  APP_HOME_PATH: string;
  LOG_LEVEL: string;
  LOG_MAX_SIZE: number;
  APP_SOURCE_PATH: string;
}

export interface AppConfig extends ServerOptions {
  [key: string]: string | number | boolean | undefined;
  LOG_FILES_FOLDER: string;
  SERVICE_NAME: string;
  NODE_ENV: string;
}

export interface Migration {
  id: string;
  checksum: string;
  finished_at: string;
  migration_name: string;
  logs: string;
  rolled_back_at: string;
  started_at: string;
  applied_steps_count: string;
}
