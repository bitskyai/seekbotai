import { type IgnoreUrl } from "~graphql/generated"
import { LogFormat } from "~helpers/LogFormat"
import { normalizeUrlWithoutError } from "~helpers/util"
import { addIgnoreURLHistory, getIgnoreURLs } from "~storage"

const logFormat = new LogFormat("modules/ignoreURLs")
export async function whetherIgnore(url: string) {
  try {
    const ignoreURLs = await getIgnoreURLs()
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
    console.error(...logFormat.formatArgs("whetherIgnore -> error", { e }))
    // if has error, then not ignore
    return false
  }
}

export const init = async () => {
  console.info(...logFormat.formatArgs("init"))
}
