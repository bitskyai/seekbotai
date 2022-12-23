import { browser } from "webextension-polyfill-ts";

console.log("$PLASMO_PUBLIC_SITE_URL");
console.log(process.env);
const urlPattern = {
  // urls: [`${process.env.PLASMO_PUBLIC_SHIP_NAME}/bookmarks/status`]
  urls: [`https://bitsky.ai/apis/bi/bookmarks/status`]
};
browser.webRequest.onBeforeRequest.addListener(
  () => {
    // return {
    //   data: {
    //     url: "test"
    //   }
    // };
    // return {
    //   url: "test",
    //   status: "bookmarked"
    // };
    console.log("test");
  },
  urlPattern,
  ["blocking"]
);
