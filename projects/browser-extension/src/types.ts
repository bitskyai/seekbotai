import { type Bookmarks, type History } from "webextension-polyfill"

export enum ImportStatus {
  Ready = "ready",
  Success = "success",
  Pending = "pending",
  Failed = "failed"
}

export enum ServiceStatus {
  Unknown = "unknown",
  Checking = "checking",
  Success = "success",
  Failed = "failed"
}

export interface ImportHistoryRecord extends History.HistoryItem {
  lastImportedAt?: number
  status?: ImportStatus
  tags?: string[]
  rank?: number
}

export interface ImportBookmarkRecord extends Bookmarks.BookmarkTreeNode {
  lastImportedAt?: number
  status?: ImportStatus
  tags?: string[]
}

export interface ImportSummary {
  lastImportedAt?: number
  updatedAt?: number
  status?: ImportStatus
  totalCount?: number
  inProgressCount?: number
  successCount?: number
  failedCount?: number
  remainingCount?: number
}

export interface ImportDetail<pageType> {
  inProgress?: pageType[]
  success?: pageType[]
  failed?: pageType[]
  remaining?: pageType[]
}

export type ImportHistoryDetail = ImportDetail<ImportHistoryRecord>

export type ImportBookmarksDetail = ImportDetail<ImportBookmarkRecord>

export interface ImportBookmarks extends ImportSummary, ImportBookmarksDetail {}

export interface ImportHistory extends ImportSummary, ImportHistoryDetail {}

export type MessageResponse<T> = {
  data: T
  status?: number
  statusText?: string
}
