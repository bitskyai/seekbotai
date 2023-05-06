import {
  BookOutlined,
  FilterOutlined,
  FolderOutlined,
  SettingOutlined,
  TagOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Layout, Menu } from "antd";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { Outlet } from "react-router-dom";
const { Content, Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
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
  const [collapsed, setCollapsed] = React.useState(false);

  const items: MenuItem[] = [
    getItem(t("settings"), "1", <SettingOutlined />),
    getItem(t("sideNav.allBookmarks"), "2", <BookOutlined />),
    getItem(t("sideNav.folders"), "folders", <FolderOutlined />, [
      getItem("Bookmark Bar", "3"),
    ]),
    getItem(t("sideNav.filters.sectionTitle"), "filters", <FilterOutlined />, [
      getItem("Team 1", "6"),
      getItem("Team 2", "8"),
    ]),
    getItem(t("sideNav.tags.sectionTitle"), "tags", <TagOutlined />, [
      getItem("Team 1", "9"),
      getItem("Team 2", "10"),
    ]),
  ];

  return (
    <React.Fragment>
      <Layout hasSider>
        <Sider
          width={"300"}
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          style={{
            overflow: "auto",
            height: "100vh",
            position: "fixed",
            left: 0,
            top: 0,
            bottom: 0,
          }}
        >
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={["4"]}
            items={items}
          />
        </Sider>
        <Layout className="site-layout" style={{ marginLeft: 200 }}>
          <Content>
            <React.Suspense>
              <Outlet />
            </React.Suspense>
          </Content>
        </Layout>
      </Layout>
    </React.Fragment>
  );
}
