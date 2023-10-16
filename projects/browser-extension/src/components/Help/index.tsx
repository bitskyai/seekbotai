import "./index.css"

import { QuestionCircleOutlined } from "@ant-design/icons"
import { Tooltip } from "antd"
import React from "react"

export type LogoProps = {
  style?: React.CSSProperties
  i18nKey: string
}

const Logo: React.FC<LogoProps> = ({ i18nKey, style }) => {
  return (
    <span style={{ paddingLeft: 5, ...style }}>
      <Tooltip title={chrome.i18n.getMessage(i18nKey)}>
        <QuestionCircleOutlined />
      </Tooltip>
    </span>
  )
}

export default Logo
