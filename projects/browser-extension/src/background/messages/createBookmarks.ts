import type { PlasmoMessaging } from "@plasmohq/messaging"

import { type CreateBookmarksRes } from "~/graphql/generated"
import { createBookmarks } from "~background/modules/apis"
import { type MessageResponse } from "~types"

export type CreateBookmarksMsgRes = MessageResponse<CreateBookmarksRes[]>

// TODO: Need to improve error handling
export const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const data = await createBookmarks(req.body)
  res.send({
    data
  } as CreateBookmarksMsgRes)
}

export default handler
