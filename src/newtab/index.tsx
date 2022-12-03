import { Button, DatePicker, Space } from "antd";
// import { useState } from "react"
import React from "react";

import { ThemeProvider } from "~packages/antd-theme";

function IndexNewtab() {
  // const [data, setData] = useState("")

  return (
    <ThemeProvider>
      <div
        className="new-tab"
        style={{
          padding: 16,
          display: "flex",
          flexDirection: "column"
        }}>
        <h1>
          Welcome to your{" "}
          <a href="https://www.bitsky.ai/">Bookmark Intelligence - bitsky.ai</a>{" "}
          Extension!
        </h1>
        <h2>New Tab</h2>
        <Button type="primary">Hello World - Bookmark Intelligence</Button>

        <Space direction="vertical" style={{ width: "100%" }}>
          <DatePicker status="error" style={{ width: "100%" }} />
          <DatePicker status="warning" style={{ width: "100%" }} />
          <DatePicker.RangePicker status="error" style={{ width: "100%" }} />
          <DatePicker.RangePicker status="warning" style={{ width: "100%" }} />
        </Space>
      </div>
    </ThemeProvider>
  );
}

export default IndexNewtab;
