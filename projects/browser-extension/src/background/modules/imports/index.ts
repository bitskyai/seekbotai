import { Storage } from "@plasmohq/storage"

import { LogFormat } from "~helpers/LogFormat"
import {
  StorageKeys,
  cleanAllBookmarks,
  cleanAllHistory,
  stopImportBookmarks as stopImportBookmarksStorage,
  stopImportHistory as stopImportHistoryStorage
} from "~storage"
import { ServiceStatus } from "~types"

import { ImportBookmarks } from "./ImportBookmarks"
import { ImportHistory } from "./ImportHistory"

export { default as ImportThread } from "./ImportThread"

const logFormat = new LogFormat("modules/imports")

let _importBookmarks
let _importHistory

export const startImportBookmarks = async () => {
  console.info(...logFormat.formatArgs("startImportBookmarks"))
  _importBookmarks = new ImportBookmarks({})
  _importBookmarks?.start()
}

export const stopImportBookmarks = async () => {
  console.info(...logFormat.formatArgs("stopImportBookmarks"))
  _importBookmarks?.stop()
  _importBookmarks = undefined
  await stopImportBookmarksStorage()
}

export const cleanImportBookmarks = async () => {
  await cleanAllBookmarks()
  _importBookmarks = undefined
}

export const startImportHistory = async () => {
  console.info(...logFormat.formatArgs("startImportHistory"))
  _importHistory = new ImportHistory({ syncUpWithHistory: true })
  _importHistory?.start()
}

export const stopImportHistory = async () => {
  console.info(...logFormat.formatArgs("stopImportHistory"))
  _importHistory?.stop()
  _importHistory = undefined
  await stopImportHistoryStorage()
}

export const cleanImportHistory = async () => {
  await cleanAllHistory()
  _importHistory = undefined
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
  await stopImportBookmarks()
  await stopImportHistory()
  storage.watch(storageWatchList)
}
