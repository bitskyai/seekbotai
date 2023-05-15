import { GetTagsDocument, Tag } from "../graphql/generated";
import {
  BookOutlined,
  SettingOutlined,
  TagOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import { useQuery } from "@apollo/client";
import type { MenuProps } from "antd";
import { Layout, Menu, Skeleton, Button } from "antd";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { NavLink, Outlet } from "react-router-dom";
import { extensionOptionPage } from "../helpers/utils";

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

function getTagItem(tag: Tag): MenuItem {
  return getItem(
    <NavLink to={`/search?tags=${tag.id}`}>{tag.name}</NavLink>,
    `tag:${tag.id}`,
  );
}

/**
 * The primary application layout.
 */
export function AppLayout(): JSX.Element {
  const { t } = useTranslation();
  const [collapsed, setCollapsed] = React.useState(false);
  const [selectedKeys] = React.useState([]);

  const { loading: fetchTags, data: tagsData } = useQuery(GetTagsDocument);

  const SIDE_NAV_WIDTH = 300;
  const SIDE_COLLAPSED_NAV_WIDTH = 80;

  console.log(`extensionOptionPage: ${extensionOptionPage()}`);

  const items: MenuItem[] = [
    getItem(
      <NavLink
        to="/settings"
        // className={({ isActive, isPending }) =>
        //   isPending ? "pending" : isActive ? "active" : ""
        // }
      >
        {t("settings")}
      </NavLink>,
      "settings",
      <SettingOutlined />,
    ),
    getItem(
      <a
        onClick={() => {
          console.log("click extension settings");
          window.parent.postMessage("/extensionSettings", "*");
        }}
      >
        Extension Settings
      </a>,
      "extensionSettings",
      <SettingOutlined />,
    ),
    // getItem(t("sideNav.folders"), "folders", <FolderOutlined />, [
    //   getItem("Bookmark Bar", "3"),
    // ]),
    getItem(
      t("sideNav.filters.sectionTitle"),
      "filters",
      <FilterOutlined />,
      [
        getItem(
          <NavLink
            to="/search"
            // className={({ isActive, isPending }) =>
            //   isPending ? "pending" : isActive ? "active" : ""
            // }
          >
            {t("sideNav.allBookmarks")}
          </NavLink>,
          "allBookmarks",
          <BookOutlined />,
        ),
      ].concat([]),
    ),
    getItem(
      t("sideNav.tags.sectionTitle"),
      "tags",
      <TagOutlined />,
      fetchTags
        ? [getItem(<Skeleton active />, "tagsSkeleton")]
        : tagsData?.tags?.map((tag) => getTagItem(tag)),
    ),
  ];

  return (
    <React.Fragment>
      <Layout hasSider>
        <Sider
          width={SIDE_NAV_WIDTH}
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
            items={items}
            defaultSelectedKeys={selectedKeys}
          />
        </Sider>
        <Layout
          className="site-layout"
          style={{
            marginLeft: collapsed ? SIDE_COLLAPSED_NAV_WIDTH : SIDE_NAV_WIDTH,
          }}
        >
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
