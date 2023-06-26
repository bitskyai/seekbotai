import fetchPage, {
  FetchPageError,
  type FetchPageInstance,
  type FetchPageOptions,
  type PageData
} from "../fetchPage"

export interface ImportThreadOptions extends FetchPageOptions {}

export default class ImportThread {
  cancelled = false
  finished = false
  protected fetchPageInstance: FetchPageInstance
  protected options: ImportThreadOptions

  constructor(options: ImportThreadOptions) {
    this.options = options
    this.fetchPageInstance = fetchPage(options)
  }

  async start() {
    let pageData: PageData
    try {
      pageData = await this.fetchPageInstance.run()
    } catch (err) {
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
    return true
  }
}
