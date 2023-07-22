import { LogFormat } from "~helpers/LogFormat"
import {
  prepareStartImportHistory,
  startImportHistory,
  stopImportHistory,
  updateImportHistory
} from "~storage"

import { type PageData } from "~background/modules/fetchPage"
import {
  DEFAULT_HISTORY_DAYS_FROM_TODAY,
  DEFAULT_MAX_RESULTS
} from "../history"
import { ImportProcess } from "./ImportProcess"

export class ImportHistory extends ImportProcess {
  static DEFAULT_HISTORY_DAYS_FROM_TODAY = DEFAULT_HISTORY_DAYS_FROM_TODAY
  static DEFAULT_MAX_RESULTS = DEFAULT_MAX_RESULTS
  protected logFormat = new LogFormat("modules/imports/ImportHistory")
  protected startTime = 0
  protected endTime = 0
  protected maxResults = ImportHistory.DEFAULT_MAX_RESULTS
  protected text = ""
  protected syncUpWithHistory = true

  constructor({
    startTime,
    endTime,
    maxResults,
    text,
    syncUpWithHistory,
    concurrent,
    timeout
  }: {
    concurrent?: number
    timeout?: number
    startTime?: number
    endTime?: number
    maxResults?: number
    text?: string
    syncUpWithHistory?: boolean
  }) {
    super({ concurrent, timeout })

    if (!endTime) {
      this.endTime = new Date().getTime()
    }
    if (!startTime) {
      this.startTime =
        this.endTime -
        ImportHistory.DEFAULT_HISTORY_DAYS_FROM_TODAY * 24 * 60 * 60 * 1000
    }
    this.maxResults = maxResults || ImportHistory.DEFAULT_MAX_RESULTS
    this.text = text || ""
    this.syncUpWithHistory = syncUpWithHistory

    console.debug(
      ...this.logFormat.formatArgs(
        "constructor -> startTime, endTime, maxResults, syncUpWithHistory",
        this.startTime,
        this.endTime,
        this.maxResults,
        this.syncUpWithHistory
      )
    )
  }

  async prepare() {
    console.debug(
      ...this.logFormat.formatArgs(
        "prepare -> startTime, endTime, maxResults, syncUpWithHistory",
        this.startTime,
        this.endTime,
        this.maxResults,
        this.syncUpWithHistory
      )
    )
    await prepareStartImportHistory({
      startTime: this.startTime,
      endTime: this.endTime,
      maxResults: this.maxResults,
      text: this.text,
      syncUpWithHistory: this.syncUpWithHistory
    })
  }

  async getImportPages() {
    return await startImportHistory({
      concurrent: this.concurrent
    })
  }

  async updateImportPages(pagesData: PageData[]) {
    await updateImportHistory(pagesData)
  }

  async stopImportPages() {
    await stopImportHistory()
  }
}
