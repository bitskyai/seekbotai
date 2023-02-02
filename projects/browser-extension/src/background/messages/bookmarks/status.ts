import type { PlasmoMessaging } from "@plasmohq/messaging";

import { checkWhetherBookmarked } from "~background/storage/collections/bookmarks";

export const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  console.log(`url:`, req.body.url);
  const status = await checkWhetherBookmarked(req.body.url);
  res.send({
    status
  });
};

export type BookmarksStatusResBody = {
  status: boolean;
};

export default handler;
