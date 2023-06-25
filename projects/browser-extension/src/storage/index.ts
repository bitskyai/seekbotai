import _ from "lodash"
import { type Bookmarks } from "webextension-polyfill"

import { Storage } from "@plasmohq/storage"

import {
  type BookmarkCreateInputType,
} from "~/graphql/generated"

import { getFlatBookmarks } from "~background/modules/bookmarks"
import { type PageData } from "~background/modules/fetchPage"
import createBookmarks from "~background/apis/createBookmarks"
import {
  type ImportBookmarkRecord,
  type ImportBookmarks,
  type ImportBookmarksDetail,
  type ImportBookmarksSummary,
  ImportStatus
} from "~types"

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

    return importBookmarksSummary
  }

export const updateImportBookmarksSummary = async (summary:Partial<ImportBookmarksSummary>):Promise<Boolean> => {
  const storage = new Storage()
  const importBookmarksSummary = await getImportBookmarksSummary()
  _.merge(importBookmarksSummary, summary)
  await storage.set(StorageKeys.ImportBookmarksSummary, importBookmarksSummary)
  return true;
}

export const getImportBookmarksInProgress = async (): Promise<
  ImportBookmarkRecord[]
> => {
  const storage = new Storage({area: "local"})
  const importBookmarksInProgress =
    ((await storage.get(
      StorageKeys.ImportBookmarksInProgress
    )) as ImportBookmarkRecord[]) ?? []
  return importBookmarksInProgress
}

export const updateImportBookmarksInProgress = async (inProgress: ImportBookmarkRecord[]): Promise<Boolean> => {
  const storage = new Storage({area: "local"})
  await storage.set(StorageKeys.ImportBookmarksInProgress, inProgress??[])
  return true;
}

export const getImportBookmarksSuccess = async (): Promise<
  ImportBookmarkRecord[]
> => {
  const storage = new Storage({area: "local"})
  const ImportBookmarksSuccess =
    ((await storage.get(
      StorageKeys.ImportBookmarksSuccess
    )) as ImportBookmarkRecord[]) ?? []
  return ImportBookmarksSuccess
}

export const updateImportBookmarksSuccess = async (success: ImportBookmarkRecord[]): Promise<Boolean> => {
  const storage = new Storage({area: "local"})
  await storage.set(StorageKeys.ImportBookmarksSuccess, success??[])
  return true;
}

export const getImportBookmarksFailed = async (): Promise<
  ImportBookmarkRecord[]
> => {
  const storage = new Storage({area: "local"})
  const importBookmarksFailed =
    ((await storage.get(
      StorageKeys.ImportBookmarksFailed
    )) as ImportBookmarkRecord[]) ?? []
  return importBookmarksFailed
}

export const updateImportBookmarksFailed = async (failed: ImportBookmarkRecord[]): Promise<Boolean> => {
  const storage = new Storage({area: "local"})
  await storage.set(StorageKeys.ImportBookmarksFailed, failed??[])
  return true;
}

export const getImportBookmarksRemaining = async (): Promise<
  ImportBookmarkRecord[]
> => {
  const storage = new Storage({area: "local"})
  const importBookmarksRemaining =
    ((await storage.get(
      StorageKeys.ImportBookmarksRemaining
    )) as ImportBookmarkRecord[]) ?? []
  return importBookmarksRemaining
}

export const updateImportBookmarksRemaining = async (remaining: ImportBookmarkRecord[]) => {
  const storage = new Storage({area: "local"})
  await storage.set(StorageKeys.ImportBookmarksRemaining, remaining??[])
  return true;
}

export const getImportBookmarksDetail =
  async (): Promise<ImportBookmarksDetail> => {
    const importBookmarksInProgress = await getImportBookmarksInProgress()
    const importBookmarksSuccess = await getImportBookmarksSuccess()
    const importBookmarksFailed = await getImportBookmarksFailed()
    const importBookmarksRemaining = await getImportBookmarksRemaining()
    return {
      inProgress: importBookmarksInProgress,
      success: importBookmarksSuccess,
      failed: importBookmarksFailed,
      remaining: importBookmarksRemaining
    }
  }

export const updateImportBookmarksDetail = async (detail: Partial<ImportBookmarksDetail>):Promise<Boolean> => {
  if(detail.inProgress) {
    await updateImportBookmarksInProgress(detail.inProgress)
  }
  if(detail.success) {
    await updateImportBookmarksSuccess(detail.success)
  }
  if(detail.failed) {
    await updateImportBookmarksFailed(detail.failed)
  }
  if(detail.remaining) {
    await updateImportBookmarksRemaining(detail.remaining)
  }

  return true;
}

export const getImportBookmarks = async (): Promise<ImportBookmarks> => {
  const importBookmarksSummary = await getImportBookmarksSummary()
  const importBookmarksDetail = await getImportBookmarksDetail()

  return {
    ...importBookmarksSummary,
    ...importBookmarksDetail
  } as ImportBookmarks
}

export const updateImportBookmarks = async (
  pagesData: PageData[]
) => {
  const inProgressBookmarks = await getImportBookmarksInProgress()
  const successBookmarks = await getImportBookmarksSuccess()
  const failedBookmarks = await getImportBookmarksFailed()

  const bookmarks:BookmarkCreateInputType[] = []

  for(let i=0;i<pagesData.length;i++) {
    const pageData = pagesData[i]
    const bookmark = inProgressBookmarks.find((bookmark)=>bookmark.url === pageData.url)
    if(bookmark) {
      if(pageData.error) {
        bookmark.status = ImportStatus.Failed
        failedBookmarks.push(bookmark)
      } else {
        bookmark.status = ImportStatus.Success
        successBookmarks.push(bookmark)
        bookmarks.push({
          name: bookmark.title,
          bookmarkTags: bookmark.tags,
          url: pageData.url,
          content: pageData.html,
          raw: pageData.html
        })
      }
    }
  }

  await createBookmarks(bookmarks)

  await updateImportBookmarksDetail({
    inProgress: [],
    success: successBookmarks,
    failed: failedBookmarks
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
  syncUpBookmarks?: Boolean
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
    lastImportedAt: new Date().getTime(),
    updatedAt: new Date().getTime(),
    inProgressBookmarkCount: 0,
    remainingBookmarkCount: newRemainingBookmarks.length,
    status: ImportStatus.Pending
  })
  
  return await getImportBookmarksSummary()
}

export const startImportBookmarks = async ({concurrentBookmarks}: {concurrentBookmarks?: number}):Promise<ImportBookmarkRecord[]> => {
  if(!concurrentBookmarks) {
    concurrentBookmarks = 1
  }

  const inProgressBookmarks = await getImportBookmarksInProgress()
  const remainingBookmarks = await getImportBookmarksRemaining()
  const bookmarks: ImportBookmarkRecord[] = [];
  for(let i = 0; i < concurrentBookmarks && remainingBookmarks.length; i++) {
    const bookmark = remainingBookmarks.shift()
    bookmark.status = ImportStatus.Pending
    bookmark.lastImportedAt = new Date().getTime()
    bookmarks.push(bookmark)
  }

  remainingBookmarks.concat(inProgressBookmarks);

  await updateImportBookmarksSummary({
    status: ImportStatus.Pending,
    inProgressBookmarkCount: bookmarks.length,
    remainingBookmarkCount: remainingBookmarks.length,
    updatedAt: new Date().getTime()
  });

  await updateImportBookmarksDetail({
    inProgress: bookmarks,
    remaining: remainingBookmarks
  });

  return bookmarks;
}
