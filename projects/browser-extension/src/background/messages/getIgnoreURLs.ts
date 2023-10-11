import type { PlasmoMessaging } from "@plasmohq/messaging"

import { type IgnoreUrl } from "~/graphql/generated"
import { getIgnoreURLs } from "~background/modules/apis"
import { type MessageResponse } from "~types"

export type GetIgnoreURLsRes = MessageResponse<IgnoreUrl[]>

// TODO: Need to improve error handling
export const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const data = await getIgnoreURLs()
  res.send({
    data
  } as GetIgnoreURLsRes)
}

export default handler
