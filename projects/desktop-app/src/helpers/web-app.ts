import {
  getPreferencesJSON,
  updatePreferencesJSON,
  updateProcessEnvs,
} from "../main/preferences";
import { startServer, stopServer } from "../web-app/src/server";
import {
  APP_HOME_PATH,
  WEB_APP_NAME,
  WEB_APP_PORT,
  WEB_APP_MEILISEARCH_PORT,
} from "./constants";
import { getAvailablePort } from "./index";
import logger from "./logger";
import { app, dialog } from "electron";
import path from "path";

class WebApp {
  public port = WEB_APP_PORT;
  public searchEnginePort = WEB_APP_MEILISEARCH_PORT;
  constructor() {
    logger.log("WebApp constructor");
  }

  public async start() {
    try {
      const preferences = getPreferencesJSON();
      this.port = await getAvailablePort(preferences.WEB_APP_PORT);
      this.searchEnginePort = await getAvailablePort(
        preferences.WEB_APP_MEILISEARCH_PORT,
      );
      if (this.port != preferences.WEB_APP_PORT) {
        updatePreferencesJSON({ WEB_APP_PORT: this.port });
      }
      if (this.searchEnginePort != preferences.WEB_APP_MEILISEARCH_PORT) {
        updatePreferencesJSON({
          WEB_APP_MEILISEARCH_PORT: this.searchEnginePort,
        });
      }
      const webAppSourcePath = path.join(
        app.getAppPath(),
        "dist",
        WEB_APP_NAME,
      );
      // start
      updateProcessEnvs(preferences);
      logger.info("preferences", preferences);
      logger.info("starting bitsky...");
      const webAppConfig = {
        DESKTOP_MODE: true,
        PORT: preferences.WEB_APP_PORT,
        DATABASE_URL: preferences.WEB_APP_DATABASE_URL,
        APP_HOME_PATH: preferences.WEB_APP_HOME_PATH,
        APP_SOURCE_PATH: webAppSourcePath,
        SETUP_DB: preferences.WEB_APP_SETUP_DB,
        SEED_DB: preferences.WEB_APP_SEED_DB,
        LOG_LEVEL: preferences.WEB_APP_LOG_LEVEL,
        LOG_MAX_SIZE: preferences.WEB_APP_LOG_MAX_SIZE,
        START_MEILISEARCH: preferences.WEB_APP_START_MEILISEARCH,
        HOST_NAME: preferences.WEB_APP_HOST_NAME,
        MEILISEARCH_PORT: preferences.WEB_APP_MEILISEARCH_PORT,
        MEILISEARCH_MASTER_KEY: preferences.WEB_APP_MEILISEARCH_MASTER_KEY,
      };
      logger.info("webAppConfig", webAppConfig);
      await startServer(webAppConfig);
      logger.info("bitsky successfully started.");
      process.env.BITSKY_BASE_URL = `http://${preferences.WEB_APP_HOST_NAME}:${this.port}`;
    } catch (err) {
      dialog.showErrorBox(
        "Open BitSky Failed",
        `You can try to close BitSky and reopen it again, if still doesn't work, try to delete ${APP_HOME_PATH} folder in your home folder. Error:${JSON.stringify(
          err,
        )}`,
      );
      throw err;
    }
  }

  public async restart() {
    try {
      logger.info("Restarting BitSky...");
      this.stop();
      this.start();
      logger.info("Restarted BitSky");
    } catch (err) {
      dialog.showErrorBox(
        "Restart BitSky Failed",
        `You can try to close BitSky and reopen it again, if still doesn't work, try to delete ${APP_HOME_PATH} folder in your home folder. Error:${JSON.stringify(
          err,
        )}`,
      );
      throw err;
    }
  }

  public async stop() {
    try {
      logger.info("Stop BitSky...");
      await stopServer();
      logger.info("Stopped BitSky");
    } catch (err) {
      dialog.showErrorBox(
        "Stop BitSky Failed",
        `You can try to force close BitSky. Error:${JSON.stringify(err)}`,
      );
      throw err;
    }
  }
}

export default new WebApp();
