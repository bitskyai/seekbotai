import { sendToBackground } from "@plasmohq/messaging";

import { MESSAGE_NAMES } from "~background";

// async function getPageStructureData() {}

async function whetherIgnoreCurrentPage() {
  const data = await sendToBackground({
    name: MESSAGE_NAMES.PREFERENCES_WHETHER_IGNORE_CURRENT_PAGE,
    body: {
      url: "http://bitsky.ai"
    }
  });
  console.log(`whetherIgnoreCurrentPage:`, data);
  return data;
}

async function init() {
  await whetherIgnoreCurrentPage();
  console.log("active tab");
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("content script");
    console.log(request);
    console.log(sender);
    sendResponse({ value: "just for test" });
  });
}

init();

export {};
