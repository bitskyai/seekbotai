import { Storage } from "@plasmohq/storage"

import { getFlatBookmarks } from "~bookmarks/background"
import { type ImportBookmarks } from "~types"

export const getBookmarksImportStatus = async () => {
  const bookmarks = await getFlatBookmarks()
  console.log(`flatBookmarks:`, bookmarks)
  const storage = new Storage()
  const importBookmarks = (await storage.get(
    "importBookmarks"
  )) as ImportBookmarks
}
