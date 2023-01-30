import { sendToBackground } from "@plasmohq/messaging";

import { BookmarksStatusResBody, MESSAGE_NAMES } from "~background";

export const checkWhetherBookmarked = async function checkWhetherBookmarked(
  url: string
): Promise<BookmarksStatusResBody> {
  return sendToBackground({
    name: MESSAGE_NAMES.BOOKMARKS_GET_STATUS,
    body: {
      url
    }
  });
};
