import browser from "webextension-polyfill"
import { type Bookmarks } from "webextension-polyfill"

import { type ImportBookmarkRecord } from "~types"

export async function getBookmarks(): Promise<Bookmarks.BookmarkTreeNode[]> {
  const bookmarks = await browser.bookmarks.getTree()
  return bookmarks
}

function traverseBookmarks(
  flatBookmarks: ImportBookmarkRecord[],
  bookmark: Bookmarks.BookmarkTreeNode,
  tags: string[] = []
): ImportBookmarkRecord | undefined {
  if (!bookmark) {
    return undefined
  }
  if (!bookmark.children || bookmark.children.length === 0) {
    if (!bookmark.url) {
      return undefined
    }
    const importBookmark = {
      ...bookmark,
      tags
    }
    flatBookmarks.push(importBookmark)
    return importBookmark
  }
  if (bookmark.title) {
    tags.push(bookmark.title)
  }

  for (let i = 0; i < bookmark.children.length; i++) {
    traverseBookmarks(flatBookmarks, bookmark.children[i], [...tags])
  }
}

export async function getFlatBookmarks(): Promise<ImportBookmarkRecord[]> {
  const bookmarks = await getBookmarks()
  const flatBookmarks: ImportBookmarkRecord[] = []
  for (let i = 0; i < bookmarks.length; i++) {
    traverseBookmarks(flatBookmarks, bookmarks[i])
  }
  return flatBookmarks
}
