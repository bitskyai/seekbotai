import type { PlasmoMessaging } from "@plasmohq/messaging"

import { LogFormat } from "~helpers/LogFormat"

import { stopImportBookmarks } from "../modules/imports"

const logFormat = new LogFormat("messages/stopImportBookmarks")

// TODO: Need to improve error handling
const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  console.info(...logFormat.formatArgs("stopImportBookmarks"))
  stopImportBookmarks()
  res.send({
    data: "stopping"
  })
}

export default handler
