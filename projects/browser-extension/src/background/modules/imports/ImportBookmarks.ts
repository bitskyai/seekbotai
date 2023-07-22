import { LogFormat } from "~helpers/LogFormat"
import {
  prepareStartImportBookmarks,
  startImportBookmarks,
  stopImportBookmarks,
  updateImportBookmarks
} from "~storage"

import { type PageData } from "~background/modules/fetchPage"
import { ImportProcess } from "./ImportProcess"

export class ImportBookmarks extends ImportProcess {
  protected logFormat = new LogFormat("modules/imports/ImportBookmarks")

  constructor({
    concurrent,
    timeout
  }: {
    concurrent?: number
    timeout?: number
  }) {
    super({ concurrent, timeout })
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
