// import { useQuery } from "@apollo/client";

import {
  APP_DISPLAY_EXTENSION_SETTINGS_OPTION,
  APP_NAVIGATE_TO_EXTENSION_SETTINGS,
  APP_READY_MESSAGE,
  DEFAULT_HOST_NAME,
  DEFAULT_PROTOCOL
} from "@bitsky/shared"
import { useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"

import { useStorage } from "@plasmohq/storage/hook"

import { StorageKeys } from "~storage"

export default function Search() {
  const navigate = useNavigate()
  const iframeElem = useRef(null)

  const [protocol] = useStorage(StorageKeys.ServiceProtocol)
  const [hostName] = useStorage(StorageKeys.ServiceHostName)

  const [port] = useStorage(StorageKeys.ServicePort)
  const url = `${protocol ?? DEFAULT_PROTOCOL}://${
    hostName ?? DEFAULT_HOST_NAME
  }:${port}`

  useEffect(() => {
    console.log("search init message listener")
    window.removeEventListener("message", () => console.log("remove message"))
    window.addEventListener("message", function (event) {
      if (event.data === APP_READY_MESSAGE) {
        iframeElem?.current?.contentWindow.postMessage(
          APP_DISPLAY_EXTENSION_SETTINGS_OPTION,
          "*"
        )
      } else if (event.data === APP_NAVIGATE_TO_EXTENSION_SETTINGS) {
        navigate("/settings")
      }
    })
  }, [])

  return (
    <div style={{}}>
      <iframe
        id="test"
        ref={iframeElem}
        src={url}
        className="full-screen"
        style={{ height: window.screen.height }}
      />
    </div>
  )
}
