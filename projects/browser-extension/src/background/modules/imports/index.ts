import { type Bookmarks } from "webextension-polyfill"

import { Storage } from "@plasmohq/storage"

import { getFlatBookmarks } from "~background/modules/bookmarks"
import {
  type ImportBookmarks,
  type ImportBookmarksStatus,
  ImportStatus
} from "~types"

function getBookmarkHash(bookmark: Bookmarks.BookmarkTreeNode) {
  return `${bookmark.id}:${bookmark.url}`
}

export const getBookmarksImportStatus =
  async (): Promise<ImportBookmarksStatus> => {
    const bookmarks = await getFlatBookmarks()
    const storage = new Storage()
    const importBookmarks = ((await storage.get(
      "importBookmarks"
    )) as ImportBookmarks) ?? { bookmarks: [] }

    const inProgress = []
    const success = []
    const failed = []
    const remaining = []

    const importBookmarksHash = {}
    for (let i = 0; i < importBookmarks.bookmarks.length; i++) {
      const importBookmark = importBookmarks.bookmarks[i]
      importBookmarksHash[getBookmarkHash(importBookmark)] = importBookmark
    }

    for (let i = 0; i < bookmarks.length; i++) {
      const bookmark = bookmarks[i]
      const importBookmark = importBookmarksHash[getBookmarkHash(bookmark)]

      if (!importBookmark) {
        remaining.push(bookmark)
      } else if (importBookmark.status === ImportStatus.Pending) {
        inProgress.push(bookmark)
      } else if (importBookmark.status === ImportStatus.Success) {
        success.push(bookmark)
      } else if (importBookmark.status === ImportStatus.Failed) {
        failed.push(bookmark)
      }
    }

    return {
      lastImportedAt: importBookmarks.lastImportedAt,
      status: importBookmarks.status,
      total: bookmarks.length,
      inProgress: inProgress,
      success: success,
      failed: failed,
      remaining: remaining
    }
  }
