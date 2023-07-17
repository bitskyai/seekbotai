import { useState } from "react"

import "./style.css"

function IndexNewtab() {
  const [data, setData] = useState("")

  return (
    <div style={{}}>
      <iframe
        src="http://localhost:5173"
        className="full-screen"
        style={{ height: window.screen.height }}
      />
    </div>
  )
}

export default IndexNewtab
