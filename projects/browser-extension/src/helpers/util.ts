import _ from "lodash"
import normalizeUrl from "normalize-url"
import { runtime } from "webextension-polyfill"

import { getExtensionUUID } from "~storage"

export const releaseMemory = (target: any) => {
  if (_.isArray(target)) {
    for (let i = 0; i < target.length; i++) {
      releaseMemory(target.pop())
    }
  }

  target = undefined
  return true
}

export const normalizeUrlWithoutError = (url: string) => {
  try {
    return normalizeUrl(url)
  } catch (err) {
    return url
  }
}

function getBrowserName() {
  // code from https://developer.mozilla.org/en-US/docs/Web/API/Window/navigator
  // The order matters here, and this may report false positives for unlisted browsers.
  const userAgent = navigator.userAgent
  if (userAgent.includes("Firefox")) {
    // "Mozilla/5.0 (X11; Linux i686; rv:104.0) Gecko/20100101 Firefox/104.0"
    return "Mozilla Firefox"
  } else if (userAgent.includes("SamsungBrowser")) {
    // "Mozilla/5.0 (Linux; Android 9; SAMSUNG SM-G955F Build/PPR1.180610.011) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/9.4 Chrome/67.0.3396.87 Mobile Safari/537.36"
    return "Samsung Internet"
  } else if (userAgent.includes("Opera") || userAgent.includes("OPR")) {
    // "Mozilla/5.0 (Macintosh; Intel Mac OS X 12_5_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36 OPR/90.0.4480.54"
    return "Opera"
  } else if (userAgent.includes("Edge")) {
    // "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 Edge/16.16299"
    return "Microsoft Edge (Legacy)"
  } else if (userAgent.includes("Edg")) {
    // "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36 Edg/104.0.1293.70"
    return "Microsoft Edge (Chromium)"
  } else if (userAgent.includes("Chrome")) {
    // "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36"
    return "Google Chrome or Chromium"
  } else if (userAgent.includes("Safari")) {
    // "Mozilla/5.0 (iPhone; CPU iPhone OS 15_6_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.6 Mobile/15E148 Safari/604.1"
    return "Apple Safari"
  } else {
    return "Unknown"
  }
}

function getBrowserVersion() {
  const userAgent = navigator.userAgent
  const match = userAgent.match(
    /(?:Chrome|Firefox|Safari|Edge|Opera|MSIE|rv:)([\d.]+)/
  )
  return match ? match[1] : "Unknown"
}

export const getExtensionInfo = async () => {
  const extensionInfo = await chrome.management.getSelf()
  return extensionInfo
}

export const getSeekBotHeaders = async () => {
  const extensionInfo = await getExtensionInfo()
  const extensionUUID = await getExtensionUUID()
  const osInfo = await runtime?.getPlatformInfo()
  console.info(navigator.appName, navigator.appVersion)
  return {
    "x-seekbot-extension-uuid": extensionUUID,
    "x-seekbot-extension-id": extensionInfo.id,
    "x-seekbot-extension-version": extensionInfo.version,
    "x-seekbot-extension-options-url": extensionInfo.optionsUrl,
    "x-seekbot-browser-name": getBrowserName(),
    "x-seekbot-browser-version": getBrowserVersion(),
    "x-seekbot-browser-user-agent": navigator.userAgent,
    "x-seekbot-os": osInfo?.os,
    "x-seekbot-os-arch": osInfo?.arch
  }
}
