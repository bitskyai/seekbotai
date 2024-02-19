import type { BrowserExtensionConnectedData } from "../../web-app/src/types";

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

export function getBrowserExtensions(): BrowserExtensionConnectedData[] {
  const extensions = localStorage.getItem(BROWSER_EXTENSIONS_KEY);
  try {
    return extensions ? JSON.parse(extensions) : [];
  } catch (err) {
    console.log(err);
    return [];
  }
}

export function setBrowserExtension(
  extension: BrowserExtensionConnectedData,
): BrowserExtensionConnectedData[] {
  const extensions = getBrowserExtensions();
  const uuid = getBrowserExtensionUUID(extension);
  const index = extensions.findIndex(
    (item) => getBrowserExtensionUUID(item) === uuid,
  );
  if (index > -1) {
    extensions[index] = extension;
  } else {
    extensions.push(extension);
  }
  localStorage.setItem(BROWSER_EXTENSIONS_KEY, JSON.stringify(extensions));
  // remove
  return extensions;
}
