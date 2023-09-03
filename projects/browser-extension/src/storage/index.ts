import {
  DEFAULT_API_KEY,
  DEFAULT_HOST_NAME,
  DEFAULT_PROTOCOL,
  HISTORY_TAG
} from "@bitsky/shared"
import _ from "lodash"
import normalizeUrl from "normalize-url"
import { type Bookmarks, type History } from "webextension-polyfill"

import { Storage } from "@plasmohq/storage"

import { type PageCreateOrUpdatePayload } from "~/graphql/generated"
import { createOrUpdatePages } from "~background/modules/apis"
import { getFlatBookmarks } from "~background/modules/bookmarks"
import { type PageData } from "~background/modules/fetchPage"
import { getHistory } from "~background/modules/history"
import { LogFormat } from "~helpers/LogFormat"
import { releaseMemory } from "~helpers/util"
import {
  type ImportBookmarkRecord,
  type ImportBookmarks,
  type ImportBookmarksDetail,
  type ImportHistory,
  type ImportHistoryDetail,
  type ImportHistoryRecord,
  ImportStatus,
  type ImportSummary,
  ServiceStatus
} from "~types"

import {
  BackgroundSyncUpStatus,
  addToBackgroundSyncUpAPICreateOrUpdatePages,
  getBackgroundSyncUpAPICreateOrUpdatePages,
  initBackgroundSyncUp,
  updateBackgroundSyncUpAPICreateOrUpdatePages
} from "./backgroundSyncUp"
import { StorageKeys } from "./storageKeys"

//TODO: refactor index.ts, it should only focus on centralize exports
export {
  StorageKeys,
  BackgroundSyncUpStatus,
  initBackgroundSyncUp,
  addToBackgroundSyncUpAPICreateOrUpdatePages,
  getBackgroundSyncUpAPICreateOrUpdatePages,
  updateBackgroundSyncUpAPICreateOrUpdatePages
}

const logFormat = new LogFormat("storage")

// Service Relative Configuration
export const getServiceHostName = async (): Promise<string> => {
  const storage = new Storage()
  const hostName = (await storage.get(StorageKeys.ServiceHostName)) as string
  console.debug(...logFormat.formatArgs("getServiceHostName", hostName))
  releaseMemory(storage)
  return hostName ?? DEFAULT_HOST_NAME
}

export const setServiceHostName = async (hostName: string) => {
  const storage = new Storage()
  await storage.set(StorageKeys.ServiceHostName, hostName)
  console.debug(...logFormat.formatArgs("setServiceHostName", hostName))
  releaseMemory(storage)
  return true
}

export const getServiceProtocol = async (): Promise<string> => {
  const storage = new Storage()
  const protocol = (await storage.get(StorageKeys.ServiceProtocol)) as string
  console.debug(...logFormat.formatArgs("getServiceProtocol", protocol))
  releaseMemory(storage)
  return protocol ?? DEFAULT_PROTOCOL
}

export const setServiceProtocol = async (protocol: string) => {
  const storage = new Storage()
  await storage.set(StorageKeys.ServiceProtocol, protocol)
  console.debug(...logFormat.formatArgs("setServiceProtocol", protocol))
  releaseMemory(storage)
  return true
}

export const getServiceAPIKey = async (): Promise<string> => {
  const storage = new Storage()
  const apiKey = (await storage.get(StorageKeys.ServiceAPIKey)) as string
  console.debug(...logFormat.formatArgs("getServiceAPIKey", apiKey))
  releaseMemory(storage)
  return apiKey ?? DEFAULT_API_KEY
}

export const setServiceAPIKey = async (apiKey: string) => {
  const storage = new Storage()
  await storage.set(StorageKeys.ServiceAPIKey, apiKey)
  console.debug(...logFormat.formatArgs("setServiceAPIKey", apiKey))
  releaseMemory(storage)
  return true
}

export const getServicePort = async (): Promise<number> => {
  const storage = new Storage()
  const port = (await storage.get(StorageKeys.ServicePort)) as number
  console.debug(...logFormat.formatArgs("getServicePort", port))
  releaseMemory(storage)
  return port
}

export const setServicePort = async (port: number) => {
  const storage = new Storage()
  await storage.set(StorageKeys.ServicePort, port)
  console.debug(...logFormat.formatArgs("setServicePort", port))
  releaseMemory(storage)
  return true
}

export const getServiceDiscoverStatus = async (): Promise<ServiceStatus> => {
  const storage = new Storage()
  const status = (await storage.get(
    StorageKeys.ServiceDiscoverStatus
  )) as ServiceStatus
  console.debug(...logFormat.formatArgs("getServiceDiscoverStatus", status))
  releaseMemory(storage)
  return status ?? ServiceStatus.Unknown
}

export const setServiceDiscoverStatus = async (status: ServiceStatus) => {
  const storage = new Storage()
  await storage.set(StorageKeys.ServiceDiscoverStatus, status)
  console.debug(...logFormat.formatArgs("setServiceDiscoverStatus", status))
  releaseMemory(storage)
  return true
}

export const getServiceHealthStatus = async (): Promise<ServiceStatus> => {
  const storage = new Storage()
  const status = (await storage.get(
    StorageKeys.ServiceHealthStatus
  )) as ServiceStatus
  console.debug(...logFormat.formatArgs("getServiceHealthStatus", status))
  releaseMemory(storage)
  return status ?? ServiceStatus.Unknown
}

export const setServiceHealthStatus = async (status: ServiceStatus) => {
  const storage = new Storage()
  await storage.set(StorageKeys.ServiceHealthStatus, status)
  console.debug(...logFormat.formatArgs("setServiceHealthStatus", status))
  releaseMemory(storage)
  return true
}

export const DEFAULT_IMPORT_BOOKMARKS_DETAIL: ImportBookmarksDetail = {
  inProgress: [],
  success: [],
  failed: [],
  remaining: []
}

export const DEFAULT_IMPORT_HISTORY_DETAIL: ImportHistoryDetail = {
  inProgress: [],
  success: [],
  failed: [],
  remaining: []
}

export const DEFAULT_IMPORT_SUMMARY: ImportSummary = {
  lastImportedAt: undefined,
  updatedAt: undefined,
  status: undefined,
  totalCount: undefined,
  inProgressCount: undefined,
  successCount: undefined,
  failedCount: undefined
}

export const cleanAllBookmarks = async () => {
  const storageSummary = new Storage()
  await storageSummary.remove(StorageKeys.ImportBookmarksSummary)
  const storage = new Storage({ area: "local" })
  await storage.remove(StorageKeys.ImportBookmarksInProgress)
  await storage.remove(StorageKeys.ImportBookmarksSuccess)
  await storage.remove(StorageKeys.ImportBookmarksFailed)
  await storage.remove(StorageKeys.ImportBookmarksRemaining)
}

export const getImportSummary = async ({
  key
}: {
  key: StorageKeys
}): Promise<ImportSummary> => {
  const storage = new Storage()
  const importSummary =
    ((await storage.get(key)) as ImportSummary) ?? DEFAULT_IMPORT_SUMMARY
  console.debug(...logFormat.formatArgs("getImportSummary", importSummary))
  return importSummary
}

export const updateImportSummary = async ({
  key,
  summary
}: {
  key: StorageKeys
  summary: Partial<ImportSummary>
}): Promise<boolean> => {
  const storage = new Storage()
  const importSummary = await getImportSummary({ key })
  const updateImportSummary = { ...importSummary, ...summary }
  if (updateImportSummary.inProgressCount === 0) {
    updateImportSummary.status = ImportStatus.Ready
  }
  await storage.set(key, updateImportSummary)
  console.debug(
    ...logFormat.formatArgs("updateImportSummary", updateImportSummary)
  )
  return true
}

const getImportByStorageKey = async ({
  key
}: {
  key: StorageKeys
}): Promise<ImportBookmarkRecord[] | ImportHistoryRecord[]> => {
  const storage = new Storage({ area: "local" })
  const importByKey =
    ((await storage.get(key)) as
      | ImportBookmarkRecord[]
      | ImportHistoryRecord[]) ?? []
  console.debug(...logFormat.formatArgs("getImportByStorageKey", importByKey))
  return importByKey
}

/**
 * Overwrite import by storage key, if pass `status` then will update the status
 * @param {key, overwriteImport, status}
 * @returns
 */
const overwriteImportByStorageKey = async ({
  key,
  overwriteImport,
  status
}: {
  key: StorageKeys
  overwriteImport: ImportBookmarkRecord[] | ImportHistoryRecord[]
  status?: ImportStatus
}): Promise<boolean> => {
  const storage = new Storage({ area: "local" })
  if (status) {
    overwriteImport = overwriteImport.map((page) => {
      if (page) {
        page.status = status
      }
      return page
    })
  }

  await storage.set(key, overwriteImport ?? [])
  console.debug(
    ...logFormat.formatArgs(
      `overwriteImportByStorageKey -> key: ${key}, overwriteImport: `,
      overwriteImport
    )
  )
  return true
}

export const getImportBookmarksSummary = async (): Promise<ImportSummary> => {
  const importSummary = getImportSummary({
    key: StorageKeys.ImportBookmarksSummary
  })
  return importSummary
}

export const updateImportBookmarksSummary = async (
  summary: Partial<ImportSummary>
): Promise<boolean> => {
  return await updateImportSummary({
    key: StorageKeys.ImportBookmarksSummary,
    summary
  })
}

export const getImportBookmarksDetail = async (
  {
    inProgress,
    success,
    failed,
    remaining
  }: {
    inProgress?: boolean
    success?: boolean
    failed?: boolean
    remaining?: boolean
  } = { inProgress: true, success: true, failed: true, remaining: true }
): Promise<ImportBookmarksDetail> => {
  const detail: ImportBookmarksDetail = {}
  if (inProgress) {
    detail.inProgress = (await getImportByStorageKey({
      key: StorageKeys.ImportBookmarksInProgress
    })) as ImportBookmarkRecord[]
  }
  if (success) {
    detail.success = (await getImportByStorageKey({
      key: StorageKeys.ImportBookmarksSuccess
    })) as ImportBookmarkRecord[]
  }
  if (failed) {
    detail.failed = (await getImportByStorageKey({
      key: StorageKeys.ImportBookmarksFailed
    })) as ImportBookmarkRecord[]
  }
  if (remaining) {
    detail.remaining = (await getImportByStorageKey({
      key: StorageKeys.ImportBookmarksRemaining
    })) as ImportBookmarkRecord[]
  }
  console.debug(...logFormat.formatArgs("getImportBookmarksDetail", detail))
  return detail
}

export const updateImportBookmarksDetail = async (
  detail: Partial<ImportBookmarksDetail>
): Promise<boolean> => {
  const summary: ImportSummary = {}
  if (detail.inProgress) {
    await overwriteImportByStorageKey({
      key: StorageKeys.ImportBookmarksInProgress,
      overwriteImport: detail?.inProgress ?? [],
      status: ImportStatus.Pending
    })
    summary.inProgressCount = detail.inProgress.length
  }
  if (detail.success) {
    await overwriteImportByStorageKey({
      key: StorageKeys.ImportBookmarksSuccess,
      overwriteImport: detail?.success ?? [],
      status: ImportStatus.Success
    })
    summary.successCount = detail.success.length
  }
  if (detail.failed) {
    await overwriteImportByStorageKey({
      key: StorageKeys.ImportBookmarksFailed,
      overwriteImport: detail?.failed ?? [],
      status: ImportStatus.Failed
    })
    summary.failedCount = detail.failed.length
  }
  if (detail.remaining) {
    await overwriteImportByStorageKey({
      key: StorageKeys.ImportBookmarksRemaining,
      overwriteImport: detail?.remaining ?? [],
      status: ImportStatus.Ready
    })
    summary.remainingCount = detail.remaining.length
  }

  console.debug(
    ...logFormat.formatArgs("updateImportBookmarksDetail -> detail:", detail)
  )
  console.debug(
    ...logFormat.formatArgs("updateImportBookmarksDetail -> summary:", summary)
  )
  await updateImportBookmarksSummary(summary)

  return true
}

export const getImportBookmarks = async (): Promise<ImportBookmarks> => {
  const importBookmarksSummary = await getImportBookmarksSummary()
  const importBookmarksDetail = await getImportBookmarksDetail()

  return {
    ...importBookmarksSummary,
    ...importBookmarksDetail
  } as ImportBookmarks
}

export const updateImportBookmarks = async (pagesData: PageData[]) => {
  const {
    inProgress: inProgressBookmarks,
    success: successBookmarks,
    failed: failedBookmarks,
    remaining: remainingBookmarks
  } = await getImportBookmarksDetail()
  console.info(...logFormat.formatArgs("updateImportBookmarks"))
  console.debug(
    ...logFormat.formatArgs("updateImportBookmarks -> pagesData:", pagesData)
  )
  console.debug(
    ...logFormat.formatArgs(
      "updateImportBookmarks before -> inProgressBookmarks:",
      inProgressBookmarks
    )
  )
  console.debug(
    ...logFormat.formatArgs(
      "updateImportBookmarks before -> successBookmarks:",
      successBookmarks
    )
  )
  console.debug(
    ...logFormat.formatArgs(
      "updateImportBookmarks before -> failedBookmarks:",
      failedBookmarks
    )
  )
  console.debug(
    ...logFormat.formatArgs(
      "updateImportBookmarks before -> remainingBookmarks:",
      remainingBookmarks
    )
  )

  const bookmarks: PageCreateOrUpdatePayload[] = []

  for (let i = 0; i < inProgressBookmarks.length; i++) {
    const bookmark = inProgressBookmarks[i]
    const pageData = pagesData.find(
      (pageData) => normalizeUrl(pageData.url) === normalizeUrl(bookmark.url)
    )
    // console.debug(...logFormat.formatArgs("updateImportBookmarks -> bookmark.url", bookmark.url, "pageData.url:", pageData.url))
    console.debug(
      ...logFormat.formatArgs(
        "updateImportBookmarks -> pageData:",
        pageData,
        "index:",
        i
      )
    )
    if (pageData) {
      if (pageData.error) {
        bookmark.status = ImportStatus.Failed
        bookmark.lastImportedAt = new Date().getTime()
        failedBookmarks.push(bookmark)
      } else {
        bookmark.status = ImportStatus.Success
        bookmark.lastImportedAt = new Date().getTime()
        successBookmarks.push(bookmark)
      }

      bookmarks.push({
        title: bookmark.title,
        pageTags: bookmark.tags.map((tag) => ({ name: tag })),
        url: pageData.url,
        content: "",
        raw: pageData.content ?? "",
        pageMetadata: {
          bookmarked: true
        }
      })
    } else {
      bookmark.status = ImportStatus.Ready
      bookmark.lastImportedAt = new Date().getTime()
      remainingBookmarks.push(bookmark)
    }
  }

  console.debug(
    ...logFormat.formatArgs(
      "updateImportBookmarks after -> inProgressBookmarks:",
      inProgressBookmarks
    )
  )
  console.debug(
    ...logFormat.formatArgs(
      "updateImportBookmarks after -> successBookmarks:",
      successBookmarks
    )
  )
  console.debug(
    ...logFormat.formatArgs(
      "updateImportBookmarks after -> failedBookmarks:",
      failedBookmarks
    )
  )
  console.debug(
    ...logFormat.formatArgs(
      "updateImportBookmarks after -> remainingBookmarks:",
      remainingBookmarks
    )
  )

  console.debug(
    ...logFormat.formatArgs(
      "updateImportBookmarks -> bookmarks send to server:",
      bookmarks
    )
  )

  await updateImportBookmarksDetail({
    inProgress: [],
    success: successBookmarks,
    failed: failedBookmarks,
    remaining: remainingBookmarks
  })

  // send request to backend
  await createOrUpdatePages(bookmarks)
  releaseMemory(bookmarks) // release memory
}

function getPageHash(page: Bookmarks.BookmarkTreeNode | History.HistoryItem) {
  return `${page.id}:${page.url}`
}

function updateImportPageHash(
  pagesHash: object,
  pages: ImportBookmarkRecord[] | ImportHistoryRecord[]
) {
  for (let i = 0; i < pages.length; i++) {
    const page = pages[i]
    pagesHash[getPageHash(page)] = page
  }
  return pagesHash
}

// check if there are any new bookmarks and update the import status
export const syncUpWithLatestBookmarks = async () => {
  console.info(...logFormat.formatArgs("syncUpWithLatestBookmarks"))
  const bookmarks = await getFlatBookmarks()
  const importBookmarks = await getImportBookmarks()
  console.debug(
    ...logFormat.formatArgs(
      "syncUpWithLatestBookmarks -> bookmarks:",
      bookmarks
    )
  )
  console.debug(
    ...logFormat.formatArgs(
      "syncUpWithLatestBookmarks -> importBookmarks:",
      importBookmarks
    )
  )
  const importBookmarksHash: { [key: string]: ImportBookmarkRecord } = {}
  updateImportPageHash(importBookmarksHash, importBookmarks?.inProgress)
  updateImportPageHash(importBookmarksHash, importBookmarks?.success)
  updateImportPageHash(importBookmarksHash, importBookmarks?.failed)
  updateImportPageHash(importBookmarksHash, importBookmarks?.remaining)

  const inProgress = []
  const success = []
  const failed = []
  const remaining = []

  console.debug(
    ...logFormat.formatArgs(
      "syncUpWithLatestBookmarks -> importBookmarksHash:",
      importBookmarksHash
    )
  )

  for (let i = 0; i < bookmarks.length; i++) {
    const bookmark = bookmarks[i]
    const importBookmark = importBookmarksHash[getPageHash(bookmark)]

    if (!importBookmark) {
      // new bookmark
      remaining.push(bookmark)
    } else if (importBookmark.status === ImportStatus.Pending) {
      inProgress.push(importBookmark)
    } else if (importBookmark.status === ImportStatus.Success) {
      success.push(importBookmark)
    } else if (importBookmark.status === ImportStatus.Failed) {
      failed.push(importBookmark)
    } else {
      remaining.push(importBookmark)
    }
  }

  console.debug(
    ...logFormat.formatArgs(
      "syncUpWithLatestBookmarks -> remaining:",
      remaining
    )
  )
  console.debug(
    ...logFormat.formatArgs(
      "syncUpWithLatestBookmarks -> inProgress:",
      inProgress
    )
  )
  console.debug(
    ...logFormat.formatArgs("syncUpWithLatestBookmarks -> success:", success)
  )
  console.debug(
    ...logFormat.formatArgs("syncUpWithLatestBookmarks -> failed:", failed)
  )
  // update total
  const importBookmarksSummary = {
    lastImportedAt: importBookmarks.lastImportedAt,
    updatedAt: new Date().getTime(),
    status: importBookmarks.status,
    totalCount: bookmarks.length,
    inProgressCount: inProgress.length,
    successCount: success.length,
    failedCount: failed.length
  }

  // update storage
  await updateImportBookmarksSummary(importBookmarksSummary)
  await updateImportBookmarksDetail({
    inProgress,
    success,
    failed,
    remaining
  })
  releaseMemory(inProgress)
  releaseMemory(success)
  releaseMemory(failed)
  releaseMemory(failed)
  return importBookmarksSummary
}

/**
 * Prepare the import bookmarks:
 * 1. Change the status to ImportStatus.Pending
 * 2. Update the import bookmarks summary
 */
export const prepareStartImportBookmarks = async ({
  syncUpBookmarks
}: {
  syncUpBookmarks?: boolean
}): Promise<ImportSummary> => {
  console.info(
    ...logFormat.formatArgs("prepareStartImportBookmarks", { syncUpBookmarks })
  )
  if (syncUpBookmarks) {
    await syncUpWithLatestBookmarks()
  }

  // remove `inProgress` put it to `remaining`
  const inProgressBookmarks = (await getImportByStorageKey({
    key: StorageKeys.ImportBookmarksInProgress
  })) as ImportBookmarkRecord[]
  const remainingBookmarks = (await getImportByStorageKey({
    key: StorageKeys.ImportBookmarksRemaining
  })) as ImportBookmarkRecord[]
  const newRemainingBookmarks = remainingBookmarks.concat(inProgressBookmarks)

  await updateImportBookmarksDetail({
    inProgress: [],
    remaining: newRemainingBookmarks
  })

  // update importBookmarksSummary
  await updateImportBookmarksSummary({
    updatedAt: new Date().getTime(),
    inProgressCount: 0,
    remainingCount: newRemainingBookmarks.length,
    status: ImportStatus.Ready
  })

  return await getImportBookmarksSummary()
}

export const startImportBookmarks = async ({
  concurrentBookmarks
}: {
  concurrentBookmarks?: number
}): Promise<ImportBookmarkRecord[]> => {
  if (!concurrentBookmarks) {
    concurrentBookmarks = 1
  }

  const inProgressBookmarks = (await getImportByStorageKey({
    key: StorageKeys.ImportBookmarksInProgress
  })) as ImportBookmarkRecord[]
  const remainingBookmarks = (await getImportByStorageKey({
    key: StorageKeys.ImportBookmarksRemaining
  })) as ImportBookmarkRecord[]
  const bookmarks: ImportBookmarkRecord[] = []
  for (let i = 0; i < concurrentBookmarks && remainingBookmarks.length; i++) {
    const bookmark = remainingBookmarks.shift()
    bookmark.status = ImportStatus.Pending
    bookmark.lastImportedAt = new Date().getTime()
    bookmarks.push(bookmark)
  }

  remainingBookmarks.concat(inProgressBookmarks)

  await updateImportBookmarksSummary({
    status: ImportStatus.Pending,
    inProgressCount: bookmarks.length,
    remainingCount: remainingBookmarks.length,
    updatedAt: new Date().getTime()
  })

  await updateImportBookmarksDetail({
    inProgress: bookmarks,
    remaining: remainingBookmarks
  })

  return bookmarks
}

export const stopImportBookmarks = async (): Promise<boolean> => {
  const inProgressBookmarks = (await getImportByStorageKey({
    key: StorageKeys.ImportBookmarksInProgress
  })) as ImportBookmarkRecord[]
  const remainingBookmarks = (await getImportByStorageKey({
    key: StorageKeys.ImportBookmarksRemaining
  })) as ImportBookmarkRecord[]

  remainingBookmarks.concat(
    inProgressBookmarks.map((bookmark) => {
      bookmark.status = undefined
      return bookmark
    })
  )

  await updateImportBookmarksSummary({
    status: ImportStatus.Ready,
    inProgressCount: 0,
    remainingCount: remainingBookmarks.length,
    updatedAt: new Date().getTime()
  })

  await updateImportBookmarksDetail({
    inProgress: [],
    remaining: remainingBookmarks
  })

  return true
}

export const cleanAllHistory = async () => {
  const storageSummary = new Storage()
  await storageSummary.remove(StorageKeys.ImportHistorySummary)
  const storage = new Storage({ area: "local" })
  await storage.remove(StorageKeys.ImportHistoryInProgress)
  await storage.remove(StorageKeys.ImportHistorySuccess)
  await storage.remove(StorageKeys.ImportHistoryFailed)
  await storage.remove(StorageKeys.ImportHistoryRemaining)
}

export const getImportHistorySummary = async (): Promise<ImportSummary> => {
  const importSummary = getImportSummary({
    key: StorageKeys.ImportHistorySummary
  })
  return importSummary
}

export const updateImportHistorySummary = async (
  summary: Partial<ImportSummary>
): Promise<boolean> => {
  await updateImportSummary({
    key: StorageKeys.ImportHistorySummary,
    summary
  })
  return true
}

export const getImportHistoryDetail = async (
  {
    inProgress,
    success,
    failed,
    remaining
  }: {
    inProgress?: boolean
    success?: boolean
    failed?: boolean
    remaining?: boolean
  } = { inProgress: true, success: true, failed: true, remaining: true }
): Promise<ImportHistoryDetail> => {
  const detail: ImportHistoryDetail = {}
  if (inProgress) {
    detail.inProgress = (await getImportByStorageKey({
      key: StorageKeys.ImportHistoryInProgress
    })) as ImportHistoryRecord[]
  }
  if (success) {
    detail.success = (await getImportByStorageKey({
      key: StorageKeys.ImportHistorySuccess
    })) as ImportHistoryRecord[]
  }
  if (failed) {
    detail.failed = (await getImportByStorageKey({
      key: StorageKeys.ImportHistoryFailed
    })) as ImportHistoryRecord[]
  }
  if (remaining) {
    detail.remaining = (await getImportByStorageKey({
      key: StorageKeys.ImportHistoryRemaining
    })) as ImportHistoryRecord[]
  }
  console.debug(...logFormat.formatArgs("getImportHistoryDetail", detail))
  return detail
}

export const updateImportHistoryDetail = async (
  detail: Partial<ImportHistoryDetail>
): Promise<boolean> => {
  const summary: ImportSummary = {}
  if (detail.inProgress) {
    await overwriteImportByStorageKey({
      key: StorageKeys.ImportHistoryInProgress,
      overwriteImport: detail?.inProgress ?? [],
      status: ImportStatus.Pending
    })
    summary.inProgressCount = detail.inProgress.length
  }
  if (detail.success) {
    await overwriteImportByStorageKey({
      key: StorageKeys.ImportHistorySuccess,
      overwriteImport: detail?.success ?? [],
      status: ImportStatus.Success
    })
    summary.successCount = detail.success.length
  }
  if (detail.failed) {
    await overwriteImportByStorageKey({
      key: StorageKeys.ImportHistoryFailed,
      overwriteImport: detail?.failed ?? [],
      status: ImportStatus.Failed
    })
    summary.failedCount = detail.failed.length
  }
  if (detail.remaining) {
    await overwriteImportByStorageKey({
      key: StorageKeys.ImportHistoryRemaining,
      overwriteImport: detail?.remaining ?? [],
      status: ImportStatus.Ready
    })
    summary.remainingCount = detail.remaining.length
  }

  console.debug(
    ...logFormat.formatArgs("updateImportHistoryDetail -> detail:", detail)
  )
  console.debug(
    ...logFormat.formatArgs("updateImportHistoryDetail -> summary:", summary)
  )
  await updateImportHistorySummary(summary)

  return true
}

export const getImportHistory = async (): Promise<ImportHistory> => {
  const importSummary = await getImportHistorySummary()
  const importDetail = await getImportHistoryDetail()

  return {
    ...importSummary,
    ...importDetail
  } as ImportHistory
}

export const updateImportHistory = async (pagesData: PageData[]) => {
  const funName = `updateImportHistory`
  const { inProgress, success, failed, remaining } =
    await getImportHistoryDetail()

  console.debug(...logFormat.formatArgs(`${funName} -> pagesData:`, pagesData))
  console.debug(
    ...logFormat.formatArgs(
      `${funName} before -> inProgressBookmarks:`,
      inProgress
    )
  )
  console.debug(
    ...logFormat.formatArgs(`${funName} before -> successBookmarks:`, success)
  )
  console.debug(
    ...logFormat.formatArgs(`${funName} before -> failedBookmarks:`, failed)
  )
  console.debug(
    ...logFormat.formatArgs(
      `${funName} before -> remainingBookmarks:`,
      remaining
    )
  )

  const pages: PageCreateOrUpdatePayload[] = []

  for (let i = 0; i < inProgress.length; i++) {
    const page = inProgress[i]
    const pageData = pagesData.find(
      (pageData) => normalizeUrl(pageData.url) === normalizeUrl(page.url)
    )
    // console.debug(...logFormat.formatArgs("updateImportBookmarks -> bookmark.url", bookmark.url, "pageData.url:", pageData.url))
    console.debug(
      ...logFormat.formatArgs(`${funName} -> pageData:`, pageData, "index:", i)
    )
    if (pageData) {
      if (pageData.error) {
        page.status = ImportStatus.Failed
        page.lastImportedAt = new Date().getTime()
        failed.push(page)
      } else {
        page.status = ImportStatus.Success
        page.lastImportedAt = new Date().getTime()
        success.push(page)
      }

      pages.push({
        title: page.title,
        pageTags: page.tags.map((tag) => ({ name: tag })),
        url: pageData.url,
        content: "",
        raw: pageData.content ?? "",
        pageMetadata: {
          lastVisitTime: new Date(page.lastVisitTime).toISOString(),
          bookmarked: false,
          visitCount: page.visitCount,
          typedCount: page.typedCount
        }
      })
    } else {
      page.status = ImportStatus.Ready
      page.lastImportedAt = new Date().getTime()
      remaining.push(page)
    }
  }

  console.debug(
    ...logFormat.formatArgs(`${funName} after -> inProgress:`, inProgress)
  )
  console.debug(
    ...logFormat.formatArgs(`${funName} after -> success:`, success)
  )
  console.debug(...logFormat.formatArgs(`${funName} after -> failed:`, failed))
  console.debug(
    ...logFormat.formatArgs(`${funName} after -> remaining:`, remaining)
  )

  await updateImportHistoryDetail({
    inProgress: [],
    success,
    failed,
    remaining
  })

  // send request to backend
  await createOrUpdatePages(pages)
  releaseMemory(pages) // release memory
}

export const syncUpWithLatestHistory = async ({
  startTime,
  endTime,
  maxResults,
  text
}: {
  startTime?: number
  endTime?: number
  maxResults?: number
  text?: string
}) => {
  const historyItems = await getHistory({
    startTime,
    endTime,
    maxResults,
    text
  })
  const importHistory = await getImportHistory()

  const importHistoryHash: { [key: string]: ImportHistoryRecord } = {}
  updateImportPageHash(importHistoryHash, importHistory?.inProgress)
  updateImportPageHash(importHistoryHash, importHistory?.success)
  updateImportPageHash(importHistoryHash, importHistory?.failed)
  updateImportPageHash(importHistoryHash, importHistory?.remaining)

  const inProgress = []
  const success = []
  const failed = []
  const remaining = []
  console.debug(
    ...logFormat.formatArgs(
      "syncUpWithLatestHistory -> historyItems:",
      historyItems
    )
  )
  for (let i = 0; i < historyItems.length; i++) {
    const historyPage = historyItems[i]
    historyPage.tags = [HISTORY_TAG]
    const importHistoryPage = importHistoryHash[getPageHash(historyPage)]

    if (!importHistoryPage) {
      // new bookmark
      remaining.push(historyPage)
    } else if (importHistoryPage.status === ImportStatus.Pending) {
      inProgress.push({ ...importHistoryPage, ...historyPage })
    } else if (importHistoryPage.status === ImportStatus.Success) {
      success.push({ ...importHistoryPage, ...historyPage })
    } else if (importHistoryPage.status === ImportStatus.Failed) {
      failed.push({ ...importHistoryPage, ...historyPage })
    } else {
      remaining.push({ ...importHistoryPage, ...historyPage })
    }
  }

  console.debug(
    ...logFormat.formatArgs("syncUpWithLatestHistory -> remaining:", remaining)
  )
  console.debug(
    ...logFormat.formatArgs(
      "syncUpWithLatestHistory -> inProgress:",
      inProgress
    )
  )
  console.debug(
    ...logFormat.formatArgs("syncUpWithLatestHistory -> success:", success)
  )
  console.debug(
    ...logFormat.formatArgs("syncUpWithLatestHistory -> failed:", failed)
  )

  const importHistorySummary = {
    lastImportedAt: importHistory.lastImportedAt,
    updatedAt: new Date().getTime(),
    status: importHistory.status,
    totalCount: historyItems.length,
    inProgressCount: inProgress.length,
    successCount: success.length,
    failedCount: failed.length
  }

  // update storage
  await updateImportHistorySummary(importHistorySummary)
  await updateImportHistoryDetail({
    inProgress,
    success,
    failed,
    remaining
  })
  releaseMemory(inProgress)
  releaseMemory(success)
  releaseMemory(failed)
  releaseMemory(failed) // release memory
  return importHistorySummary
}

export const prepareStartImportHistory = async ({
  startTime,
  endTime,
  maxResults,
  text,
  syncUpWithHistory
}: {
  startTime?: number
  endTime?: number
  maxResults?: number
  text?: string
  syncUpWithHistory?: boolean
}): Promise<ImportSummary> => {
  console.info(
    ...logFormat.formatArgs("prepareStartImportHistory", {
      startTime,
      endTime,
      maxResults,
      text,
      syncUpWithHistory
    })
  )

  // when `refresh` is true, then sync up with latest history, this will trigger re-import all history
  if (syncUpWithHistory) {
    await syncUpWithLatestHistory({
      startTime,
      endTime,
      maxResults,
      text
    })
  }

  // remove `inProgress` put it to `remaining`
  const inProgress = (await getImportByStorageKey({
    key: StorageKeys.ImportHistoryInProgress
  })) as ImportHistoryRecord[]
  const remaining = (await getImportByStorageKey({
    key: StorageKeys.ImportHistoryRemaining
  })) as ImportHistoryRecord[]
  const newRemaining = remaining.concat(inProgress)

  await updateImportHistoryDetail({
    inProgress: [],
    remaining: newRemaining
  })

  // update importBookmarksSummary
  await updateImportHistorySummary({
    updatedAt: new Date().getTime(),
    inProgressCount: 0,
    remainingCount: newRemaining.length,
    status: ImportStatus.Ready
  })

  return await getImportHistorySummary()
}

export const startImportHistory = async ({
  concurrent
}: {
  concurrent?: number
}): Promise<ImportHistoryRecord[]> => {
  if (!concurrent) {
    concurrent = 1
  }

  const inProgress = (await getImportByStorageKey({
    key: StorageKeys.ImportHistoryInProgress
  })) as ImportHistoryRecord[]
  const remaining = (await getImportByStorageKey({
    key: StorageKeys.ImportHistoryRemaining
  })) as ImportHistoryRecord[]
  const history: ImportHistoryRecord[] = []
  for (let i = 0; i < concurrent && remaining.length; i++) {
    const page = remaining.shift()
    page.status = ImportStatus.Pending
    page.lastImportedAt = new Date().getTime()
    history.push(page)
  }

  remaining.concat(inProgress)

  await updateImportHistorySummary({
    status: ImportStatus.Pending,
    inProgressCount: history.length,
    remainingCount: remaining.length,
    updatedAt: new Date().getTime()
  })

  await updateImportHistoryDetail({
    inProgress: history,
    remaining: remaining
  })
  releaseMemory(history) // release memory
  return history
}

export const stopImportHistory = async (): Promise<boolean> => {
  const inProgress = (await getImportByStorageKey({
    key: StorageKeys.ImportHistoryInProgress
  })) as ImportHistoryRecord[]
  const remaining = (await getImportByStorageKey({
    key: StorageKeys.ImportHistoryRemaining
  })) as ImportHistoryRecord[]

  remaining.concat(
    inProgress.map((page) => {
      page.status = undefined
      return page
    })
  )

  await updateImportHistorySummary({
    status: ImportStatus.Ready,
    inProgressCount: 0,
    remainingCount: remaining.length,
    updatedAt: new Date().getTime()
  })

  await updateImportHistoryDetail({
    inProgress: [],
    remaining: remaining
  })

  return true
}
