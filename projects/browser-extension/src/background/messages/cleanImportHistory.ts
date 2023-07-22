import type { PlasmoMessaging } from "@plasmohq/messaging"

import { LogFormat } from "~helpers/LogFormat"

import { cleanImportHistory } from "~background/modules/imports"

const logFormat = new LogFormat("messages/cleanImportHistory")

// TODO: Need to improve error handling
export const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  console.info(...logFormat.formatArgs("cleanImportHistory"))
  cleanImportHistory()
  res.send({
    data: "importing"
  })
}

export default handler
