import { Storage } from "@plasmohq/storage"

import { LogFormat } from "~helpers/LogFormat"
import { StorageKeys, cleanAllBookmarks, cleanAllHistory } from "~storage"
import { ServiceStatus } from "~types"

import { ImportBookmarks } from "./ImportBookmarks"
import { ImportHistory } from "./ImportHistory"

export { default as ImportThread } from "./ImportThread"

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

export const init = async () => {
  console.info(...logFormat.formatArgs("init"))
  const storage = new Storage()
  const storageWatchList = {
    [StorageKeys.ServiceHealthStatus]: async () => {
      const serviceHealthStatus = await storage.get(
        StorageKeys.ServiceHealthStatus
      )
      if (serviceHealthStatus === ServiceStatus.Failed) {
        console.warn(
          ...logFormat.formatArgs("service is unhealthy, stop import")
        )
        await stopImportBookmarks()
        await stopImportHistory()
      }
    }
  }
  storage.watch(storageWatchList)
}
