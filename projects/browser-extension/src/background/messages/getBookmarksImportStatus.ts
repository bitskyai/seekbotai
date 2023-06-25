import type { PlasmoMessaging } from "@plasmohq/messaging"

import { getBookmarksImportStatus } from "~background/modules/imports"
import { type ImportBookmarksDetail, type MessageResponse } from "~types"

export type BookmarksImportStatusMsgRes = MessageResponse<ImportBookmarksDetail>

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  console.log(`getBookmarksImportStatus MessageHandler: `, req)
  const bookmarksImportStatus = await getBookmarksImportStatus()
  res.send({
    data: bookmarksImportStatus
  } as BookmarksImportStatusMsgRes)
}

export default handler
