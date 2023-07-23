import fetchPage, {
  FetchPageError,
  type FetchPageInstance,
  type FetchPageOptions,
  type PageData
} from "~background/modules/fetchPage"
import { LogFormat } from "~helpers/LogFormat"

export type ImportThreadOptions = FetchPageOptions

export default class ImportThread {
  cancelled = false
  finished = false
  protected fetchPageInstance: FetchPageInstance
  protected options: ImportThreadOptions
  protected logFormat = new LogFormat("modules/imports/ImportProcess")

  constructor(options: ImportThreadOptions) {
    console.debug(...this.logFormat.formatArgs("constructor", { options }))
    this.options = options
    this.fetchPageInstance = fetchPage(options)
    console.info(...this.logFormat.formatArgs("constructor finished"))
  }

  async start() {
    let pageData: PageData
    console.info(...this.logFormat.formatArgs("start"))
    try {
      pageData = await this.fetchPageInstance.run()
      console.debug(
        ...this.logFormat.formatArgs("start -> success", { pageData })
      )
    } catch (err) {
      console.error(...this.logFormat.formatArgs("start -> failed", { err }))
      if (err instanceof FetchPageError) {
        pageData = {
          url: this.options.url,
          error: err.toJSON()
        }
      } else {
        pageData = {
          url: this.options.url,
          error: {
            message: err.message
          }
        }
      }
    }
    this.finished = true
    return pageData
  }

  async stop() {
    this.cancelled = true
    await this.fetchPageInstance.cancel()
    console.info(...this.logFormat.formatArgs("stop"))
    return true
  }
}
