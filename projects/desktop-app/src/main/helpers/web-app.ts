import { WebAppOptions, SearchEngineOptions } from "../../web-app/src/types";
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
      // Why need to dynamic import here?
      // The reason is we need to setup environment variables before import web-app and search-engine
      const { startWebAppAndSearchEngine } = await import("../../web-app");
      const webAppOptions: WebAppOptions = {
        DESKTOP_MODE: true,
        WEB_APP_PORT: appConfig.WEB_APP_PORT,
        WEB_APP_HOME_PATH: appConfig.WEB_APP_HOME_PATH,
        WEB_APP_SOURCE_ROOT_PATH: webAppSourcePath,
        WEB_APP_SETUP_DB: appConfig.WEB_APP_SETUP_DB,
        WEB_APP_SEED_DB: appConfig.WEB_APP_SEED_DB,
        WEB_APP_LOG_LEVEL: appConfig.WEB_APP_LOG_LEVEL,
        WEB_APP_LOG_MAX_SIZE: appConfig.WEB_APP_LOG_MAX_SIZE,
      };

      logger.info("webAppOptions: ", webAppOptions);
      // await startWebApp(webAppOptions);

      const searchEngineOptions: SearchEngineOptions = {
        SEARCH_ENGINE_PORT: appConfig.SEARCH_ENGINE_PORT,
        SEARCH_ENGINE_HOME_PATH: appConfig.SEARCH_ENGINE_HOME_PATH,
        SEARCH_ENGINE_MAX_INDEXING_MEMORY:
          appConfig.SEARCH_ENGINE_MAX_INDEXING_MEMORY,
        SEARCH_ENGINE_MAX_INDEXING_THREADS:
          appConfig.SEARCH_ENGINE_MAX_INDEXING_THREADS,
        SEARCH_ENGINE_INDEXING_FREQUENCY:
          appConfig.SEARCH_ENGINE_INDEXING_FREQUENCY,
      };
      logger.info("searchEngineOptions: ", searchEngineOptions);
      // await startSearchEngine(searchEngineOptions);
      await startWebAppAndSearchEngine(webAppOptions, searchEngineOptions);
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
      const { stopWebAppAndSearchEngine } = await import("../../web-app");
      await stopWebAppAndSearchEngine();
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
