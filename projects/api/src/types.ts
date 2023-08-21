export interface MeiliSearchConfig {
  HOST_NAME: string;
  MEILISEARCH_PORT: number;
  MEILISEARCH_MASTER_KEY: string;
}

export interface ServerOptions extends MeiliSearchConfig {
  APP_HOME_PATH: string; // app home path. This is where all data stored
  PORT: number;
  DATABASE_PROVIDER: string;
  DATABASE_URL: string;
  APP_SOURCE_PATH: string;
  LOG_LEVEL: string;
  LOG_MAX_SIZE: number;
  SETUP_DB: boolean;
  SEED_DB: boolean;
  SAVE_RAW_PAGE: boolean;
  START_MEILISEARCH: boolean;
}

export interface AppConfig extends ServerOptions {
  [key: string]: string | number | boolean | undefined;
  MEILISEARCH_DB_FOLDER: string;
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

export interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface GQLContext {
  user: User;
}
