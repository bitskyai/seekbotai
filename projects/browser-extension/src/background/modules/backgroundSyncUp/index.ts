import { log } from "console"
import _ from "lodash"

import { Storage } from "@plasmohq/storage"

import { createOrUpdatePages } from "~background/modules/apis/createOrUpdatePages"
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

const BACKGROUND_SYNC_UP_INTERVAL_VALUE = 1000 * 1 // 10 S

const sendCreateBookmarksRequest = async () => {
  const syncUpItem = await getBackgroundSyncUpAPICreateOrUpdatePages()
  console.debug(
    ...logFormat.formatArgs("sendCreateBookmarksRequest", syncUpItem)
  )
  if (syncUpItem) {
    try {
      const result = await createOrUpdatePages(syncUpItem.data, true)
      if (!result) {
        // when result is null, it means that the request is not sent to server
        await updateBackgroundSyncUpAPICreateOrUpdatePages({
          ...syncUpItem,
          status: BackgroundSyncUpStatus.Success
        })
      }
    } catch (err) {
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
  } else if (serviceHealthStatus === ServiceStatus.Failed) {
    console.warn(...logFormat.formatArgs("service is not healthy"))
    // cancel interval check
    clearInterval(_intervalCheckBackgroundSyncUpList)
  } else {
    console.debug(
      ...logFormat.formatArgs(
        "_checkBackgroundSyncUpList -> serviceHealthStatus",
        serviceHealthStatus
      )
    )
  }
}

export const init = async () => {
  console.info(...logFormat.formatArgs("init"))
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
