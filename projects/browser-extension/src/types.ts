import { type Bookmarks } from "webextension-polyfill"

export enum ImportStatus {
  Success = "success",
  Pending = "pending",
  Failed = "failed"
}

export interface ImportBookmarkRecord extends Bookmarks.BookmarkTreeNode {
  lastImportedAt?: number
  status?: ImportStatus
  tags?: string[]
}

export type ImportBookmarks = {
  lastImportedAt?: number
  status?: ImportStatus
  bookmarks: ImportBookmarkRecord[]
}

export type ImportBookmarksStatus = {
  lastImportedAt?: number
  status?: ImportStatus
  total: number
  inProgress: ImportBookmarkRecord[]
  success: ImportBookmarkRecord[]
  failed: ImportBookmarkRecord[]
  remaining: ImportBookmarkRecord[]
}
