import { v4 as uuidv4 } from "uuid"

import { Storage } from "@plasmohq/storage"

import { type BookmarkCreateInputType } from "~/graphql/generated"
import { LogFormat } from "~helpers/LogFormat"

import { StorageKeys } from "./storageKeys"

const logFormat = new LogFormat("storage/backgroundSyncUp")

export const MAX_RETRY_COUNT = 3

export enum BackgroundSyncUpStatus {
  Ready = "ready",
  Success = "success",
  Pending = "pending",
  Failed = "failed"
}

export interface BackgroundSyncUpBaseItem<dataType> {
  key: string
  createdAt: number
  updatedAt: number
  status: BackgroundSyncUpStatus
  retryCount: number
  data: dataType
}

export type BackgroundSyncUpItemAPIPages = BackgroundSyncUpBaseItem<
  BookmarkCreateInputType[]
>

type BackgroundSyncUpList = string[]
type BackgroundSyncUpInProgress = { [propName: string]: number }

// BackgroundSyncUp Only support 1 item at a time

async function addToBackgroundSyncUpInProgress(
  key: string,
  syncUpItemKey: string
) {
  const storage = new Storage({ area: "local" })
  const backgroundSyncUpInProgress =
    (await storage.get<BackgroundSyncUpInProgress>(key)) || {}
  backgroundSyncUpInProgress[syncUpItemKey] = Date.now()
  // update backgroundSyncUpInProgress in storage
  await storage.set(key, backgroundSyncUpInProgress)

  return true
}

async function removeFromBackgroundSyncUpInProgress(
  key: string,
  syncUpItemKey: string
) {
  const storage = new Storage({ area: "local" })
  const backgroundSyncUpInProgress =
    (await storage.get<BackgroundSyncUpInProgress>(key)) || {}
  delete backgroundSyncUpInProgress[syncUpItemKey]
  // update backgroundSyncUpInProgress in storage
  await storage.set(key, backgroundSyncUpInProgress)

  return true
}

async function addToBackgroundSyncUp<dataType>(
  key: StorageKeys,
  syncUpItem: BackgroundSyncUpBaseItem<dataType>
): Promise<string> {
  const storage = new Storage({ area: "local" })
  const backgroundSyncUpList =
    (await storage.get<BackgroundSyncUpList>(key)) || []

  const syncUpItemKey = uuidv4()
  syncUpItem.key = syncUpItemKey
  backgroundSyncUpList.push(syncUpItemKey)
  await storage.set(syncUpItemKey, syncUpItem)
  await storage.set(key, backgroundSyncUpList)

  return syncUpItemKey
}

/**
 * Get a background sync up item from storage to send to server:
 * 1. If an item is found but it has been retried more than MAX_RETRY_COUNT times, remove it from storage and continue to find the next item.
 * 2. If find an item that has not been retried more than MAX_RETRY_COUNT times, update its retryCount and updatedAt, and return it. Also put it to backgroundSyncUpInProgress. In case, it doesn't update, then we can put it back
 * @param key
 * @returns
 */
async function getBackgroundSyncUpItem<dataType>(
  key: StorageKeys
): Promise<BackgroundSyncUpBaseItem<dataType> | null> {
  const storage = new Storage({ area: "local" })
  const backgroundSyncUpListRemain =
    (await storage.get<BackgroundSyncUpList>(key)) || []

  if (!backgroundSyncUpListRemain?.length) {
    return null
  }
  let found = false
  let syncUpItem = null
  while (backgroundSyncUpListRemain.length && !found) {
    const syncUpItemKey = backgroundSyncUpListRemain.shift()
    const item = await storage.get<BackgroundSyncUpBaseItem<dataType>>(
      syncUpItemKey
    )

    if (item) {
      if (item?.retryCount >= MAX_RETRY_COUNT) {
        // remove item from storage
        await storage.remove(syncUpItemKey)
      } else {
        item.retryCount ? item.retryCount++ : (item.retryCount = 1)
        item.updatedAt = Date.now()
        item.status = BackgroundSyncUpStatus.Pending
        // update item in storage
        await storage.set(syncUpItemKey, item)
        // put syncUpItemKey to backgroundSyncUpInProgress
        await addToBackgroundSyncUpInProgress(key, syncUpItemKey)
        syncUpItem = item
        found = true
      }
    }
  }
  // update backgroundSyncUpList in storage
  storage.set(key, backgroundSyncUpListRemain)

  return syncUpItem
}

async function updateBackgroundSyncUpItem<dataType>(
  key: StorageKeys,
  syncUpItem: BackgroundSyncUpBaseItem<dataType>
) {
  const storage = new Storage({ area: "local" })
  if (
    syncUpItem.status === BackgroundSyncUpStatus.Success ||
    syncUpItem.retryCount >= MAX_RETRY_COUNT
  ) {
    // remove item from backgroundSyncUp if success or already retried MAX_RETRY_COUNT times
    await storage.remove(syncUpItem.key)
    await removeFromBackgroundSyncUpInProgress(key, syncUpItem.key)
  } else {
    const backgroundSyncUpList =
      (await storage.get<BackgroundSyncUpList>(key)) || []
    // push syncUpItemKey to backgroundSyncUpList wait for next sync up try
    backgroundSyncUpList.push(syncUpItem.key)
    syncUpItem.updatedAt = Date.now()
    syncUpItem.status = BackgroundSyncUpStatus.Ready
    // update item in storage
    await storage.set(syncUpItem.key, syncUpItem)
    // update backgroundSyncUpList in storage
    await storage.set(key, backgroundSyncUpList)
  }
}

async function moveInProgressToRemainList(
  remainingKey: string,
  inProgressKey: string
) {
  const storage = new Storage({ area: "local" })
  const inProgress =
    (await storage.get<BackgroundSyncUpInProgress>(inProgressKey)) || {}
  const remainList =
    (await storage.get<BackgroundSyncUpList>(remainingKey)) || []
  const inProgressKeys = Object.keys(inProgress)

  // remove all items in inProgress and also reduce the retryCount of each item in remainList
  for (const syncUpItemKey of inProgressKeys) {
    const syncUpItem = await storage.get<BackgroundSyncUpBaseItem<any>>(
      syncUpItemKey
    )
    if (syncUpItem) {
      if (syncUpItem.retryCount > 0) {
        syncUpItem.retryCount--
      }
      syncUpItem.updatedAt = Date.now()
      syncUpItem.status = BackgroundSyncUpStatus.Ready
      // update item in storage
      await storage.set(syncUpItemKey, syncUpItem)
      // push syncUpItemKey to backgroundSyncUpList wait for next sync up try
      remainList.push(syncUpItemKey)
    }
  }
  // update backgroundSyncUpList in storage
  await storage.set(remainingKey, remainList)
  // remove backgroundSyncUpInProgress from storage
  await storage.remove(inProgressKey)
}

export async function initBackgroundSyncUp() {
  // check all the items in backgroundSyncUpInProgress and put to backgroundSyncUp list
  // BackgroundSyncUpKeyAPICreateOrUpdatePages
  await moveInProgressToRemainList(
    StorageKeys.BackgroundSyncUpKeyAPICreateOrUpdatePages,
    StorageKeys.BackgroundSyncUpKeyAPICreateOrUpdatePagesInProgress
  )
}

export async function addToBackgroundSyncUpAPICreateOrUpdatePages(
  pages: BookmarkCreateInputType[]
) {
  const syncUpItem = {
    key: "", // will be updated when added to storage
    createdAt: Date.now(),
    updatedAt: Date.now(),
    status: BackgroundSyncUpStatus.Ready,
    retryCount: 0,
    data: pages
  }
  await addToBackgroundSyncUp<BookmarkCreateInputType[]>(
    StorageKeys.BackgroundSyncUpKeyAPICreateOrUpdatePages,
    syncUpItem
  )
}

export async function getBackgroundSyncUpAPICreateOrUpdatePages() {
  return getBackgroundSyncUpItem<BookmarkCreateInputType[]>(
    StorageKeys.BackgroundSyncUpKeyAPICreateOrUpdatePages
  )
}

export async function updateBackgroundSyncUpAPICreateOrUpdatePages(
  syncUpItem: BackgroundSyncUpItemAPIPages
) {
  await updateBackgroundSyncUpItem<BookmarkCreateInputType[]>(
    StorageKeys.BackgroundSyncUpKeyAPICreateOrUpdatePages,
    syncUpItem
  )
}
