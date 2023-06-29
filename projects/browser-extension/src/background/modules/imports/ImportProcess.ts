import { LogFormat } from "~helpers/LogFormat"
import {
  prepareStartImportBookmarks,
  startImportBookmarks,
  stopImportBookmarks,
  updateImportBookmarks
} from "~storage"

import ImportThread from "./ImportThread"

export class ImportProcess {
  static MAX_CONCURRENT = 20
  static DEFAULT_TIMEOUT = 1000 * 60 * 60 * 2
  private concurrent = 10
  private timeout: number = ImportProcess.DEFAULT_TIMEOUT
  private stopped = true
  private inited = false
  private importThreads: ImportThread[] = []
  private jobIndex = 0
  private logFormat = new LogFormat("modules/imports/ImportProcess")

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
    this.init()
    console.info(
      ...this.logFormat.formatArgs("constructor finished")
    )
  }

  async init() {
    console.debug(...this.logFormat.formatArgs("init"))
    this.inited = false
    await prepareStartImportBookmarks({ syncUpBookmarks: true })
    this.inited = true
    console.info(...this.logFormat.formatArgs("init finished"))
  }

  async start() {
    console.info(...this.logFormat.formatArgs("start"))
    if (!this.inited) {
      await this.init()
    }
    this.stopped = false
    let inProgressBookmarks = await startImportBookmarks({
      concurrentBookmarks: this.concurrent
    })
    while (!this.stopped && inProgressBookmarks.length > 0) {
      // reset
      this.importThreads = []

      this.jobIndex++
      console.debug(...this.logFormat.formatArgs(`jobIndex: ${this.jobIndex}, inProgressBookmarks:`, inProgressBookmarks))
      for (let i = 0; i < inProgressBookmarks.length; i++) {
        const bookmark = inProgressBookmarks[i]
        const importThread = new ImportThread({
          url: bookmark.url,
          timeout: this.timeout
        })
        this.importThreads.push(importThread)
      }

      const pagesData = await Promise.all(
        this.importThreads.map((thread) => thread.start())
      )
      console.debug(...this.logFormat.formatArgs(`jobIndex: ${this.jobIndex}, pagesData:`, pagesData))
      
      await updateImportBookmarks(pagesData)
      
      // fetch next
      inProgressBookmarks = await startImportBookmarks({
        concurrentBookmarks: this.concurrent
      })
    }

    this.stopped = true
  }

  async stop() {
    this.stopped = true
    await Promise.all(this.importThreads.map((thread) => thread.stop()))
    await stopImportBookmarks()
    return true
  }
}
