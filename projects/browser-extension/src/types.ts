import { type Bookmarks } from "webextension-polyfill"

export enum ImportStatus {
  Ready = "ready",
  Success = "success",
  Pending = "pending",
  Failed = "failed"
}

export interface ImportBookmarkRecord extends Bookmarks.BookmarkTreeNode {
  lastImportedAt?: number
  status?: ImportStatus
  tags?: string[]
}

export interface ImportBookmarksSummary {
  lastImportedAt?: number
  updatedAt?: number
  status?: ImportStatus
  totalBookmarkCount?: number
  inProgressBookmarkCount?: number
  successBookmarkCount?: number
  failedBookmarkCount?: number
  remainingBookmarkCount?: number
}

export interface ImportBookmarksDetail {
  inProgress?: ImportBookmarkRecord[]
  success?: ImportBookmarkRecord[]
  failed?: ImportBookmarkRecord[]
  remaining?: ImportBookmarkRecord[]
}

export interface ImportBookmarks
  extends ImportBookmarksSummary,
    ImportBookmarksDetail {}

export type MessageResponse<T> = {
  data: T
  status?: number
  statusText?: string
}
