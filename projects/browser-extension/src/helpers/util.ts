import _ from "lodash"
import normalizeUrl from "normalize-url"

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
  const userAgent = navigator.userAgent.toLowerCase()

  if (userAgent.includes("edge") || userAgent.includes("edg")) return "Edge"
  if (userAgent.includes("chrome")) return "Chrome"
  if (userAgent.includes("firefox")) return "Firefox"
  if (userAgent.includes("safari")) return "Safari"
  if (userAgent.includes("opera") || userAgent.includes("opr")) return "Opera"
  if (userAgent.includes("msie") || userAgent.includes("trident/"))
    return "Internet Explorer"

  return "Unknown"
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
  const browserInfo = {
    name: getBrowserName(),
    version: getBrowserVersion(),
    userAgent: navigator.userAgent
  }
  return {
    "x-seekbot-extension-id": extensionInfo.id,
    "x-seekbot-extension-version": extensionInfo.version,
    "x-seekbot-extension-options-url": extensionInfo.optionsUrl,
    "x-seekbot-browser-name": browserInfo.name,
    "x-seekbot-browser-version": browserInfo.version,
    "x-seekbot-browser-user-agent": browserInfo.userAgent
  }
}
