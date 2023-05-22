// import { useQuery } from "@apollo/client";
import { ArrowLeftOutlined } from "@ant-design/icons"
import { Button, Layout, Space, Tabs, theme } from "antd"
import { NavLink } from "react-router-dom"

import ExtensionSettingsGeneral from "./general"
import ExtensionSettingsIgnorePatterns from "./ignorePatterns"
import ExtensionSettingsImport from "./importBookmarks"

const { Header, Content } = Layout

export default function ExtensionSettings(): JSX.Element {
  const {
    token: { colorBgContainer }
  } = theme.useToken()

  return (
    <Layout>
      <Header style={{ padding: 0, background: colorBgContainer }}>
        <Space>
          <NavLink to="/">
            <Button
              type="link"
              icon={<ArrowLeftOutlined />}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64
              }}
            />
          </NavLink>
          <span style={{ fontWeight: "bold", fontSize: "16px" }}>
            {chrome.i18n.getMessage("extensionSettingsTitle")}
          </span>
        </Space>
      </Header>
      <Content>
        <Tabs
          tabPosition={"left"}
          items={[
            {
              label: <div>{chrome.i18n.getMessage("generalTitle")}</div>,
              key: "general",
              children: <ExtensionSettingsGeneral />
            },
            {
              label: <div>{chrome.i18n.getMessage("ignorePatternsTitle")}</div>,
              key: "ignorePatterns",
              children: <ExtensionSettingsIgnorePatterns />
            },
            {
              label: <div>{chrome.i18n.getMessage("importTitle")}</div>,
              key: "import",
              children: <ExtensionSettingsImport />
            }
          ]}
        />
      </Content>
    </Layout>
  )
}
