import { sendToBackground } from "@plasmohq/messaging";

import MESSAGE_NAMES from "~packages/helpers/messageNames";

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
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.name === MESSAGE_NAMES.CONTENT_SCRIPTS_GET_PAGE_CONTENT) {
      let title = "";
      const titleMetas = document.querySelectorAll(
        'meta[name*="title"]'
      ) as NodeListOf<HTMLMetaElement>;
      titleMetas.forEach((elm) => {
        if (elm?.content) {
          title = elm.content;
        }
      });

      let description = "";
      let descriptionMetas = document.querySelectorAll(
        'meta[name*="description"]'
      ) as NodeListOf<HTMLMetaElement>;
      descriptionMetas.forEach((elm) => {
        if (elm?.content) {
          description = elm.content;
        }
      });

      if (!description) {
        descriptionMetas = document.querySelectorAll(
          'meta[property*="description"]'
        ) as NodeListOf<HTMLMetaElement>;
        descriptionMetas.forEach((elm) => {
          if (elm?.content) {
            description = elm.content;
          }
        });
      }

      sendResponse({
        name: window.document.title || title,
        description,
        content: window.document.body.innerText,
        url: window.location.href
      });
    }
  });
  await whetherIgnoreCurrentPage();
  // console.log("active tab");
  // chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  //   console.log("content script");
  //   console.log(request);
  //   console.log(sender);
  //   sendResponse({ value: "just for test" });
  // });

  // console.log(`content script innerHTML: `, window.document.body.innerText);
}

init();

export {};
