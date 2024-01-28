import { getAppConfig, updateProcessEnvs } from "./config";
import { DEFAULT_APP_OPTIONS } from "./constants";
import logger from "./logger";
import { dialog } from "electron";
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

      // start
      updateProcessEnvs(appConfig);
      logger.info("starting bitsky...");
      // Why need to dynamic import here?
      // The reason is we need to setup environment variables before import web-app and search-engine
      const { startWebAppAndSearchEngine, listenBrowserExtensionConnected } =
        await import("../../web-app");

      await startWebAppAndSearchEngine();
      listenBrowserExtensionConnected((data) => {
        logger.info(`Browser Extension Connected: ${JSON.stringify(data)}`);
      });
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
      // Also need to delete cache, otherwise, it will use old configure
      delete require.cache[path.resolve("../../web-app")];
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
