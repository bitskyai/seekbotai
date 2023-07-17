import type { PlasmoMessaging } from "@plasmohq/messaging"

import { LogFormat } from "~helpers/LogFormat"

import { startImportHistory } from "../modules/imports"

const logFormat = new LogFormat("messages/startImportHistory")

// TODO: Need to improve error handling
const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  console.info(...logFormat.formatArgs("startImportHistory"))
  startImportHistory()
  res.send({
    data: "starting"
  })
}

export default handler
