import logo from "data-base64:~/assets/icon.svg"
import cssText from "data-text:~/contents/bitsky.css"
import type { PlasmoCSConfig } from "plasmo"
import { useEffect, useState } from "react"

import { sendToBackground } from "@plasmohq/messaging"

import { MessageSubject } from "~background/messages"
import { LogFormat } from "~helpers/LogFormat"

const logFormat = new LogFormat("contents/bitsky")

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"]
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
  const [saving, setSaving] = useState(null)
  const [success, setSuccess] = useState(null)
  const [displayNotification, setDisplayNotification] = useState(false)
  let hideNotificationHandler = null
  const AUTO_CLOSE_NOTIFICATION = 5000

  useEffect(() => {
    window.addEventListener("load", async () => {
      try {
        setDisplayNotification(true)
        setSaving(true)
        setSuccess(false)
        // document.body.style.background = "pink" // used for debugging
        console.info(...logFormat.formatArgs("DOMContentLoaded event fired"))
        const currentPageData = {
          name: document.title,
          bookmarkTags: ["history"],
          url: window.location.href,
          content: "",
          raw: extractPageHTML() ?? ""
        }

        console.info(
          ...logFormat.formatArgs("currentPageData", currentPageData)
        )
        // save current page
        await sendToBackground({
          name: MessageSubject.createBookmarks,
          body: [currentPageData]
        })
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
                    <span
                      className={logoClass}
                      style={{ backgroundImage: `url(${logo})` }}></span>
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
