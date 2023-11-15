// Setup Event Listeners

import { IpcEvents } from "../ipc-events";
import { AppPreferences } from "../types";
import logger from "./helpers/logger";
// import {
//   getPreferencesJSON,
//   updatePreferencesJSON,
// } from "./helpers/preferences";
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
    IpcEvents.SYNC_GET_PREFERENCES_JSON,
    async (event: {
      returnValue: {
        status: boolean;
        payload?: { preferences?: AppPreferences };
        error?: unknown;
      };
    }) => {
      try {
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
