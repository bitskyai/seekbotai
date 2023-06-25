import { type Bookmarks } from "webextension-polyfill"

import { Storage } from "@plasmohq/storage"

import fetchPage from "~background/modules/fetchPage"
import {
  getImportBookmarksSummary,
  prepareStartImportBookmarks
} from "~storage"
import { type ImportBookmarksSummary, ImportStatus } from "~types"

export const IMPORT_BOOKMARKS_JOB_TIMEOUT = 1000 * 60 * 60 * 2 // 2 hours
export const PARALLEL_IMPORT_BOOKMARKS_COUNT = 5

const importingBookmarks = false

export const startImportBookmarks = async ({
  forceStart
}: {
  forceStart?: Boolean
}): Promise<Partial<ImportBookmarksSummary>> => {
  const importBookmarksSummary = await getImportBookmarksSummary()

  const importJobRunningTime =
    new Date().getTime() - importBookmarksSummary.lastImportedAt ?? 0

  if (
    forceStart ||
    (importingBookmarks && importJobRunningTime > IMPORT_BOOKMARKS_JOB_TIMEOUT)
  ) {
    await prepareStartImportBookmarks({ syncUpBookmarks: true })
  }

  return importBookmarksSummary
}
