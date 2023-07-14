import { LogFormat } from "~helpers/LogFormat"

import {
  DEFAULT_HISTORY_DAYS_FROM_TODAY,
  DEFAULT_MAX_RESULTS,
  getDateBefore
} from "../history"
import { ImportProcess } from "./ImportProcess"

export class ImportHistory extends ImportProcess {
  static DEFAULT_HISTORY_DAYS_FROM_TODAY = DEFAULT_HISTORY_DAYS_FROM_TODAY
  static DEFAULT_MAX_RESULTS = DEFAULT_MAX_RESULTS
  protected logFormat = new LogFormat("modules/imports/ImportHistory")

  historyDaysFromToday = ImportHistory.DEFAULT_HISTORY_DAYS_FROM_TODAY

  constructor({
    concurrent,
    timeout
  }: {
    concurrent?: number
    timeout?: number
  }) {
    super({ concurrent, timeout })
  }

  async prepare() {}

  async getImportPages() {}

  async updateImportPages(pagesData: PageData[]) {}

  async stopImportPages() {}
}
