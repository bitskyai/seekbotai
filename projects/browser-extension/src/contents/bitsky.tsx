import { HISTORY_TAG } from "@bitsky/shared"
import cssText from "data-text:~/contents/bitsky.css"
import type { PlasmoCSConfig } from "plasmo"
import { useEffect, useState } from "react"

import { sendToBackground } from "@plasmohq/messaging"

import { type PageCreateOrUpdatePayload } from "~/graphql/generated"
import { MessageSubject } from "~background/messages"
import { LogFormat } from "~helpers/LogFormat"
import { releaseMemory } from "~helpers/util"

const logFormat = new LogFormat("contents/bitsky")

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  run_at: "document_start"
}

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

function extractPageHTML() {
  const currentPageHTML = document.documentElement.outerHTML
  return currentPageHTML
}

const BitskyHelper = () => {
  const AUTO_CLOSE_NOTIFICATION = 5000
  const FREQUENTLY_SAVE_INTERVAL = 5 * 1000

  const [saving, setSaving] = useState(null)
  const [success, setSuccess] = useState(null)
  const [displayNotification, setDisplayNotification] = useState(false)
  let saveIntervalHandler = null
  let hideNotificationHandler = null
  let observer = null
  let _sendLatestPageHandler

  const sendLatestPage = async () => {
    // why use setTimeout?
    // to avoid multiple save in a short time
    clearTimeout(_sendLatestPageHandler)
    _sendLatestPageHandler = setTimeout(async () => {
      try {
        setDisplayNotification(true)
        setSaving(true)
        setSuccess(false)
        // document.body.style.background = "pink" // used for debugging
        // send to background to capture visible tab
        sendToBackground({
          name: MessageSubject.captureVisibleTab
        })

        const currentPageData: PageCreateOrUpdatePayload = {
          title: document.title,
          pageTags: [{ name: HISTORY_TAG }],
          url: window.location.href,
          content: "",
          raw: extractPageHTML() ?? "",
          pageMetadata: {
            bookmarked: false,
            lastVisitTime: new Date().toISOString()
          }
        }

        console.info(
          ...logFormat.formatArgs("currentPageData", currentPageData)
        )
        const pages = [currentPageData]
        // save current page
        await sendToBackground({
          name: MessageSubject.createOrUpdatePages,
          body: pages
        })
        releaseMemory(pages) // release memory
        setSaving(false)
        setSuccess(true)
        clearTimeout(hideNotificationHandler)
        hideNotificationHandler = setTimeout(() => {
          setDisplayNotification(false)
        }, AUTO_CLOSE_NOTIFICATION)
      } catch (err) {
        setSaving(false)
        setSuccess(false)
        clearTimeout(hideNotificationHandler)
        setTimeout(() => {
          setDisplayNotification(false)
          setSaving(null)
          setSuccess(null)
        }, AUTO_CLOSE_NOTIFICATION)
        console.error(err)
      }
    }, 500)
  }

  const setupPageCollect = async () => {
    //==========================================================================
    // Trigger one when setup
    await sendLatestPage()

    //==========================================================================
    // setup observer to listen DOM change
    const bodyNode = document.querySelector("body")
    const config = { childList: true, subtree: true }
    // Callback function to execute when mutations are observed
    const domTreeChangedCallback = () => {
      clearTimeout(saveIntervalHandler)
      saveIntervalHandler = setTimeout(async () => {
        await sendLatestPage()
      }, FREQUENTLY_SAVE_INTERVAL)
    }

    if (observer) {
      observer?.disconnect()
      observer = null
    }
    // Create an observer instance linked to the callback function
    observer = new MutationObserver(domTreeChangedCallback)

    // Start observing the target node for configured mutations
    observer.observe(bodyNode, config)

    //==========================================================================
    // setup window url change event
    // Function to handle URL changes
    const handleUrlChange = async () => {
      await sendLatestPage()
      // You can perform actions based on the URL change here
    }

    // Listen for changes in the page's URL
    window.removeEventListener("hashchange", handleUrlChange)
    window.removeEventListener("popstate", handleUrlChange)
    window.addEventListener("hashchange", handleUrlChange)
    window.addEventListener("popstate", handleUrlChange)
  }

  useEffect(() => {
    console.log(...logFormat.formatArgs("bitsky contents script"))
    let setupedPageCollect = false
    const setupPageCollectHandler = setTimeout(() => {
      console.info(
        ...logFormat.formatArgs(
          "bitsky content script: setupPageCollect through setTimeout"
        )
      )
      setupedPageCollect = true
      setupPageCollect()
    }, FREQUENTLY_SAVE_INTERVAL)
    window.removeEventListener("load", setupPageCollect)
    window.addEventListener("load", async () => {
      console.info(
        ...logFormat.formatArgs("bitsky content script: load event fired")
      )
      clearTimeout(setupPageCollectHandler)
      if (setupedPageCollect) return
      setupPageCollect()
    })
  }, [])

  const logoClass = saving
    ? "bitsky-alert-logo bitsky-loader"
    : "bitsky-alert-logo"

  return (
    <div className="bitsky-root-container">
      <div
        className="bitsky-notification"
        style={{ display: displayNotification ? "block" : "none" }}>
        <div className="bitsky-notification-notice">
          <div className="bitsky-notification-notice-content">
            <div role="alert">
              <div className="bitsky-notification-notice-description">
                <div className="bitsky-title-container">
                  <span>
                    <span className={logoClass}></span>
                  </span>
                  {saving ? (
                    <></>
                  ) : (
                    <span className="bitsky-notification-notice-title">
                      {success
                        ? chrome.i18n.getMessage("saved")
                        : chrome.i18n.getMessage("failed")}
                    </span>
                  )}
                  <a
                    className="bitsky-notification-notice-close"
                    onClick={() => setDisplayNotification(false)}>
                    X
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BitskyHelper
