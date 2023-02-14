// Setup Event Listeners
import logger from "../helpers/logger";
import { Preferences } from "../interfaces";
import { IpcEvents } from "../ipc-events";
import { ipcMainManager } from "./ipc";
import { hideSettings } from "./menu";
import { getPreferencesJSON, updatePreferencesJSON } from "./preferences";

export function setUpEventListeners() {
  ipcMainManager.on(IpcEvents.CLOSE_SETTINGS, () => {
    try {
      hideSettings();
    } catch (err) {
      logger.error("IpcEvents.CLOSE_SETTINGS failed. Error: ", err);
    }
  });

  ipcMainManager.on(
    IpcEvents.SYNC_GET_PREFERENCES_JSON,
    (event: {
      returnValue: {
        status: boolean;
        payload?: { preferences: Preferences };
        error?: unknown;
      };
    }) => {
      try {
        event.returnValue = {
          status: true,
          payload: {
            preferences: getPreferencesJSON(),
          },
        };
      } catch (err) {
        event.returnValue = {
          status: false,
          error: err,
        };
      }
    }
  );

  ipcMainManager.on(
    IpcEvents.SYNC_UPDATE_PREFERENCES_JSON,
    async (
      event: { returnValue: { status: boolean; error?: unknown } },
      arg: { preferences: Preferences }
    ) => {
      try {
        updatePreferencesJSON(arg.preferences);
        event.returnValue = {
          status: true,
        };
      } catch (err) {
        event.returnValue = {
          status: false,
          error: err,
        };
      }
    }
  );
}
