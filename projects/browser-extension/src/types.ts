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
  lastImportedAt: number
  bookmarks: ImportBookmarkRecord[]
}
