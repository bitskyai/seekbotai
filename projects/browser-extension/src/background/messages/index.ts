export enum MessageSubject {
  getBookmarks = "getBookmarks",
  startImportBookmarks = "startImportBookmarks",
  stopImportBookmarks = "stopImportBookmarks",
  cleanImportBookmarks = "cleanImportBookmarks",
  startImportHistory = "startImportHistory",
  stopImportHistory = "stopImportHistory",
  cleanImportHistory = "cleanImportHistory"
}

export { default as getBookmarksMessageHandler } from "./getBookmarks"
export type { BookmarksMsgRes } from "./getBookmarks"
export { default as getBookmarksImportStatusMessageHandler } from "./getBookmarksImportStatus"
export type { BookmarksImportStatusMsgRes } from "./getBookmarksImportStatus"
