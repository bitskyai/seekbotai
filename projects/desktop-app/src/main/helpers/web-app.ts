import { IpcEvents } from "../../ipc-events";
import { ipcMainManager } from "../ipc";
import { getMainWindow } from "../windows";
import { setBrowserExtension } from "./browserExtensions";
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
      logger.info("starting SeekBot...");
      // Why need to dynamic import here?
      // The reason is we need to setup environment variables before import web-app and search-engine
      const { startWebAppAndSearchEngine, listenBrowserExtensionConnected } =
        await import("../../web-app");

      await startWebAppAndSearchEngine();
      listenBrowserExtensionConnected(async (data) => {
        logger.info("extension connected", { data: data });
        const mainWindow = getMainWindow();
        if (mainWindow) {
          ipcMainManager.send(IpcEvents.EXTENSION_CONNECTED, [
            { status: "success", payload: await setBrowserExtension(data) },
          ]);
        }
      });
      logger.info("SeekBot successfully started.");
      process.env.BITSKY_BASE_URL = `http://${appConfig.WEB_APP_HOST_NAME}:${this.port}`;
    } catch (err) {
      const appConfig = await getAppConfig();

      dialog.showErrorBox(
        "Open SeekBot Failed",
        `You can try to close SeekBot and reopen it again, if still doesn't work, try to delete SeekBot folder in ${
          appConfig.DESKTOP_APP_USER_DATA_PATH
        }. Error:${JSON.stringify(err)}`,
      );
      throw err;
    }
  }

  public async restart() {
    try {
      logger.info("Restarting SeekBot...");
      this.stop();
      this.start();
      logger.info("Restarted SeekBot");
    } catch (err) {
      dialog.showErrorBox(
        "Restart SeekBot Failed",
        `You can try to close SeekBot and reopen it again, if still doesn't work, try to delete seekbot folder in your home folder. Error:${JSON.stringify(
          err,
        )}`,
      );
      throw err;
    }
  }

  public async stop() {
    try {
      logger.info("Stop SeekBot...");
      const { stopWebAppAndSearchEngine } = await import("../../web-app");
      await stopWebAppAndSearchEngine();
      // Also need to delete cache, otherwise, it will use old configure
      delete require.cache[path.resolve("../../web-app")];
      logger.info("Stopped SeekBot");
    } catch (err) {
      dialog.showErrorBox(
        "Stop SeekBot Failed",
        `You can try to force close SeekBot. Error:${JSON.stringify(err)}`,
      );
      throw err;
    }
  }
}

export default new WebApp();
