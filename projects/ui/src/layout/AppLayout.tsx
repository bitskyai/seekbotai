import {
  APP_DISPLAY_EXTENSION_SETTINGS_OPTION,
  APP_NAVIGATE_TO_EXTENSION_SETTINGS,
  APP_READY_MESSAGE,
} from "../../../shared";
import Logo from "../components/logo";
import { SettingOutlined, FileTextOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Layout, Space, Menu } from "antd";
import { ReactNode, Key, Fragment, Suspense, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { NavLink, Outlet } from "react-router-dom";

const { Content, Header } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: ReactNode,
  key: Key,
  icon?: ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

/**
 * The primary application layout.
 */
export function AppLayout(): JSX.Element {
  const { t } = useTranslation();
  const [selectedKeys, setSelectedKeys] = useState(["pages"]);
  const [displayExtensionSettings, setDisplayExtensionSettings] =
    useState(false);

  // TODO: create a common iframe message handler
  // notify iframe parent app is ready to receive messages
  useEffect(() => {
    console.log("app is ready");
    window.parent.postMessage(APP_READY_MESSAGE, "*");
    window.removeEventListener("message", () => console.log("remove message"));
    window.addEventListener("message", function (event) {
      if (event.data === APP_DISPLAY_EXTENSION_SETTINGS_OPTION) {
        setDisplayExtensionSettings(true);
      }
    });
  }, []);
  const items: MenuItem[] = [
    getItem(
      <NavLink to="/search">{t("search.title")}</NavLink>,
      "pages",
      <FileTextOutlined rev={undefined} />,
    ),
    getItem(
      <NavLink to="/settings">{t("settings")}</NavLink>,
      "settings",
      <SettingOutlined rev={undefined} />,
    ),
  ];
  if (displayExtensionSettings) {
    items.push(
      getItem(
        <a
          onClick={() => {
            window.parent.postMessage(APP_NAVIGATE_TO_EXTENSION_SETTINGS, "*");
          }}
        >
          {t("extensionSettings")}
        </a>,
        "extensionSettings",
        <SettingOutlined rev={undefined} />,
      ),
    );
  }

  return (
    <Fragment>
      <Layout>
        <Header
          className="bitsky-header"
          style={{
            display: "flex",
            alignItems: "center",
            height: 48,
            lineHeight: `48px`,
            backgroundColor: "transparent",
            borderBlockEnd: "1px solid rgb(208, 215, 222)",
            padding: "0 16px",
          }}
        >
          <Space>
            <Logo url="/search" />
            <Menu
              theme="light"
              items={items}
              mode="horizontal"
              style={{ width: 230 }}
              defaultSelectedKeys={selectedKeys}
            />
          </Space>
        </Header>
        <Layout>
          <Content>
            <Suspense>
              <Outlet />
            </Suspense>
          </Content>
        </Layout>
      </Layout>
    </Fragment>
  );
}
