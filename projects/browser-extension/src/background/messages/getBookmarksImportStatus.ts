import type { PlasmoMessaging } from "@plasmohq/messaging"

import { getBookmarksImportStatus } from "~imports/background"
import { type ImportBookmarksStatus, type MessageResponse } from "~types"

export type BookmarksImportStatusMsgRes = MessageResponse<ImportBookmarksStatus>

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  console.log(`getBookmarksImportStatus MessageHandler: `, req)
  const bookmarksImportStatus = await getBookmarksImportStatus()
  res.send({
    data: bookmarksImportStatus
  } as BookmarksImportStatusMsgRes)
}

export default handler
