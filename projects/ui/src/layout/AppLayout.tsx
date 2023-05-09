import { GetTagsDocument, Tag } from "../graphql/generated";
import { BookOutlined, SettingOutlined, TagOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Layout, Menu, Skeleton } from "antd";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { NavLink, Outlet } from "react-router-dom";
import { useQuery } from "@apollo/client";

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
    <NavLink
      to={`/search?tags=${tag.id}`}
      // className={({ isActive, isPending }) =>
      //   isPending ? "pending" : isActive ? "active" : ""
      // }
    >
      {tag.name}
    </NavLink>,
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
    // getItem(t("sideNav.folders"), "folders", <FolderOutlined />, [
    //   getItem("Bookmark Bar", "3"),
    // ]),
    // getItem(t("sideNav.filters.sectionTitle"), "filters", <FilterOutlined />, [
    //   getItem("Team 1", "6"),
    //   getItem("Team 2", "8"),
    // ]),
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
        <Layout className="site-layout" style={{ marginLeft: SIDE_NAV_WIDTH }}>
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
