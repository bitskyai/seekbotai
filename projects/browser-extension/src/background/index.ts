import { init as messagesInit } from "~background/messages"
import { init as apisInit } from "~background/modules/apis"
import { init as initBackgroundSyncUp } from "~background/modules/backgroundSyncUp"
import { init as initServiceDiscover } from "~background/modules/serviceDiscover"
import { LogFormat } from "~helpers/LogFormat"

const logFormat = new LogFormat("background")

const init = async () => {
  console.info(...logFormat.formatArgs("init"))

  // when background is loaded, init service discover to find the server
  await initServiceDiscover({ timeout: 1000 })
  // init apis
  await apisInit()
  // init messages
  await messagesInit()
  // init background sync up
  await initBackgroundSyncUp()
}

init()
