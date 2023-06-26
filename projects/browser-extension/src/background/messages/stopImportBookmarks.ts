import type { PlasmoMessaging } from "@plasmohq/messaging"

import { stopImportBookmarks } from "../modules/imports"

// TODO: Need to improve error handling
const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  stopImportBookmarks()
  res.send({
    data: "stopping"
  })
}

export default handler
