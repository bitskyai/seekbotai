import { dialog } from "electron";
import { getPreferencesJSON, updateProcessEnvs } from "../main/preferences";
import { getOrCreateMainWindow } from "../main/windows";
import { startServer, stopServer } from "../web-app/build/server.js";
import { APP_HOME_FOLDER } from "./constants";
import { getAvailablePort } from "./index";
import logger from "./logger";

class WebApp {
  public supplierPort = 9099;
  constructor() {
    console.log("WebApp constructor");
  }

  public async startSupplier() {
    try {
      const preferences = getPreferencesJSON();
      updateProcessEnvs(preferences);
      logger.info(
        "main->main.js->onReady, TYPEORM_DATABASE: ",
        process.env.TYPEORM_DATABASE
      );
      logger.info(
        "main->main.js->onReady, LOG_FILES_PATH: ",
        process.env.LOG_FILES_PATH
      );
      this.supplierPort = await getAvailablePort(this.supplierPort);
      process.env.PORT = this.supplierPort;
      // start
      await startServer();
      logger.info(
        "main->main.js->onReady, bitsky-supplier successfully started."
      );
      const mainWindow = getOrCreateMainWindow();
      mainWindow.loadURL(`http://localhost:${this.supplierPort}`);
      process.env.BITSKY_BASE_URL = `http://localhost:${this.supplierPort}`;
      // Only used for UI Develop
      // mainWindow.loadURL(`http://localhost:8000`);

      logger.info(
        `main->main.js->onReady, load http://localhost:${this.supplierPort} in main browser`
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

  public async restartSupplier() {
    try {
      this.stopSupplier();
      this.startSupplier();
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

  public async stopSupplier() {
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
