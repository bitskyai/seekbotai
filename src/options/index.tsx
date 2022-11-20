import { Button } from "antd"
import * as React from "react"

import { ThemeProvider } from "~common-ui/theme"

function IndexOption() {
  return (
    <ThemeProvider>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: 16
        }}>
        <h1>
          Welcome to your{" "}
          <a href="https://www.bitsky.ai/">Bookmark Intelligence - bitsky.ai</a>{" "}
          Extension!
        </h1>
        <h2>Options</h2>
        <Button type="primary">Fascinating</Button>
      </div>
    </ThemeProvider>
  )
}

export default IndexOption
