import type { PlasmoMessaging } from "@plasmohq/messaging"

import { getBookmarks } from "~bookmarks/background"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const bookmarks = await getBookmarks()
  res.send({
    bookmarks
  })
}

export default handler
