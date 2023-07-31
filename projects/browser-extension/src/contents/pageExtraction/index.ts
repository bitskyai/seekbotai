import type { PlasmoCSConfig } from "plasmo"

import { sendToBackground } from "@plasmohq/messaging"

import { MessageSubject } from "~background/messages"
import { LogFormat } from "~helpers/LogFormat"

const logFormat = new LogFormat("contents/pageExtraction")
export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  all_frames: true
}

function extractPageHTML() {
  const currentPageHTML = document.documentElement.outerHTML
  // comment to make sure backend get the raw html
  // remove script and style tags
  // currentPageHTML = currentPageHTML.replace(
  //   /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  //   ""
  // )
  // currentPageHTML = currentPageHTML.replace(
  //   /<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi,
  //   ""
  // )
  return currentPageHTML
}

window.addEventListener("load", async () => {
  // document.body.style.background = "pink" // used for debugging
  console.info(...logFormat.formatArgs("DOMContentLoaded event fired"))
  const currentPageData = {
    name: document.title,
    bookmarkTags: ["history"],
    url: window.location.href,
    content: "",
    raw: extractPageHTML() ?? ""
  }

  console.info(...logFormat.formatArgs("currentPageData", currentPageData))
  // save current page
  await sendToBackground({
    name: MessageSubject.createBookmarks,
    body: [currentPageData]
  })
})
