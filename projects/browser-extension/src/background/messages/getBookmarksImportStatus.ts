import type { PlasmoMessaging } from "@plasmohq/messaging"

import { getImportBookmarks } from "~storage"
import { type ImportBookmarks, type MessageResponse } from "~types"

export type BookmarksImportStatusMsgRes = MessageResponse<ImportBookmarks>

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  console.log(`getBookmarksImportStatus MessageHandler: `, req)
  const bookmarksImportStatus = await getImportBookmarks()
  res.send({
    data: bookmarksImportStatus
  } as BookmarksImportStatusMsgRes)
}

export default handler
