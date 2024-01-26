// import { setupUpdates } from "./update";

import { setupDevTools } from "./devtools";
import { setUpEventListeners } from "./events";
import { onFirstRunMaybe } from "./first-run";
import { isDevMode } from "./helpers/devmode";
import { BrowserWindow, app } from "electron";
import { release } from "node:os";
import "./helpers/loadEnv";
import logger from "./helpers/logger";
import { setupAboutPanel } from "./helpers/set-about-panel";
import webApp from "./helpers/web-app";
import { setupMenu } from "./menu";
import { listenForProtocolHandler, setupProtocolHandler } from "./protocol";
import { shouldQuit } from "./squirrel";
import { setupTray } from "./tray";
import { getOrCreateMainWindow } from "./windows";

/**
 * Handle the app's "ready" event. This is essentially
 * the method that takes care of booting the application.
 */
export async function onReady() {
  try {
    logger.info("onReady()");
    await onFirstRunMaybe();
    if (!isDevMode()) process.env.NODE_ENV = "production";
    getOrCreateMainWindow();
    try {
      await webApp.start();
    } catch (err) {
      console.log(`start web app error: `, err);
      logger.error("start webApp file. error: ", err);
    }

    // setup menus for main processes
    setupMenu();
    setupAboutPanel();
    setupProtocolHandler();
    setupTray();
    // Auto update from github release
    // since currently don't have apple developer account, and auto update require developer account
    // so disable it for now
    // setupUpdates();
    setupDevTools();
    setUpEventListeners();
  } catch (err) {
    logger.error("Error in onReady, error: ", err);
  }
}

export function onWindowsAllClosed(event: Electron.Event) {
  // Hide the app from the dock and tray if it's not supported
  app.dock.hide();
  // Prevent the app from quitting when all windows are closed
  event.preventDefault();
}

/**
 * Handle the "before-quit" event
 *
 * @export
 */
export function onBeforeQuit() {
  (global as any).isQuitting = true;
  webApp?.stop();
}

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

export function main() {
  logger.info("main");
  // Handle creating/removing shortcuts on Windows when
  // installing/uninstalling.
  if (shouldQuit()) {
    app.quit();
    return;
  }

  // Disable GPU Acceleration for Windows 7
  if (release().startsWith("6.1")) app.disableHardwareAcceleration();

  if (!app.requestSingleInstanceLock()) {
    app.quit();
    process.exit(0);
  }

  // Set the app's name
  app.name = "BitSky";

  listenForProtocolHandler();

  // Launch
  app.whenReady().then(onReady);
  app.on("before-quit", onBeforeQuit);
  app.on("window-all-closed", onWindowsAllClosed);
  app.on("activate", () => {
    const allWindows = BrowserWindow.getAllWindows();
    if (allWindows.length) {
      allWindows[0].focus();
    } else {
      getOrCreateMainWindow();
    }
  });
}

main();
