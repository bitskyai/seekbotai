import { dialog } from "electron";
import { getPreferencesJSON, updateProcessEnvs } from "../main/preferences";
import { getOrCreateMainWindow } from "../main/windows";
import { startServer, stopServer } from "../web-app/src/server";
import { APP_HOME_FOLDER } from "./constants";
import { getAvailablePort } from "./index";
import logger from "./logger";

class WebApp {
  public port = 9099;
  constructor() {
    console.log("WebApp constructor");
  }

  public async start() {
    try {
      const preferences = getPreferencesJSON();
      updateProcessEnvs(preferences);
      logger.info(
        "main->main.js->onReady, LOG_FILES_PATH: ",
        process.env.LOG_FILES_PATH
      );
      this.port = await getAvailablePort(this.port);
      // start
      await startServer({});
      logger.info(
        "main->main.js->onReady, bitsky-supplier successfully started."
      );
      const mainWindow = getOrCreateMainWindow();
      mainWindow.loadURL(`http://localhost:${this.port}`);
      process.env.BITSKY_BASE_URL = `http://localhost:${this.port}`;
      // Only used for UI Develop
      // mainWindow.loadURL(`http://localhost:8000`);

      logger.info(
        `main->main.js->onReady, load http://localhost:${this.port} in main browser`
      );
    } catch (err) {
      dialog.showErrorBox(
        "Open BitSky Failed",
        `You can try to close BitSky and reopen it again, if still doesn't work, try to delete ${APP_HOME_FOLDER} folder in your home folder. Error:${JSON.stringify(
          err
        )}`
      );
      throw err;
    }
  }

  public async restart() {
    try {
      this.stop();
      this.start();
    } catch (err) {
      dialog.showErrorBox(
        "Restart BitSky Failed",
        `You can try to close BitSky and reopen it again, if still doesn't work, try to delete ${APP_HOME_FOLDER} folder in your home folder. Error:${JSON.stringify(
          err
        )}`
      );
      throw err;
    }
  }

  public async stop() {
    try {
      await stopServer();
    } catch (err) {
      dialog.showErrorBox(
        "Stop BitSky Failed",
        `You can try to force close BitSky. Error:${JSON.stringify(err)}`
      );
      throw err;
    }
  }
}

export default new WebApp();
