import type { PlasmoMessaging } from "@plasmohq/messaging"

import { type PageCreateOrUpdatePayload } from "~/graphql/generated"
import { createOrUpdatePages } from "~background/modules/apis"
import { LogFormat } from "~helpers/LogFormat"

const logFormat = new LogFormat("messages/captureVisibleTab")

const captureVisibleActiveTab = async (
  tab: chrome.tabs.Tab,
  onlyOnComplete = true
) => {
  if ((tab?.status === "complete" || !onlyOnComplete) && tab?.active) {
    try {
      const activeTab = tab
      const activeWindowId = activeTab?.windowId
      const tabUrl = activeTab?.url
      console.log(
        ...logFormat.formatArgs(
          `captureVisibleActiveTab, active: windowId: ${activeWindowId}, tabId: ${activeTab?.id}, url: ${tabUrl}, title: ${activeTab?.title}`
        )
      )
      const imageBase64 = await chrome.tabs.captureVisibleTab(activeWindowId, {
        format: "png"
      })
      const currentPageData: PageCreateOrUpdatePayload = {
        url: tabUrl,
        title: activeTab?.title,
        icon: activeTab?.favIconUrl,
        screenshot: imageBase64
      }
      await createOrUpdatePages([currentPageData])
    } catch (e) {
      console.warn(
        ...logFormat.formatArgs("captureVisibleActiveTab, error: ", e)
      )
    }
  }
}

export const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const windowId = req?.sender?.tab?.windowId
  const tabId = req?.sender?.tab?.id
  const originalUrl = req?.sender?.tab?.url
  console.log(
    ...logFormat.formatArgs(
      `captureVisibleTab, original: windowId: ${windowId}, tabId: ${tabId}, url: ${originalUrl}`
    )
  )
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true })
  if (!tabs || !tabs[0]) {
    console.warn(...logFormat.formatArgs("captureVisibleTab, tabs: ", tabs))
    res.send({
      data: {}
    })
    return
  }

  await captureVisibleActiveTab(tabs[0], false)
  res.send({
    data: {
      windowId,
      tabId
    }
  })
}

const listenTabActivated = () => {
  chrome.tabs.onActivated.addListener(async (activeInfo) => {
    console.log(...logFormat.formatArgs("onActivated: ", activeInfo))
    const tab = await chrome.tabs.get(activeInfo.tabId)
    await captureVisibleActiveTab(tab)
  })
}

listenTabActivated()

export default handler
