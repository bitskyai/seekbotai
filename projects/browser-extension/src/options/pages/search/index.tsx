// import { useQuery } from "@apollo/client";
import { useRef } from "react"
import { useNavigate } from "react-router-dom"

export default function Search(): JSX.Element {
  const navigate = useNavigate()
  const iframeElem = useRef(null)

  window.removeEventListener("message", () => console.log("remove message"))
  window.addEventListener("message", function (event) {
    // if (event.origin != 'http://javascript.info') {
    //   // something from an unknown domain, let's ignore it
    //   return;
    // }
    navigate("/settings")
    // can message back using event.source.postMessage(...)
  })

  return (
    <div style={{}}>
      <iframe
        id="test"
        ref={iframeElem}
        src="http://localhost:5173"
        className="full-screen"
        style={{ height: window.screen.height }}
        onLoad={() => {
          console.log("loaded")
          console.log(iframeElem)
          iframeElem.current.contentWindow.postMessage(
            "displaySettingsOptions",
            "*"
          )
        }}
      />
    </div>
  )
}
