import type { PlasmoMessaging } from "@plasmohq/messaging"

import { startImportBookmarks } from "~background/modules/imports"
import { LogFormat } from "~helpers/LogFormat"

const logFormat = new LogFormat("messages/startImportBookmarks")

// TODO: Need to improve error handling
export const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  console.info(...logFormat.formatArgs("startImportBookmarks"))
  startImportBookmarks()
  res.send({
    data: "starting"
  })
}

export default handler
