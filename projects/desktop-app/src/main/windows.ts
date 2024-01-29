import { createContextMenu } from "./context-menu";
import { getAppConfig } from "./helpers/config";
import { BrowserWindow, shell } from "electron";
import { resolve } from "path";

interface browserWindowHash {
  [key: string]: BrowserWindow | null;
}

// Keep a global reference of the window objects, if we don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
const browserWindows: browserWindowHash = {};

/**
 * Gets default options for the main window
 *
 * @returns {Electron.BrowserWindowConstructorOptions}
 */
export function getMainWindowOptions(): Electron.BrowserWindowConstructorOptions {
  const preload = resolve(__dirname, "../preload/index.js");
  return {
    width: 1200,
    height: 800,
    minHeight: 600,
    minWidth: 600,
    // titleBarStyle: process.platform === 'darwin' ? 'hidden' : undefined,
    acceptFirstMouse: true,
    backgroundColor: "#1d2427",
    webPreferences: {
      devTools: true,
      preload: preload,
      webviewTag: false,
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      nodeIntegration: true,
      contextIsolation: false,
    },
  };
}

/**
 * Creates a new main window.
 *
 * @export
 * @returns {Electron.BrowserWindow}
 */
export function createMainWindow(): Electron.BrowserWindow {
  const browserWindow = new BrowserWindow(getMainWindowOptions());

  browserWindows.main = browserWindow;
  // used for development
  const url = process.env.DESKTOP_VITE_DEV_SERVER_URL;
  const indexHtml = resolve(__dirname, "../ui/index.html");

  if (url) {
    browserWindows.main.loadURL(url);
  } else {
    browserWindows.main.loadFile(indexHtml);
  }

  // Test actively push message to the Electron-Renderer
  browserWindow.webContents.on("did-finish-load", () => {
    browserWindow?.webContents.send(
      "main-process-message",
      new Date().toLocaleString(),
    );
  });

  browserWindow.webContents.once("dom-ready", () => {
    browserWindow.show();

    if (browserWindow) {
      createContextMenu(browserWindow);
    }
  });

  browserWindow.on("closed", () => {
    browserWindows.main = null;
  });

  // Make all links open with the browser, not with the application
  browserWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });

  return browserWindow;
}

/**
 * Gets or creates the main window, returning it in both cases.
 *
 * @returns {Electron.BrowserWindow}
 */
export function getOrCreateMainWindow(): Electron.BrowserWindow {
  // return (
  //   BrowserWindow.getFocusedWindow() || browserWindows[0] || createMainWindow()
  // );
  return browserWindows.main || createMainWindow();
}

export function getMainWindow() {
  return browserWindows.main;
}

export function getBrowserWindow(key: string) {
  return browserWindows[key];
}

export async function openSearchWindow() {
  if (browserWindows.search) {
    browserWindows.search.focus();
    return;
  }
  const appConfig = await getAppConfig();
  const url = `http://${appConfig.WEB_APP_HOST_NAME}:${appConfig.WEB_APP_PORT}`;
  const searchWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    modal: true,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  // Load your popup HTML file
  searchWindow.loadURL(url);

  searchWindow.on("closed", () => {
    browserWindows.search = null;
    delete browserWindows.search;
  });

  // Make all links open with the browser, not with the application
  searchWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });

  browserWindows.search = searchWindow;
}

export function setBrowserWindow(key: string, value: Electron.BrowserWindow) {
  browserWindows[key] = value;
}
