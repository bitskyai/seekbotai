import EventEmitter from "events";

enum EVENT_SUBJECTS {
  BROWSER_EXTENSION_CONNECTED = "BROWSER_EXTENSION_CONNECTED",
}

export type BrowserExtensionConnectedData = {
  extensionId: string;
  optionsUrl: string;
  browserName: string;
};

const eventEmitter = new EventEmitter();

export function emitBrowserExtensionConnected(
  data: BrowserExtensionConnectedData,
) {
  eventEmitter.emit(EVENT_SUBJECTS.BROWSER_EXTENSION_CONNECTED, data);
}

export function listenBrowserExtensionConnected(
  callback: (data: BrowserExtensionConnectedData) => void,
) {
  eventEmitter.on(EVENT_SUBJECTS.BROWSER_EXTENSION_CONNECTED, callback);
}

const getEventEmitter = () => eventEmitter;

export default getEventEmitter;
