import {
  BookOutlined,
  QuestionCircleOutlined,
  SaveOutlined,
  SearchOutlined,
  SettingOutlined
} from "@ant-design/icons"
import { Button, Divider, List, Tooltip, Typography } from "antd"
import { useState } from "react"

import Logo from "~/components/logo"

import "./popup.style.css"

const { Text } = Typography

function IndexPopup() {
  const [data, setData] = useState("")

  const menuData = [
    {
      title: (
        <div>
          {chrome.i18n.getMessage("searchTitle")}
          <div style={{ float: "right" }}>
            <Text code>⌘(Cmd)</Text>+<Text code>⌥(Option)</Text>+
            <Text code>f</Text>
          </div>
        </div>
      ),
      description: chrome.i18n.getMessage("searchDescription"),
      icon: <SearchOutlined style={{ fontSize: "18px" }} />
    },
    {
      title: (
        <div>
          {chrome.i18n.getMessage("savePageTitle")}
          <div style={{ float: "right" }}>
            <Text code>⌘(Cmd)</Text>+<Text code>⌥(Option)</Text>+
            <Text code>s</Text>
          </div>
        </div>
      ),
      description: chrome.i18n.getMessage("savePageDescription"),
      icon: <SaveOutlined style={{ fontSize: "18px" }} />
    },
    {
      title: (
        <div>
          {chrome.i18n.getMessage("bookmarkPageTitle")}
          <div style={{ float: "right" }}>
            <Text code>⌘(Cmd)</Text>+<Text code>⌥(Option)</Text>+
            <Text code>b</Text>
          </div>
        </div>
      ),
      description: chrome.i18n.getMessage("bookmarkPageDescription"),
      icon: <BookOutlined style={{ fontSize: "18px" }} />
    }
  ]

  return (
    <div style={{ minWidth: 450 }}>
      <List
        className="bitsky-popup-list"
        size="large"
        header={
          <div>
            <Logo />
            <div className="toolbar" style={{ float: "right" }}>
              <Tooltip title={chrome.i18n.getMessage("questionTooltip")}>
                <Button
                  type="link"
                  href="https://docs.bitsky.ai/"
                  target="_blank"
                  icon={<QuestionCircleOutlined />}></Button>
              </Tooltip>
              <Tooltip title={chrome.i18n.getMessage("settingsTooltip")}>
                <Button type="link" icon={<SettingOutlined />}></Button>
              </Tooltip>
            </div>
          </div>
        }
        footer={
          <div style={{ textAlign: "right" }}>
            <Text strong type="secondary">
              {chrome.i18n.getMessage("slogon")}
            </Text>
          </div>
        }
        bordered
        dataSource={menuData}
        renderItem={(item) => (
          <List.Item className="bitsky-popup-list-item actionable">
            <List.Item.Meta
              className="actionable"
              avatar={item.icon}
              title={item.title}
              description={item.description}
            />
          </List.Item>
        )}
      />
    </div>
  )
}

export default IndexPopup
