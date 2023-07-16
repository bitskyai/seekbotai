import type { PlasmoMessaging } from "@plasmohq/messaging"

import { LogFormat } from "~helpers/LogFormat"

import { cleanImportBookmarks } from "../modules/imports"

const logFormat = new LogFormat("messages/cleanImportBookmarks")

// TODO: Need to improve error handling
const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  console.info(...logFormat.formatArgs("cleanImportBookmarks"))
  cleanImportBookmarks()
  res.send({
    data: "importing"
  })
}

export default handler
