import type { PageCreateOrUpdateShape } from "./entities/page/types";
import { BrowserExtensionConnectedData } from "./types";
import EventEmitter from "events";

enum EVENT_SUBJECTS {
  BROWSER_EXTENSION_CONNECTED = "BROWSER_EXTENSION_CONNECTED",
  IMPORT_BOOKMARKS = "IMPORT_BOOKMARKS",
  SEARCH = "SEARCH",
}

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

export function emitImportBookmarks(pages: PageCreateOrUpdateShape[]) {
  eventEmitter.emit(EVENT_SUBJECTS.IMPORT_BOOKMARKS, pages);
}

export function listenImportBookmarks(
  callback: (pages: PageCreateOrUpdateShape[]) => void,
) {
  eventEmitter.on(EVENT_SUBJECTS.IMPORT_BOOKMARKS, callback);
}

export function emitSearch(query: object) {
  eventEmitter.emit(EVENT_SUBJECTS.SEARCH, query);
}

export function listenSearch(callback: (query: object) => void) {
  eventEmitter.on(EVENT_SUBJECTS.SEARCH, callback);
}

const getEventEmitter = () => eventEmitter;

export default getEventEmitter;
