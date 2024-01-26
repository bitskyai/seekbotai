import { isDevMode } from "./helpers/devmode";
import {
  BrowserWindow,
  ContextMenuParams,
  Menu,
  MenuItemConstructorOptions,
} from "electron";

/**
 * Possibly returns the `Inspect Element` item.
 *
 * @param {BrowserWindow} browserWindow
 * @param {ContextMenuParams} { x, y }
 * @returns {Array<MenuItemConstructorOptions>}
 */
export function getInspectItems(
  browserWindow: BrowserWindow,
  { x, y }: ContextMenuParams,
): Array<MenuItemConstructorOptions> {
  if (!isDevMode()) return [];

  return [
    {
      id: "inspect",
      label: "Inspect Element",
      click: () => {
        browserWindow.webContents.inspectElement(x, y);

        try {
          if (browserWindow.webContents.isDevToolsOpened()) {
            browserWindow.webContents.devToolsWebContents?.focus();
          }
        } catch (error) {
          console.warn(`Tried to focus dev tools, but failed`, { error });
        }
      },
    },
  ];
}

/**
 * Creates a context menu for a given BrowserWindow
 *
 * @param {BrowserWindow} browserWindow
 */
export function createContextMenu(browserWindow: BrowserWindow) {
  browserWindow.webContents.on("context-menu", (_event, props) => {
    const { editFlags } = props;

    const template: Array<MenuItemConstructorOptions> = [
      {
        id: "cut",
        label: "Cut",
        role: "cut",
        enabled: editFlags.canCut,
      },
      {
        id: "copy",
        label: "Copy",
        role: "copy",
        enabled: editFlags.canCopy,
      },
      {
        id: "paste",
        label: "Paste",
        role: "paste",
        enabled: editFlags.canPaste,
      },
      {
        type: "separator",
      },
      ...getInspectItems(browserWindow, props),
    ];

    const menu = Menu.buildFromTemplate(template);
    menu.popup({});
  });
}
