import { LogFormat } from "~helpers/LogFormat"

import { ImportProcess } from "./ImportProcess"

const logFormat = new LogFormat("modules/imports")
export const IMPORT_BOOKMARKS_JOB_TIMEOUT = 1000 * 60 * 60 * 2 // 2 hours
export const PARALLEL_IMPORT_BOOKMARKS_COUNT = 5

const _importProcess = new ImportProcess({})

export const startImportBookmarks = async () => {
  console.info(...logFormat.formatArgs("startImportBookmarks"))
  _importProcess.start()
}

export const stopImportBookmarks = async () => {
  console.info(...logFormat.formatArgs("stopImportBookmarks"))
  _importProcess.stop()
}
