import { app } from "electron";
import { isDevMode } from "../helpers/devmode";
import { setupAboutPanel } from "../helpers/set-about-panel";
import { setupDevTools } from "./devtools";
import { setUpEventListeners } from "./events";
import { onFirstRunMaybe } from "./first-run";
import { setupMenu } from "./menu";
import { listenForProtocolHandler, setupProtocolHandler } from "./protocol";
import { shouldQuit } from "./squirrel";
// import { setupUpdates } from "./update";
import logger from "../helpers/logger";
import supplier from "../helpers/supplier";
import { getOrCreateMainWindow } from "./windows";

/**
 * Handle the app's "ready" event. This is essentially
 * the method that takes care of booting the application.
 */
export async function onReady() {
  try {
    logger.info("onReady()");

    // intial global variables
    // global.browserWindows = {
    //   retailerEditor: null,
    //   main: null,
    // };

    await onFirstRunMaybe();
    if (!isDevMode()) process.env.NODE_ENV = "production";
    try {
      await supplier.startSupplier();
      process.env.BITSKY_BASE_URL = `http://localhost:${supplier.supplierPort}`;
      // setup headless producer
    } catch (err) {
      logger.error("start supplier file. error: ", err);
    }

    // Temp comment to fix https://github.com/bitskyai/bitsky-builder/issues/41
    // if run this, then cannot load browser, seems it was caused by single thread
    // try {
    //   RetailerManager.runRetailer();
    // } catch (err) {
    //   logger.error("start retailer fail. error: ", err);
    // }
    // setup menus for main processes
    setupMenu();
    setupAboutPanel();
    setupProtocolHandler();
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

/**
 * Handle the "before-quit" event
 *
 * @export
 */
export function onBeforeQuit() {
  (global as any).isQuitting = true;
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

  // Set the app's name
  app.name = "BitSky";

  // Ensure that there's only ever one Fiddle running
  listenForProtocolHandler();

  // Launch
  app.on("ready", onReady);
  app.on("before-quit", onBeforeQuit);
  // app.on("window-all-closed", onWindowsAllClosed);
  app.on("activate", getOrCreateMainWindow);
}

main();
