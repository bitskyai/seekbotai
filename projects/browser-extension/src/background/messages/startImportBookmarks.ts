import type { PlasmoMessaging } from "@plasmohq/messaging"
import {startImportBookmarks} from "../modules/imports"

// TODO: Need to improve error handling
const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  startImportBookmarks()
  res.send({
    data: "starting"
  })
}

export default handler
