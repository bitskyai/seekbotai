import type { PlasmoMessaging } from "@plasmohq/messaging"

import { type CreateBookmarksRes } from "~/graphql/generated"
import { type MessageResponse } from "~types"

import createBookmarks from "../apis/createBookmarks"

export type CreateBookmarksMsgRes = MessageResponse<CreateBookmarksRes[]>

// TODO: Need to improve error handling
const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const data = await createBookmarks(req.body)
  res.send({
    data
  } as CreateBookmarksMsgRes)
}

export default handler
