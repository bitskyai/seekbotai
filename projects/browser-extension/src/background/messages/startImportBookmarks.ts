import type { PlasmoMessaging } from "@plasmohq/messaging"

import { LogFormat } from "~helpers/LogFormat"

import { startImportBookmarks } from "../modules/imports"

const logFormat = new LogFormat("messages/startImportBookmarks")

// TODO: Need to improve error handling
const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  console.info(...logFormat.formatArgs("startImportBookmarks"))
  startImportBookmarks()
  res.send({
    data: "starting"
  })
}

export default handler
