import {init as apisInit} from "~background/modules/apis"
import {init as messagesInit} from "./messages"
import {init as initServiceDiscover} from "./modules/serviceDiscover"

const init = async () => {
  // when background is loaded, init service discover to find the server
  await initServiceDiscover({timeout:1000})
  // init apis
  await apisInit()
  // init messages
  await messagesInit()
}

init()
