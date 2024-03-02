// import { useQuery } from "@apollo/client";

import { IpcEvents } from "../../ipc-events";
import ipcRendererManager from "../ipc";
import { DashboardOutlined, SearchOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Layout, Menu, Tooltip, theme } from "antd";
import React, { Fragment, Key, ReactNode, Suspense, useEffect } from "react";
import { NavLink, Outlet } from "react-router-dom";
import "./AppLayout.css";

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

/**
 * The primary application layout.
 */
export function AppLayout(): JSX.Element {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const items: MenuItem[] = [
    getItem(
      <Tooltip title="Check all the services status, connected SeekBot browser extension">
        <NavLink to="/">{"Dashboard"}</NavLink>
      </Tooltip>,
      "dashboard",
      <DashboardOutlined rev={undefined} />,
    ),
    getItem(
      <Tooltip title="Search collected browser pages. You also can use SeekBot browser extension to search">
        <NavLink>{"Search"}</NavLink>
      </Tooltip>,
      "search",
      <SearchOutlined rev={undefined} />,
    ),
    // getItem(
    //   <NavLink to="/settings">{"Settings"}</NavLink>,
    //   "settings",
    //   <SettingOutlined rev={undefined} />,
    // ),
  ];

  const clickMenu = (e: any) => {
    if (e.key === "search") {
      e?.domEvent?.preventDefault();
      ipcRendererManager.sendSync(IpcEvents.SYNC_OPEN_SEARCH_WINDOW);
    }
  };

  useEffect(() => {
    // Set the body's height to the browser's height on mount
    document.body.style.height = `${window.innerHeight}px`;

    // Update the body's height on window resize
    const handleResize = () => {
      document.body.style.height = `${window.innerHeight}px`;
    };

    window.addEventListener("resize", handleResize);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []); // Empty dependency array to run the effect only once on mount

  return (
    <Fragment>
      <Layout className="full-height">
        <Sider
          breakpoint="lg"
          collapsedWidth="0"
          onBreakpoint={(broken) => {
            console.log(broken);
          }}
          onCollapse={(collapsed, type) => {
            console.log(collapsed, type);
          }}
        >
          <div className="demo-logo-vertical" />
          <Menu
            theme="dark"
            mode="inline"
            onClick={clickMenu}
            defaultSelectedKeys={["dashboard"]}
            items={items}
          />
        </Sider>
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
