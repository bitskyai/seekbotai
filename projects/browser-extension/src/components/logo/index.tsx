import { Avatar, Space } from "antd"
import logo from "data-base64:~/assets/icon.svg"

import "./index.css"

function Logo() {
  return (
    <div className="bitsky-logo">
      <a
        className="bitsky-logo-text"
        href="https://www.bitsky.ai"
        target="_blank"
        rel="noreferrer">
        <Space align="center">
          <Avatar src={<img src={logo} />}></Avatar>
          {chrome.i18n.getMessage("extensionName")}
        </Space>
      </a>
    </div>
  )
}

export default Logo
