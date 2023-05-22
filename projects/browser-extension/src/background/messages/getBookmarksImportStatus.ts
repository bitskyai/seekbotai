import type { PlasmoMessaging } from "@plasmohq/messaging"

import { getBookmarksImportStatus } from "~imports/background"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  console.log(`getBookmarksImportStatus MessageHandler: `, req)
  const bookmarksImportStatus = await getBookmarksImportStatus()
  res.send({
    bookmarksImportStatus
  })
}

export default handler
