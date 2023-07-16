import type { PlasmoMessaging } from "@plasmohq/messaging"

import { LogFormat } from "~helpers/LogFormat"

import { stopImportHistory } from "../modules/imports"

const logFormat = new LogFormat("messages/stopImportHistory")

// TODO: Need to improve error handling
const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  console.info(...logFormat.formatArgs("stopImportHistory"))
  stopImportHistory()
  res.send({
    data: "stopping"
  })
}

export default handler
