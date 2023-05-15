// import { useQuery } from "@apollo/client";
import { useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"

import {
  APP_DISPLAY_EXTENSION_SETTINGS_OPTION,
  APP_NAVIGATE_TO_EXTENSION_SETTINGS,
  APP_READY_MESSAGE
} from "../../../../../shared/constants"

export default function Search() {
  const navigate = useNavigate()
  const iframeElem = useRef(null)

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
        src="http://localhost:5173"
        className="full-screen"
        style={{ height: window.screen.height }}
      />
    </div>
  )
}
