import type { PlasmoMessaging } from "@plasmohq/messaging";

import { createABookmark } from "~background/storage/collections/bookmarks";

export const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const data = req.body;
  const result = await createABookmark(
    data.url,
    data.name,
    data.content,
    data.description
  );
  res.send(result);
};

export default handler;
