import type { BrowserExtensionConnectedData } from "../../web-app/src/types";
import { getAppConfig } from "./config";
import { pathExistsSync, readJSONSync, writeJSONSync } from "fs-extra";

export const BROWSER_EXTENSIONS_KEY = "SEEKBOT_AI_BROWSER_EXTENSIONS";

function getBrowserExtensionUUID(
  extension: BrowserExtensionConnectedData,
): string {
  let extUUID = extension.uuid;
  if (!extUUID) {
    extUUID = `${extension.os}:${extension.browserName}:${extension.extensionId}:${extension.extensionVersion}`;
    const temp = Buffer.from(extUUID, "base64");
    extUUID = temp.toString("base64");
  }
  return extUUID;
}

export async function getBrowserExtensions(): Promise<
  BrowserExtensionConnectedData[]
> {
  const config = await getAppConfig();
  if (pathExistsSync(config.DESKTOP_APP_EXTENSIONS_PATH)) {
    return readJSONSync(config.DESKTOP_APP_EXTENSIONS_PATH);
  } else {
    return [];
  }
}

export async function setBrowserExtension(
  extension: BrowserExtensionConnectedData,
): Promise<BrowserExtensionConnectedData[]> {
  const extensions = await getBrowserExtensions();
  const uuid = getBrowserExtensionUUID(extension);
  const index = extensions.findIndex(
    (item) => getBrowserExtensionUUID(item) === uuid,
  );
  if (index > -1) {
    extensions[index] = extension;
  } else {
    extensions.push(extension);
  }
  const config = await getAppConfig();
  writeJSONSync(config.DESKTOP_APP_EXTENSIONS_PATH, extensions);
  // remove
  return extensions;
}

export async function removeBrowserExtension(
  extension: BrowserExtensionConnectedData,
): Promise<BrowserExtensionConnectedData[]> {
  const extensions = await getBrowserExtensions();
  const uuid = getBrowserExtensionUUID(extension);
  const index = extensions.findIndex(
    (item) => getBrowserExtensionUUID(item) === uuid,
  );
  if (index > -1) {
    extensions.splice(index, 1);
  }
  const config = await getAppConfig();
  writeJSONSync(config.DESKTOP_APP_EXTENSIONS_PATH, extensions);
  return extensions;
}
