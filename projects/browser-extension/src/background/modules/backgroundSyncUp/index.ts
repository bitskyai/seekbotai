import _ from "lodash"

import { Storage } from "@plasmohq/storage"

import { createBookmarks } from "~background/modules/apis/createBookmarks"
import { LogFormat } from "~helpers/LogFormat"
import {
  BackgroundSyncUpStatus,
  StorageKeys,
  getBackgroundSyncUpAPICreateOrUpdatePages,
  getServiceHealthStatus,
  initBackgroundSyncUp,
  updateBackgroundSyncUpAPICreateOrUpdatePages
} from "~storage"
import { ServiceStatus } from "~types"

const logFormat = new LogFormat("modules/backgroundSyncUp")
let _intervalCheckBackgroundSyncUpList = null
let _sending_request = false

const BACKGROUND_SYNC_UP_INTERVAL_VALUE = 1000 * 5 // 10 S

const sendCreateBookmarksRequest = async () => {
  console.debug(...logFormat.formatArgs("sendCreateBookmarksRequest"))
  const syncUpItem = await getBackgroundSyncUpAPICreateOrUpdatePages()
  if (syncUpItem) {
    const { data } = await createBookmarks(syncUpItem.data, true)
    if (data) {
      await updateBackgroundSyncUpAPICreateOrUpdatePages({
        ...syncUpItem,
        status: BackgroundSyncUpStatus.Success
      })
    } else {
      await updateBackgroundSyncUpAPICreateOrUpdatePages({
        ...syncUpItem,
        status: BackgroundSyncUpStatus.Failed
      })
    }
  }

  return true
}

const _checkBackgroundSyncUpList = async () => {
  const serviceHealthStatus = await getServiceHealthStatus()
  if (serviceHealthStatus === ServiceStatus.Success) {
    console.info(...logFormat.formatArgs("service is healthy"))
    clearInterval(_intervalCheckBackgroundSyncUpList)
    _intervalCheckBackgroundSyncUpList = setInterval(async () => {
      if (_sending_request) {
        return true
      }
      _sending_request = true
      try {
        const promises = [sendCreateBookmarksRequest()]
        await Promise.all(promises)
      } catch (err) {
        console.error(
          ...logFormat.formatArgs("send request has error. Error: ", err)
        )
      }
      _sending_request = false
    }, BACKGROUND_SYNC_UP_INTERVAL_VALUE)
  } else {
    console.warn(...logFormat.formatArgs("service is not healthy"))
    // cancel interval check
    clearInterval(_intervalCheckBackgroundSyncUpList)
  }
}

export const init = async () => {
  // init background sync up to move in progress items to remain list
  await initBackgroundSyncUp()
  // init interval check background sync up list
  _checkBackgroundSyncUpList()
  // watch service health status
  const storage = new Storage()
  const storageWatchList = {
    [StorageKeys.ServiceHealthStatus]: _checkBackgroundSyncUpList
  }
  storage.watch(storageWatchList)
}
