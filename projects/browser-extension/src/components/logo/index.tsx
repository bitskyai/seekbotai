import { Avatar, Space } from "antd"
import logo from "data-base64:~/assets/icon.svg"

import "./index.css"

function Logo() {
  return (
    <div className="bitsky-logo">
      <Space align="center">
        <Avatar src={<img src={logo} />}></Avatar>
        <a
          className="bitsky-logo-text"
          href="https://www.bitsky.ai"
          target="_blank"
          rel="noreferrer">
          {chrome.i18n.getMessage("extensionName")}
        </a>
      </Space>
    </div>
  )
}

export default Logo
