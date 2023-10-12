import type { PlasmoMessaging } from "@plasmohq/messaging"

import { whetherIgnore } from "~background/modules/ignoreURLs"
import { type MessageResponse } from "~types"

export type WhetherIgnoreRes = MessageResponse<boolean>

export const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const data = await whetherIgnore(req.body.url)

  res.send({
    data
  } as WhetherIgnoreRes)
}

export default handler
