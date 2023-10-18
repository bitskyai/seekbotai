import { getIgnoreURLs } from "~/background/modules/apis"
import { type IgnoreUrl } from "~graphql/generated"
import { LogFormat } from "~helpers/LogFormat"
import { normalizeUrlWithoutError } from "~helpers/util"
import {
  addIgnoreURLHistory,
  getIgnoreURLs as getIgnoreURLsFromStorage
} from "~storage"

const logFormat = new LogFormat("modules/ignoreURLs")
let _syncUpIgnoreIntervalHandler
export async function whetherIgnore(url: string) {
  try {
    const ignoreURLs = await getIgnoreURLsFromStorage()
    url = normalizeUrlWithoutError(url)
    console.debug(
      ...logFormat.formatArgs("whetherIgnore -> ignoreURLs", { ignoreURLs })
    )
    const matchedIgnoreURLs: IgnoreUrl[] = []
    ignoreURLs.map((ignoreURL) => {
      let testResult = false
      if (ignoreURL.regularExpression) {
        const reg = new RegExp(ignoreURL.pattern)
        testResult = reg.test(url)
      } else {
        testResult = url.includes(ignoreURL.pattern)
      }
      if (testResult) {
        matchedIgnoreURLs.push(ignoreURL)
      }
    })
    const ignore = !!matchedIgnoreURLs.length
    console.debug(
      ...logFormat.formatArgs("whetherIgnore -> Result: ", {
        matchedIgnoreURLs,
        url,
        ignore
      })
    )

    for (let i = 0; i < matchedIgnoreURLs.length; i++) {
      const matchedIgnoreURL = matchedIgnoreURLs[i]
      await addIgnoreURLHistory({
        ...matchedIgnoreURL,
        url,
        ignoreAt: Date.now()
      })
    }

    return ignore
  } catch (e) {
    console.warn(...logFormat.formatArgs("whetherIgnore -> error", { e }))
    // if has error, then not ignore
    return false
  }
}

export async function syncUpIgnoreURLs() {
  try {
    await getIgnoreURLs()
  } catch (e) {
    console.warn(...logFormat.formatArgs("syncUpIgnoreURLs -> error", { e }))
  }
}

export const init = async () => {
  console.info(...logFormat.formatArgs("init"))
  clearInterval(_syncUpIgnoreIntervalHandler)
  _syncUpIgnoreIntervalHandler = setInterval(syncUpIgnoreURLs, 1000 * 60)
}
