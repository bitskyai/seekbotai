// import { setupUpdates } from "./update";
import logger from "../helpers/logger";
import { setupAboutPanel } from "../helpers/set-about-panel";
import webApp from "../helpers/web-app";
import { setupDevTools } from "./devtools";
import { setUpEventListeners } from "./events";
import { onFirstRunMaybe } from "./first-run";
import { setupMenu } from "./menu";
import { listenForProtocolHandler, setupProtocolHandler } from "./protocol";
import { shouldQuit } from "./squirrel";
import { getOrCreateMainWindow } from "./windows";
import { app } from "electron";

/**
 * Handle the app's "ready" event. This is essentially
 * the method that takes care of booting the application.
 */
export async function onReady() {
  try {
    logger.info("onReady()");

    await onFirstRunMaybe();
    // if (!isDevMode()) process.env.NODE_ENV = "production";
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
