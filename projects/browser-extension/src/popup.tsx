import {
  // BookOutlined,
  QuestionCircleOutlined,
  SaveOutlined,
  SearchOutlined,
  SettingOutlined
} from "@ant-design/icons"
import { Button, List, Tooltip, Typography } from "antd"

// import { useState } from "react"

import Logo from "~/components/logo"

import "./popup.style.css"

const { Text } = Typography

function IndexPopup() {
  // const [data, setData] = useState("")

  const menuData = [
    {
      title: (
        <div>
          {chrome.i18n.getMessage("searchTitle")}
          {/* <div style={{ float: "right" }}>
            <Text code>⌘(Cmd)</Text>+<Text code>⌥(Option)</Text>+
            <Text code>f</Text>
          </div> */}
        </div>
      ),
      description: chrome.i18n.getMessage("searchDescription"),
      key: "search",
      icon: <SearchOutlined style={{ fontSize: "18px" }} />
    }
    // {
    //   title: (
    //     <div>
    //       {chrome.i18n.getMessage("savePageTitle")}
    //       {/* <div style={{ float: "right" }}>
    //         <Text code>⌘(Cmd)</Text>+<Text code>⌥(Option)</Text>+
    //         <Text code>s</Text>
    //       </div> */}
    //     </div>
    //   ),
    //   description: chrome.i18n.getMessage("savePageDescription"),
    //   key: "savePage",
    //   icon: <SaveOutlined style={{ fontSize: "18px" }} />
    // }
    // {
    //   title: (
    //     <div>
    //       {chrome.i18n.getMessage("bookmarkPageTitle")}
    //       <div style={{ float: "right" }}>
    //         <Text code>⌘(Cmd)</Text>+<Text code>⌥(Option)</Text>+
    //         <Text code>b</Text>
    //       </div>
    //     </div>
    //   ),
    //   description: chrome.i18n.getMessage("bookmarkPageDescription"),
    //   key: "bookmarkPage",
    //   icon: <BookOutlined style={{ fontSize: "18px" }} />
    // }
  ]

  const onClickAction = (key: string) => {
    if (key === "search") {
      window.open("/options.html#/search", "_blank")
    }
  }

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
                <Button
                  type="link"
                  href="options.html#/settings"
                  target="_blank"
                  icon={<SettingOutlined />}></Button>
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
          <List.Item
            key={item.key}
            onClick={() => onClickAction(item.key)}
            className="bitsky-popup-list-item actionable">
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
