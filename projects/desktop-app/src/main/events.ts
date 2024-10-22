// Setup Event Listeners

import { IpcEvents } from "../ipc-events";
import type { AppConfig, AppPreferences, Tour } from "../types";
import type { BrowserExtensionConnectedData } from "../web-app/src/types";
import {
  getBrowserExtensions,
  removeBrowserExtension,
} from "./helpers/browserExtensions";
import { getAppConfig } from "./helpers/config";
import logger from "./helpers/logger";
import { finishedTour, getTour, resetTour } from "./helpers/tour";
import { ipcMainManager } from "./ipc";
import { hideSettings } from "./menu";
import { openSearchWindow } from "./windows";

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
    IpcEvents.SYNC_GET_EXTENSIONS,
    async (event: {
      returnValue: {
        status: boolean;
        payload?: BrowserExtensionConnectedData[];
        error?: unknown;
      };
    }) => {
      try {
        const browserExtensions = await getBrowserExtensions();
        event.returnValue = {
          status: true,
          payload: browserExtensions ?? [],
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
    IpcEvents.SYNC_REMOVE_EXTENSION,
    async (
      event: {
        returnValue: {
          status: boolean;
          payload?: BrowserExtensionConnectedData[];
          error?: unknown;
        };
      },
      extension: BrowserExtensionConnectedData,
    ) => {
      try {
        const browserExtensions = await removeBrowserExtension(extension);
        event.returnValue = {
          status: true,
          payload: browserExtensions ?? [],
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
    IpcEvents.SYNC_GET_PRODUCT_TOUR,
    async (event: {
      returnValue: {
        status: boolean;
        payload?: Tour;
        error?: unknown;
      };
    }) => {
      try {
        const tour = await getTour();
        event.returnValue = {
          status: true,
          payload: tour,
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
    IpcEvents.SYNC_RESET_PRODUCT_TOUR,
    async (event: {
      returnValue: {
        status: boolean;
        payload?: Tour;
        error?: unknown;
      };
    }) => {
      try {
        const tour = await resetTour();
        event.returnValue = {
          status: true,
          payload: tour,
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
    IpcEvents.SYNC_FINISH_PRODUCT_TOUR,
    async (event: {
      returnValue: {
        status: boolean;
        payload?: Tour;
        error?: unknown;
      };
    }) => {
      try {
        const tour = await finishedTour();
        event.returnValue = {
          status: true,
          payload: tour,
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
    IpcEvents.SYNC_OPEN_SEARCH_WINDOW,
    async (event: { returnValue: { status: boolean; error?: unknown } }) => {
      try {
        await openSearchWindow();
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
