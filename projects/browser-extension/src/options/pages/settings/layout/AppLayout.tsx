// import { useQuery } from "@apollo/client";
import { Layout, Menu } from "antd"
import * as React from "react"
import { NavLink, Outlet } from "react-router-dom"

const { Content, Header } = Layout

/**
 * The primary application layout.
 */
export function AppLayout(): JSX.Element {
  return (
    <React.Fragment>
      <Layout>
        {/* <Header className="header">
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={["2"]}
            items={[]}
          />
        </Header> */}
        <Content>
          <React.Suspense>
            <Outlet />
          </React.Suspense>
        </Content>
      </Layout>
    </React.Fragment>
  )
}
