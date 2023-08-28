import type { PlasmoMessaging } from "@plasmohq/messaging"

import { type CreateOrUpdatePageRes } from "~/graphql/generated"
import { createOrUpdatePages } from "~background/modules/apis"
import { type MessageResponse } from "~types"

export type CreateOrUpdatePageMsgRes = MessageResponse<CreateOrUpdatePageRes[]>

// TODO: Need to improve error handling
export const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const data = await createOrUpdatePages(req.body)
  res.send({
    data
  } as CreateOrUpdatePageMsgRes)
}

export default handler
