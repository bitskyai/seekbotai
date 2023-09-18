import {
  APP_DISPLAY_EXTENSION_SETTINGS_OPTION,
  APP_NAVIGATE_TO_EXTENSION_SETTINGS,
  APP_READY_MESSAGE,
} from "../../../shared";
import { GetTagsDocument, Tag } from "../graphql/generated";
import {
  BookOutlined,
  SettingOutlined,
  TagOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import { useQuery } from "@apollo/client";
import type { MenuProps } from "antd";
import { Layout, Menu, Skeleton } from "antd";
import { ReactNode, Key, Fragment, Suspense, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { NavLink, Outlet } from "react-router-dom";

const { Content, Sider } = Layout;

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
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKeys] = useState([]);
  const [displayExtensionSettings, setDisplayExtensionSettings] =
    useState(false);

  const { loading: fetchTags, data: tagsData } = useQuery(GetTagsDocument);

  const SIDE_NAV_WIDTH = 300;
  const SIDE_COLLAPSED_NAV_WIDTH = 80;

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
  const defaultMenuItem = [
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
  ];
  if (displayExtensionSettings) {
    defaultMenuItem.push(
      getItem(
        <a
          onClick={() => {
            window.parent.postMessage(APP_NAVIGATE_TO_EXTENSION_SETTINGS, "*");
          }}
        >
          {t("extensionSettings")}
        </a>,
        "extensionSettings",
        <SettingOutlined />,
      ),
    );
  }

  const items: MenuItem[] = defaultMenuItem.concat([
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
  ]);

  return (
    <Fragment>
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
            <Suspense>
              <Outlet />
            </Suspense>
          </Content>
        </Layout>
      </Layout>
    </Fragment>
  );
}
