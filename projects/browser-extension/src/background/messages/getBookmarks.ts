import { type Bookmarks } from "webextension-polyfill"

import type { PlasmoMessaging } from "@plasmohq/messaging"

import { getBookmarks } from "~background/modules/bookmarks"
import { type MessageResponse } from "~types"

export type BookmarksMsgRes = MessageResponse<Bookmarks.BookmarkTreeNode[]>

export const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const bookmarks = await getBookmarks()
  res.send({
    data: bookmarks
  } as BookmarksMsgRes)
}

export default handler
