import type { PlasmoMessaging } from "@plasmohq/messaging"

import { stopImportBookmarks } from "~background/modules/imports"
import { LogFormat } from "~helpers/LogFormat"

const logFormat = new LogFormat("messages/stopImportBookmarks")

// TODO: Need to improve error handling
export const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  console.info(...logFormat.formatArgs("stopImportBookmarks"))
  stopImportBookmarks()
  res.send({
    data: "stopping"
  })
}

export default handler
