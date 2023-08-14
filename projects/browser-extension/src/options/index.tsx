// import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client"

import { Result } from "antd"
import React from "react"
import { RouterProvider } from "react-router-dom"

import { useStorage } from "@plasmohq/storage/hook"

import { StorageKeys } from "~storage"
import { ServiceStatus } from "~types"

import "./index.css"

import { router } from "./routes"

function Options() {
  const [serviceHealthStatus] = useStorage(StorageKeys.ServiceHealthStatus)

  return (
    <React.StrictMode>
      {serviceHealthStatus !== ServiceStatus.Success ? (
        <div style={{ maxWidth: 650, margin: "0 auto" }}>
          <Result
            status="404"
            title={chrome.i18n.getMessage("serviceNotHealthTitle")}
            subTitle={chrome.i18n.getMessage("serviceNotHealthDetail")}
          />
        </div>
      ) : (
        ""
      )}
      {serviceHealthStatus === ServiceStatus.Success ? (
        <RouterProvider router={router} />
      ) : (
        ""
      )}
    </React.StrictMode>
  )
}

export default Options
