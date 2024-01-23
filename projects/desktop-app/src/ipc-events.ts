export enum IpcEvents {
  CLOSE_SETTINGS = "CLOSE_SETTINGS",
  OPEN_SETTINGS = "OPEN_SETTINGS",
  SYNC_GET_APP_CONFIG = "SYNC_GET_APP_CONFIG",
  SYNC_UPDATE_PREFERENCES_JSON = "SYNC_UPDATE_PREFERENCES_JSON",
}

// message send to main
export const ipcMainEvents = [
  IpcEvents.OPEN_SETTINGS,
  IpcEvents.CLOSE_SETTINGS,
  IpcEvents.SYNC_GET_APP_CONFIG,
  IpcEvents.SYNC_UPDATE_PREFERENCES_JSON,
];

// message send to renderer
export const ipcRendererEvents = [
  IpcEvents.OPEN_SETTINGS,
  IpcEvents.CLOSE_SETTINGS,
  IpcEvents.SYNC_GET_APP_CONFIG,
  IpcEvents.SYNC_UPDATE_PREFERENCES_JSON,
];

export const WEBCONTENTS_READY_FOR_IPC_SIGNAL =
  "WEBCONTENTS_READY_FOR_IPC_SIGNAL";

export type EventResponse = {
  status: boolean;
  payload?: any;
  error?: unknown;
};

export type EventRequest = {
  subject: string;
  payload?: unknown;
};
