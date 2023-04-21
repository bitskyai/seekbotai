import {
  getPreferencesJSON,
  updatePreferencesJSON,
  updateProcessEnvs,
} from "../main/preferences";
import { getOrCreateMainWindow } from "../main/windows";
import { startServer, stopServer } from "../web-app/src/server";
import { APP_HOME_PATH, WEB_APP_NAME, WEB_APP_PORT } from "./constants";
import { getAvailablePort } from "./index";
import logger from "./logger";
import { app, dialog } from "electron";
import path from "path";

class WebApp {
  public port = WEB_APP_PORT;
  constructor() {
    logger.log("WebApp constructor");
  }

  public async start() {
    try {
      const preferences = getPreferencesJSON();
      logger.info(
        "main->main.js->onReady, LOG_FILES_PATH: ",
        process.env.LOG_FILES_PATH,
      );
      this.port = await getAvailablePort(preferences.WEB_APP_PORT);
      if (this.port != preferences.WEB_APP_PORT) {
        updatePreferencesJSON({ WEB_APP_PORT: this.port });
      }
      // start
      updateProcessEnvs(preferences);
      await startServer({
        DESKTOP_MODE: true,
        PORT: preferences.WEB_APP_PORT,
        DATABASE_URL: preferences.WEB_APP_DATABASE_URL,
        APP_HOME_PATH: preferences.WEB_APP_HOME_PATH,
        APP_SOURCE_PATH: path.join(
          app.getAppPath().replace("app.asar", "app.asar.unpacked"),
          "dist",
          WEB_APP_NAME,
        ),
        SETUP_DB: preferences.WEB_APP_SETUP_DB,
        SEED_DB: preferences.WEB_APP_SEED_DB,
        LOG_LEVEL: preferences.WEB_APP_LOG_LEVEL,
        LOG_MAX_SIZE: preferences.WEB_APP_LOG_MAX_SIZE,
      });
      logger.info(
        "main->main.js->onReady, bitsky-supplier successfully started.",
      );
      const mainWindow = getOrCreateMainWindow();
      mainWindow.loadURL(`http://localhost:${this.port}`);
      process.env.BITSKY_BASE_URL = `http://localhost:${this.port}`;
      // Only used for UI Develop
      // mainWindow.loadURL(`http://localhost:8000`);

      logger.info(
        `main->main.js->onReady, load http://localhost:${this.port} in main browser`,
      );
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
      this.stop();
      this.start();
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
      await stopServer();
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
