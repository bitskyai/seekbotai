import { type Bookmarks } from "webextension-polyfill"

import type { PlasmoMessaging } from "@plasmohq/messaging"

import { getBookmarks } from "~bookmarks/background"
import { type MessageResponse } from "~types"

export type BookmarksMsgRes = MessageResponse<Bookmarks.BookmarkTreeNode[]>

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const bookmarks = await getBookmarks()
  res.send({
    data: bookmarks
  } as BookmarksMsgRes)
}

export default handler
