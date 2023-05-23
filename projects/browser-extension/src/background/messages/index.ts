export enum MessageSubject {
  getBookmarks = "getBookmarks",
  getBookmarksImportStatus = "getBookmarksImportStatus"
}

export { default as getBookmarksMessageHandler } from "./getBookmarks"
export type { BookmarksMsgRes } from "./getBookmarks"
export { default as getBookmarksImportStatusMessageHandler } from "./getBookmarksImportStatus"
export type { BookmarksImportStatusMsgRes } from "./getBookmarksImportStatus"
