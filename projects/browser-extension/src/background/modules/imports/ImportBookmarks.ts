import { type PageData } from "~background/modules/fetchPage"
import { LogFormat } from "~helpers/LogFormat"
import {
  prepareStartImportBookmarks,
  startImportBookmarks,
  stopImportBookmarks,
  updateImportBookmarks
} from "~storage"

import { ImportProcess } from "./ImportProcess"

export class ImportBookmarks extends ImportProcess {
  protected logFormat = new LogFormat("modules/imports/ImportBookmarks")

  constructor({
    concurrent,
    timeout,
    skipGetPageData
  }: {
    concurrent?: number
    timeout?: number
    skipGetPageData?: boolean
  }) {
    super({ concurrent, timeout, skipGetPageData })
    console.debug(
      ...this.logFormat.formatArgs("constructor", { concurrent, timeout })
    )

    console.info(...this.logFormat.formatArgs("constructor finished"))
  }

  async prepare() {
    await prepareStartImportBookmarks({ syncUpBookmarks: true })
  }

  async getImportPages(): Promise<PageData[]> {
    return await startImportBookmarks({
      concurrentBookmarks: this.concurrent
    })
  }

  async updateImportPages(pagesData: PageData[]) {
    await updateImportBookmarks(pagesData)
  }

  async stopImportPages() {
    await stopImportBookmarks()
  }
}
