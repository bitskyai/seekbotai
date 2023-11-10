// import { useQuery } from "@apollo/client";
import { Layout } from "antd"
import * as React from "react"
import { Outlet } from "react-router-dom"

const { Content } = Layout

/**
 * The primary application layout.
 */
export function AppLayout(): JSX.Element {
  return (
    <React.Fragment>
      <Layout>
        <Content>
          <React.Suspense>
            <Outlet />
          </React.Suspense>
        </Content>
      </Layout>
    </React.Fragment>
  )
}
