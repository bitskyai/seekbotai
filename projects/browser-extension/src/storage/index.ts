import _ from "lodash"
import { type Bookmarks } from "webextension-polyfill"

import { Storage } from "@plasmohq/storage"

import { type BookmarkCreateInputType } from "~/graphql/generated"
import createBookmarks from "~background/apis/createBookmarks"
import { getFlatBookmarks } from "~background/modules/bookmarks"
import { type PageData } from "~background/modules/fetchPage"
import { LogFormat } from "~helpers/LogFormat"
import {
  type ImportBookmarkRecord,
  type ImportBookmarks,
  type ImportBookmarksDetail,
  type ImportBookmarksSummary,
  ImportStatus
} from "~types"

const logFormat = new LogFormat("storage")

export enum StorageKeys {
  ImportBookmarksSummary = "ImportBookmarksSummary",
  ImportBookmarksInProgress = "ImportBookmarksInProgress",
  ImportBookmarksSuccess = "ImportBookmarksSuccess",
  ImportBookmarksFailed = "ImportBookmarksFailed",
  ImportBookmarksRemaining = "ImportBookmarksRemaining"
}

export const DEFAULT_IMPORT_BOOKMARKS_DETAIL: ImportBookmarksDetail = {
  inProgress: [],
  success: [],
  failed: [],
  remaining: []
}

export const DEFAULT_IMPORT_BOOKMARKS_SUMMARY: ImportBookmarksSummary = {
  lastImportedAt: undefined,
  updatedAt: undefined,
  status: undefined,
  totalBookmarkCount: undefined,
  inProgressBookmarkCount: undefined,
  successBookmarkCount: undefined,
  failedBookmarkCount: undefined
}

export const getImportBookmarksSummary =
  async (): Promise<ImportBookmarksSummary> => {
    const storage = new Storage()
    const importBookmarksSummary =
      ((await storage.get(
        StorageKeys.ImportBookmarksSummary
      )) as ImportBookmarksSummary) ?? DEFAULT_IMPORT_BOOKMARKS_SUMMARY
    console.debug(
      ...logFormat.formatArgs(
        "getImportBookmarksSummary",
        importBookmarksSummary
      )
    )
    return importBookmarksSummary
  }

export const updateImportBookmarksSummary = async (
  summary: Partial<ImportBookmarksSummary>
): Promise<boolean> => {
  const storage = new Storage()
  const importBookmarksSummary = await getImportBookmarksSummary()
  const updateImportBooksSummary = _.merge(importBookmarksSummary, summary)
  await storage.set(
    StorageKeys.ImportBookmarksSummary,
    updateImportBooksSummary
  )
  console.debug(
    ...logFormat.formatArgs(
      "updateImportBookmarksSummary",
      updateImportBooksSummary
    )
  )
  return true
}

const getImportBookmarksInProgress = async (): Promise<
  ImportBookmarkRecord[]
> => {
  const storage = new Storage({ area: "local" })
  const importBookmarksInProgress =
    ((await storage.get(
      StorageKeys.ImportBookmarksInProgress
    )) as ImportBookmarkRecord[]) ?? []
  console.debug(
    ...logFormat.formatArgs(
      "getImportBookmarksInProgress",
      importBookmarksInProgress
    )
  )
  return importBookmarksInProgress
}

const updateImportBookmarksInProgress = async (
  inProgress: ImportBookmarkRecord[]
): Promise<boolean> => {
  const storage = new Storage({ area: "local" })
  inProgress = inProgress.map((bookmark) => {
    bookmark.status = ImportStatus.Pending
    return bookmark
  })
  await storage.set(StorageKeys.ImportBookmarksInProgress, inProgress ?? [])
  console.debug(
    ...logFormat.formatArgs("updateImportBookmarksInProgress", inProgress)
  )
  return true
}

const getImportBookmarksSuccess = async (): Promise<ImportBookmarkRecord[]> => {
  const storage = new Storage({ area: "local" })
  const ImportBookmarksSuccess =
    ((await storage.get(
      StorageKeys.ImportBookmarksSuccess
    )) as ImportBookmarkRecord[]) ?? []
  console.debug(
    ...logFormat.formatArgs("getImportBookmarksSuccess", ImportBookmarksSuccess)
  )
  return ImportBookmarksSuccess
}

const updateImportBookmarksSuccess = async (
  success: ImportBookmarkRecord[]
): Promise<boolean> => {
  const storage = new Storage({ area: "local" })
  success = success.map((bookmark) => {
    bookmark.status = ImportStatus.Success
    return bookmark
  })
  await storage.set(StorageKeys.ImportBookmarksSuccess, success ?? [])
  console.debug(
    ...logFormat.formatArgs("updateImportBookmarksSuccess", success)
  )
  return true
}

const getImportBookmarksFailed = async (): Promise<ImportBookmarkRecord[]> => {
  const storage = new Storage({ area: "local" })
  const importBookmarksFailed =
    ((await storage.get(
      StorageKeys.ImportBookmarksFailed
    )) as ImportBookmarkRecord[]) ?? []
  console.debug(
    ...logFormat.formatArgs("getImportBookmarksFailed", importBookmarksFailed)
  )
  return importBookmarksFailed
}

const updateImportBookmarksFailed = async (
  failed: ImportBookmarkRecord[]
): Promise<boolean> => {
  const storage = new Storage({ area: "local" })
  failed = failed.map((bookmark) => {
    bookmark.status = ImportStatus.Failed
    return bookmark
  })
  await storage.set(StorageKeys.ImportBookmarksFailed, failed ?? [])
  console.debug(...logFormat.formatArgs("updateImportBookmarksFailed", failed))
  return true
}

export const getImportBookmarksRemaining = async (): Promise<
  ImportBookmarkRecord[]
> => {
  const storage = new Storage({ area: "local" })
  const importBookmarksRemaining =
    ((await storage.get(
      StorageKeys.ImportBookmarksRemaining
    )) as ImportBookmarkRecord[]) ?? []

  console.debug(
    ...logFormat.formatArgs(
      "getImportBookmarksRemaining",
      importBookmarksRemaining
    )
  )
  return importBookmarksRemaining
}

const updateImportBookmarksRemaining = async (
  remaining: ImportBookmarkRecord[]
) => {
  const storage = new Storage({ area: "local" })
  remaining = remaining.map((bookmark) => {
    bookmark.status = ImportStatus.Ready
    return bookmark
  })
  await storage.set(StorageKeys.ImportBookmarksRemaining, remaining ?? [])
  console.debug(
    ...logFormat.formatArgs("updateImportBookmarksRemaining", remaining)
  )
  return true
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
    detail.inProgress = await getImportBookmarksInProgress()
  }
  if (success) {
    detail.success = await getImportBookmarksSuccess()
  }
  if (failed) {
    detail.failed = await getImportBookmarksFailed()
  }
  if (remaining) {
    detail.remaining = await getImportBookmarksRemaining()
  }
  console.debug(...logFormat.formatArgs("getImportBookmarksDetail", detail))
  return detail
}

export const updateImportBookmarksDetail = async (
  detail: Partial<ImportBookmarksDetail>
): Promise<boolean> => {
  const summary: ImportBookmarksSummary = {}
  if (detail.inProgress) {
    await updateImportBookmarksInProgress(detail.inProgress)
    summary.inProgressBookmarkCount = detail.inProgress.length
  }
  if (detail.success) {
    await updateImportBookmarksSuccess(detail.success)
    summary.successBookmarkCount = detail.success.length
  }
  if (detail.failed) {
    await updateImportBookmarksFailed(detail.failed)
    summary.failedBookmarkCount = detail.failed.length
  }
  if (detail.remaining) {
    await updateImportBookmarksRemaining(detail.remaining)
    summary.remainingBookmarkCount = detail.remaining.length
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

  console.debug(
    ...logFormat.formatArgs("updateImportBookmarks -> pagesData:", pagesData)
  )

  const bookmarks: BookmarkCreateInputType[] = []

  for (let i = 0; i < inProgressBookmarks.length; i++) {
    const bookmark = inProgressBookmarks[i]
    const pageData = pagesData.find((pageData) => bookmark.url === pageData.url)
    if (pageData) {
      if (pageData.error) {
        bookmark.status = ImportStatus.Failed
        bookmark.lastImportedAt = new Date().getTime()
        failedBookmarks.push(bookmark)
      } else {
        bookmark.status = ImportStatus.Success
        bookmark.lastImportedAt = new Date().getTime()
        successBookmarks.push(bookmark)
        bookmarks.push({
          name: bookmark.title,
          bookmarkTags: bookmark.tags,
          url: pageData.url,
          content: pageData.html,
          raw: pageData.html
        })
      }
    } else {
      bookmark.status = ImportStatus.Ready
      bookmark.lastImportedAt = new Date().getTime()
      remainingBookmarks.push(bookmark)
    }
  }

  // send request to backend
  await createBookmarks(bookmarks)

  await updateImportBookmarksDetail({
    inProgress: [],
    success: successBookmarks,
    failed: failedBookmarks,
    remaining: remainingBookmarks
  })
}

function getBookmarkHash(bookmark: Bookmarks.BookmarkTreeNode) {
  return `${bookmark.id}:${bookmark.url}`
}

function updateImportBookmarkHash(
  importBookmarksHash: object,
  bookmarks: ImportBookmarkRecord[]
) {
  for (let i = 0; i < bookmarks.length; i++) {
    const importBookmark = bookmarks[i]
    importBookmarksHash[getBookmarkHash(importBookmark)] = importBookmark
  }
  return importBookmarksHash
}

// check if there are any new bookmarks and update the import status
export const syncUpWithLatestBookmarks = async () => {
  const bookmarks = await getFlatBookmarks()
  const importBookmarks = await getImportBookmarks()

  const importBookmarksHash: { [key: string]: ImportBookmarkRecord } = {}
  updateImportBookmarkHash(importBookmarksHash, importBookmarks?.inProgress)
  updateImportBookmarkHash(importBookmarksHash, importBookmarks?.success)
  updateImportBookmarkHash(importBookmarksHash, importBookmarks?.failed)
  updateImportBookmarkHash(importBookmarksHash, importBookmarks?.remaining)

  const inProgress = []
  const success = []
  const failed = []
  const remaining = []

  for (let i = 0; i < bookmarks.length; i++) {
    const bookmark = bookmarks[i]
    const importBookmark = importBookmarksHash[getBookmarkHash(bookmark)]

    if (!importBookmark) {
      // new bookmark
      remaining.push(bookmark)
    } else if (importBookmark.status === ImportStatus.Pending) {
      inProgress.push(importBookmark)
    } else if (importBookmark.status === ImportStatus.Success) {
      success.push(importBookmark)
    } else if (importBookmark.status === ImportStatus.Failed) {
      failed.push(importBookmark)
    }
  }

  // update total
  const importBookmarksSummary = {
    lastImportedAt: importBookmarks.lastImportedAt,
    updatedAt: new Date().getTime(),
    status: importBookmarks.status,
    totalBookmarkCount: bookmarks.length,
    inProgressBookmarkCount: inProgress.length,
    successBookmarkCount: success.length,
    failedBookmarkCount: failed.length
  }

  // update storage
  await updateImportBookmarksSummary(importBookmarksSummary)
  await updateImportBookmarksDetail({
    inProgress,
    success,
    failed,
    remaining
  })
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
}): Promise<ImportBookmarksSummary> => {
  if (syncUpBookmarks) {
    await syncUpWithLatestBookmarks()
  }

  // remove `inProgress` put it to `remaining`
  const inProgressBookmarks = await getImportBookmarksInProgress()
  const remainingBookmarks = await getImportBookmarksRemaining()
  const newRemainingBookmarks = remainingBookmarks.concat(inProgressBookmarks)

  await updateImportBookmarksDetail({
    inProgress: [],
    remaining: newRemainingBookmarks
  })

  // update importBookmarksSummary
  await updateImportBookmarksSummary({
    updatedAt: new Date().getTime(),
    inProgressBookmarkCount: 0,
    remainingBookmarkCount: newRemainingBookmarks.length,
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

  const inProgressBookmarks = await getImportBookmarksInProgress()
  const remainingBookmarks = await getImportBookmarksRemaining()
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
    inProgressBookmarkCount: bookmarks.length,
    remainingBookmarkCount: remainingBookmarks.length,
    updatedAt: new Date().getTime()
  })

  await updateImportBookmarksDetail({
    inProgress: bookmarks,
    remaining: remainingBookmarks
  })

  return bookmarks
}

export const stopImportBookmarks = async (): Promise<boolean> => {
  const inProgressBookmarks = await getImportBookmarksInProgress()
  const remainingBookmarks = await getImportBookmarksRemaining()

  remainingBookmarks.concat(
    inProgressBookmarks.map((bookmark) => {
      bookmark.status = undefined
      return bookmark
    })
  )

  await updateImportBookmarksSummary({
    status: ImportStatus.Ready,
    inProgressBookmarkCount: 0,
    remainingBookmarkCount: remainingBookmarks.length,
    updatedAt: new Date().getTime()
  })

  await updateImportBookmarksDetail({
    inProgress: [],
    remaining: remainingBookmarks
  })

  return true
}
