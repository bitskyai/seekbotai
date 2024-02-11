// import logger from "../utils/logger";

import { getOrCreateMainWindow } from "./windows";
import { BrowserView, Menu, MenuItemConstructorOptions, shell } from "electron";
// import { defaultMenu } from "electron-default-menu";
import * as path from "path";

// const isMac = process.platform === "darwin";

/**
 * Is the passed object a constructor for an Electron Menu?
 *
 * @param {(Array<Electron.MenuItemConstructorOptions> | Electron.Menu)} [submenu]
 * @returns {submenu is Array<Electron.MenuItemConstructorOptions>}
 */
function isSubmenu(
  submenu?: Array<MenuItemConstructorOptions> | Menu,
): submenu is Array<MenuItemConstructorOptions> {
  return !!submenu && Array.isArray(submenu);
}

/**
 * Returns additional items for the help menu
 *
 * @returns {Array<Electron.MenuItemConstructorOptions>}
 */
function getHelpItems(): Array<MenuItemConstructorOptions> {
  let preferencesMenu = [] as Array<MenuItemConstructorOptions>;
  if (process.platform !== "darwin") {
    preferencesMenu = getPreferencesItems();
  }
  // remove unsed `separator`
  preferencesMenu.shift();
  return preferencesMenu.concat([
    {
      label: "Open SeekBot Repository...",
      click() {
        shell.openExternal("https://github.com/seekbotai");
      },
    },
    {
      label: "Documents",
      click() {
        shell.openExternal("https://docs.seekbot.ai");
      },
    },
    {
      label: "Open SeekBot Issue Tracker...",
      click() {
        shell.openExternal("https://github.com/seekbotai/seekbot/issues");
      },
    },
  ]);
}

/**
 * Depending on the OS, the `AppConfig` either go into the `Fiddle`
 * menu (macOS) or under `File` (Linux, Windows)
 *
 * @returns {Array<Electron.MenuItemConstructorOptions>}
 */
function getPreferencesItems(): Array<MenuItemConstructorOptions> {
  return [
    {
      type: "separator",
    },
    {
      label: "AppConfig",
      accelerator: "CmdOrCtrl+,",
      click() {
        // console.log('send message: ', IpcEvents.OPEN_SETTINGS);
        // ipcMainManager.send(IpcEvents.OPEN_SETTINGS);
        showSettings();
      },
    },
    {
      type: "separator",
    },
  ];
}

export function showSettings() {
  const win = getOrCreateMainWindow();
  const view = new BrowserView({
    webPreferences: {
      preload: path.join(__dirname, "../render/preload.js"),
      webviewTag: false,
      nodeIntegration: true,
    },
  });

  const currentWinBounds = win.getBounds();

  win.setBrowserView(view);
  view.setBounds({
    x: 0,
    y: 0,
    width: currentWinBounds.width,
    height: currentWinBounds.height,
  });
  view.setAutoResize({
    width: true,
    height: true,
  });
  const modalPath = path.join("./build/settings.html");
  view.webContents.loadFile(modalPath);
  // view.webContents.openDevTools();
}

export function hideSettings() {
  const win = getOrCreateMainWindow();
  win.setBrowserView(null);
}

/**
 * Creates the app's window menu.
 */
export function setupMenu() {
  // const defaultMenu = require("electron-default-menu");
  // const fullmenu = defaultMenu(app, shell) as Array<MenuItemConstructorOptions>;
  // const menus: Array<MenuItemConstructorOptions> = [];
  // fullmenu.forEach((menu: MenuItemConstructorOptions) => {
  //   const { label } = menu;
  //   // Append the "Settings" item
  //   if (
  //     process.platform === "darwin" &&
  //     label === app.name &&
  //     isSubmenu(menu.submenu)
  //   ) {
  //     menu.submenu.splice(2, 0, ...getPreferencesItems());
  //   }
  //   // Append items to "Help"
  //   if (label === "Help" && isSubmenu(menu.submenu)) {
  //     menu.submenu = getHelpItems();
  //   }
  //   menus.push(menu);
  //   // if (label !== "Edit") {
  //   //   menus.push(menu);
  //   // }
  // });
  // // menus.splice(process.platform === "darwin" ? 1 : 0, 0, getFileMenu());
  // // logger.debug("setupMenu->menu: ", JSON.stringify(menus, null, 2));
  // Menu.setApplicationMenu(Menu.buildFromTemplate(menus));
  // ipcMainManager.on(IpcEvents.OPEN_SETTINGS, (_event, args) => {
  //   showSettings();
  // });
}
