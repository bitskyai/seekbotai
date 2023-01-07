import { sendToActiveContentScript } from "@plasmohq/messaging";

import logger from "./helpers/logger";
import DB from "./storage";

// define the message name for @plasmohq/messaging
export const MESSAGE_NAMES = {
  BOOKMARKS_GET_STATUS: "bookmarks/status",
  PREFERENCES_WHETHER_IGNORE_CURRENT_PAGE:
    "preferences/whetherIgnoreCurrentPage"
};

// const getActiveTab = async () => {
//   const [tab] = await chrome.tabs.query({
//     active: true,
//     currentWindow: true
//   });
//   return tab;
// };

async function init() {
  try {
    await DB();

    // test sendToActiveContentScript
    let eventHandler;
    setInterval(async () => {
      if (!eventHandler) {
        try {
          eventHandler = true;
          console.log("send to cs");
          const result = await sendToActiveContentScript({
            name: "getContent",
            body: {
              data: "test"
            }
          });
          eventHandler = false;
          console.log("result: ", result);
        } catch (err) {
          console.error(err);
          eventHandler = false;
        }
      }
    }, 5 * 1000);
  } catch (err) {
    logger.error("init background failed. ", err);
  }
}

init();

export default {};
