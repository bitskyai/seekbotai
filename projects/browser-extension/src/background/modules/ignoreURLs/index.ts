import { type IgnoreUrl } from "~graphql/generated"
import { LogFormat } from "~helpers/LogFormat"
import { addIgnoreURLHistory, getIgnoreURLs } from "~storage"

const logFormat = new LogFormat("modules/ignoreURLs")
export async function whetherIgnore(url: string) {
  try {
    const ignoreURLs = await getIgnoreURLs()
    console.debug(
      ...logFormat.formatArgs("whetherIgnore -> ignoreURLs", { ignoreURLs })
    )
    const matchedIgnoreURLs: IgnoreUrl[] = []
    const ignore = ignoreURLs.map((ignoreURL) => {
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
    console.debug(
      ...logFormat.formatArgs("whetherIgnore -> ignore", { ignore, url })
    )
    if (ignore) {
      matchedIgnoreURLs.map(async (ignoreURL) => {
        // add ignore url history
        await addIgnoreURLHistory({ ...ignoreURL, url, ignoreAt: Date.now() })
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
