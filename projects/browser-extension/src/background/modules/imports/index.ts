import { LogFormat } from "~helpers/LogFormat"
import { cleanAllBookmarks, cleanAllHistory } from "~storage"

import { ImportBookmarks } from "./ImportBookmarks"
import { ImportHistory } from "./ImportHistory"

const logFormat = new LogFormat("modules/imports")
export const IMPORT_BOOKMARKS_JOB_TIMEOUT = 1000 * 60 * 60 * 2 // 2 hours
export const PARALLEL_IMPORT_BOOKMARKS_COUNT = 5

const _importBookmarks = new ImportBookmarks({})
const _importHistory = new ImportHistory({ syncUpWithHistory: true })

export const startImportBookmarks = async () => {
  console.info(...logFormat.formatArgs("startImportBookmarks"))
  _importBookmarks.start()
}

export const stopImportBookmarks = async () => {
  console.info(...logFormat.formatArgs("stopImportBookmarks"))
  _importBookmarks.stop()
}

export const cleanImportBookmarks = async () => {
  await cleanAllBookmarks()
}

export const startImportHistory = async () => {
  console.info(...logFormat.formatArgs("startImportHistory"))
  _importHistory.start()
}

export const stopImportHistory = async () => {
  console.info(...logFormat.formatArgs("stopImportHistory"))
  _importHistory.stop()
}

export const cleanImportHistory = async () => {
  await cleanAllHistory()
}
