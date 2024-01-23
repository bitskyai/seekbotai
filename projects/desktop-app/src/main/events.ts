// Setup Event Listeners

import { IpcEvents } from "../ipc-events";
import type { AppConfig, AppPreferences } from "../types";
import { getAppConfig } from "./helpers/config";
import logger from "./helpers/logger";
import { ipcMainManager } from "./ipc";
import { hideSettings } from "./menu";

export function setUpEventListeners() {
  ipcMainManager.on(IpcEvents.CLOSE_SETTINGS, () => {
    try {
      hideSettings();
    } catch (err) {
      logger.error("IpcEvents.CLOSE_SETTINGS failed. Error: ", err);
    }
  });

  ipcMainManager.on(
    IpcEvents.SYNC_GET_APP_CONFIG,
    async (event: {
      returnValue: {
        status: boolean;
        payload?: { config?: AppConfig };
        error?: unknown;
      };
    }) => {
      try {
        const config = await getAppConfig();
        event.returnValue = {
          status: true,
          payload: { config: config },
        };
      } catch (err) {
        event.returnValue = {
          status: false,
          error: err,
        };
      }
    },
  );

  ipcMainManager.on(
    IpcEvents.SYNC_UPDATE_PREFERENCES_JSON,
    async (
      event: { returnValue: { status: boolean; error?: unknown } },
      arg: { preferences: AppPreferences },
    ) => {
      try {
        // updatePreferencesJSON(arg.preferences);
        event.returnValue = {
          status: true,
        };
      } catch (err) {
        event.returnValue = {
          status: false,
          error: err,
        };
      }
    },
  );
}
