export enum IpcEvents {
  CLOSE_SETTINGS = "CLOSE_SETTINGS",
  OPEN_SETTINGS = "OPEN_SETTINGS",
  SYNC_GET_PREFERENCES_JSON = "SYNC_GET_PREFERENCES_JSON",
  SYNC_UPDATE_PREFERENCES_JSON = "SYNC_UPDATE_PREFERENCES_JSON",
}

// message send to main
export const ipcMainEvents = [
  IpcEvents.OPEN_SETTINGS,
  IpcEvents.CLOSE_SETTINGS,
  IpcEvents.SYNC_GET_PREFERENCES_JSON,
  IpcEvents.SYNC_UPDATE_PREFERENCES_JSON,
];

// message send to retailer editor
// export const ipcRendererEvents = [];

export const WEBCONTENTS_READY_FOR_IPC_SIGNAL =
  "WEBCONTENTS_READY_FOR_IPC_SIGNAL";
