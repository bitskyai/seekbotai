import { startServer, stopServer } from "../../web-app/src/server";
import { getAppConfig, updateProcessEnvs } from "./config";
import { DEFAULT_APP_OPTIONS } from "./constants";
import logger from "./logger";
import { app, dialog } from "electron";
import path from "path";

class WebApp {
  public port = DEFAULT_APP_OPTIONS.WEB_APP_PORT;
  public searchEnginePort = DEFAULT_APP_OPTIONS.SEARCH_ENGINE_PORT;
  constructor() {
    logger.log("WebApp constructor");
  }

  public async start() {
    try {
      const appConfig = await getAppConfig();

      const webAppSourcePath = path.join(
        app.getAppPath(),
        "dist",
        appConfig.WEB_APP_NAME,
      );
      // start
      updateProcessEnvs(appConfig);
      logger.info("starting bitsky...");
      const webAppConfig = {
        DESKTOP_MODE: true,
        PORT: appConfig.WEB_APP_PORT,
        DATABASE_NAME: appConfig.WEB_APP_DATABASE_NAME,
        APP_HOME_PATH: appConfig.WEB_APP_HOME_PATH,
        APP_SOURCE_PATH: webAppSourcePath,
        SETUP_DB: appConfig.WEB_APP_SETUP_DB,
        SEED_DB: appConfig.WEB_APP_SEED_DB,
        LOG_LEVEL: appConfig.WEB_APP_LOG_LEVEL,
        LOG_MAX_SIZE: appConfig.WEB_APP_LOG_MAX_SIZE,
        HOST_NAME: appConfig.WEB_APP_HOST_NAME,
        START_MEILISEARCH: appConfig.SEARCH_ENGINE_START,
        MEILISEARCH_PORT: appConfig.SEARCH_ENGINE_PORT,
        MEILISEARCH_MASTER_KEY: appConfig.SEARCH_ENGINE_MASTER_KEY,
      };
      logger.info("webAppConfig", webAppConfig);
      await startServer(webAppConfig);
      logger.info("bitsky successfully started.");
      process.env.BITSKY_BASE_URL = `http://${appConfig.WEB_APP_HOST_NAME}:${this.port}`;
    } catch (err) {
      dialog.showErrorBox(
        "Open BitSky Failed",
        `You can try to close BitSky and reopen it again, if still doesn't work, try to delete bitsky folder in your home folder. Error:${JSON.stringify(
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
        `You can try to close BitSky and reopen it again, if still doesn't work, try to delete bitsky folder in your home folder. Error:${JSON.stringify(
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
