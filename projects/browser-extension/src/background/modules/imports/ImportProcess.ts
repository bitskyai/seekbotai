import { type PageData } from "~background/modules/fetchPage"
import { LogFormat } from "~helpers/LogFormat"
import { releaseMemory } from "~helpers/util"

import ImportThread from "./ImportThread"

export class ImportProcess {
  static MAX_CONCURRENT = 10
  static DEFAULT_TIMEOUT = 0.5 * 60 * 1000 // 30 minute
  private skipGetPageData = false // skip to get page data, this only import metadata: url, name, tags
  private stopped = true
  private initialized = false
  protected importThreads: ImportThread[] = []
  protected jobIndex = 0
  protected logFormat = new LogFormat("modules/imports/ImportProcess")
  protected concurrent = 10
  protected timeout: number = ImportProcess.DEFAULT_TIMEOUT

  constructor({
    concurrent,
    timeout
  }: {
    concurrent?: number
    timeout?: number
  }) {
    console.debug(
      ...this.logFormat.formatArgs("constructor", { concurrent, timeout })
    )

    if (concurrent) {
      this.concurrent =
        concurrent <= ImportProcess.MAX_CONCURRENT
          ? concurrent
          : ImportProcess.MAX_CONCURRENT
    }
    if (timeout) {
      this.timeout = timeout
    }
    // this.init()
    console.debug(...this.logFormat.formatArgs("constructor finished"))
  }

  // by default ImportProcess will import bookmarks
  // if you want to extend it to import other types of data, you need override this method
  // this method should prepare local storage to change importing pages status to ready, and put to in progress to remaining pages
  async prepare() {
    console.error("prepare is not implemented")
    throw new Error("prepare is not implemented")
  }

  // by default ImportProcess will import bookmarks
  // if you want to extend it to import other types of data, you need override this method
  // this method should return an array of PageData that need to fetch content, if url is empty then it will skip this page
  async getImportPages(): Promise<PageData[]> {
    console.error("getImportPages is not implemented")
    throw new Error("getImportPages is not implemented")
  }

  // by default ImportProcess will import bookmarks
  // if you want to extend it to import other types of data, you need override this method
  // this method should update local storage with the pagesData(if it can get html based on url, then it will have html, otherwise it will have error or warning)
  async updateImportPages(pagesData: PageData[]) {
    console.error("updateImportPages is not implemented")
    throw new Error("updateImportPages is not implemented")
  }

  // by default ImportProcess will import bookmarks
  // if you want to extend it to import other types of data, you need override this method
  // this method should update local storage to change importing pages status to ready, and put to remaining pages
  async stopImportPages() {
    console.error("stopImportPages is not implemented")
    throw new Error("stopImportPages is not implemented")
  }

  async init() {
    console.debug(...this.logFormat.formatArgs("init"))
    this.initialized = false
    await this.prepare()
    this.initialized = true
    console.debug(...this.logFormat.formatArgs("init finished"))
  }

  async start() {
    console.debug(...this.logFormat.formatArgs("start"))
    await this.init()
    this.stopped = false
    let inProgressPages = await this.getImportPages()
    while (!this.stopped && inProgressPages.length > 0) {
      releaseMemory(this.importThreads)
      // reset
      this.importThreads = []

      this.jobIndex++
      console.debug(
        ...this.logFormat.formatArgs(
          `jobIndex: ${this.jobIndex}, inProgressPages:`,
          inProgressPages
        )
      )
      if (!this.skipGetPageData) {
        for (let i = 0; i < inProgressPages.length; i++) {
          const page = inProgressPages[i]
          if (!page.url) continue

          const importThread = new ImportThread({
            url: page.url,
            timeout: this.timeout
          })
          this.importThreads.push(importThread)
        }

        const pagesData = await Promise.all(
          this.importThreads.map((thread) => thread.start())
        )
        console.debug(
          ...this.logFormat.formatArgs(
            `jobIndex: ${this.jobIndex}, pagesData:`,
            pagesData
          )
        )

        await this.updateImportPages(pagesData)
      } else {
        await this.updateImportPages(inProgressPages)
      }
      // fetch next
      inProgressPages = await this.getImportPages()
    }

    // await updateImportBookmarksSummary({ status: ImportStatus.Ready })
    this.stopped = true
  }

  async stop() {
    this.stopped = true
    await Promise.all(
      this.importThreads.map((thread) => {
        thread.stop()
        thread = undefined // release memory
      })
    )
    await this.stopImportPages()
    releaseMemory(this.importThreads)
    return true
  }
}
