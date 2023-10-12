import type { PlasmoMessaging } from "@plasmohq/messaging"

import { deleteIgnoreURLs } from "~background/modules/apis"
import { type MessageResponse } from "~types"

export type DeleteIgnoreURLsRes = MessageResponse<boolean>

export const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const data = await deleteIgnoreURLs(req.body?.deleteIgnoreURLs)
  res.send({
    data
  } as DeleteIgnoreURLsRes)
}

export default handler
