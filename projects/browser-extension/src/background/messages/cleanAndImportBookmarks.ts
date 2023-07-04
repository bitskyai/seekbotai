import type { PlasmoMessaging } from "@plasmohq/messaging"

import { LogFormat } from "~helpers/LogFormat"

import { cleanAndImportBookmarks } from "../modules/imports"

const logFormat = new LogFormat("messages/cleanAndImportBookmarks")

// TODO: Need to improve error handling
const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  console.info(...logFormat.formatArgs("cleanAndImportBookmarks"))
  cleanAndImportBookmarks()
  res.send({
    data: "importing"
  })
}

export default handler
