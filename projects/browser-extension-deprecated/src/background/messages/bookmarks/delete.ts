import type { PlasmoMessaging } from "@plasmohq/messaging";

import { deleteABookmark } from "~background/storage/collections/bookmarks";

export const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const data = req.body;
  const result = await deleteABookmark(data.url);
  res.send(result);
};

export default handler;
