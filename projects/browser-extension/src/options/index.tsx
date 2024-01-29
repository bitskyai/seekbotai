// import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client"

import React, { useEffect, useState } from "react"
import { RouterProvider } from "react-router-dom"

import { useStorage } from "@plasmohq/storage/hook"

import LoseConnection from "~components/LoseConnection"
import { StorageKeys } from "~storage"
import { ServiceStatus } from "~types"

import "./index.css"

import { router } from "./routes"

function Options() {
  const [serviceHealthStatus] = useStorage(StorageKeys.ServiceHealthStatus)
  const [status, setStatus] = useState(ServiceStatus.Failed)

  const getContent = (status) => {
    if (status === ServiceStatus.Failed) {
      return <LoseConnection />
    } else if (status === ServiceStatus.Success) {
      return <RouterProvider router={router} />
    }
  }

  useEffect(() => {
    if (serviceHealthStatus === ServiceStatus.Failed) {
      setStatus(ServiceStatus.Failed)
    } else if (serviceHealthStatus === ServiceStatus.Success) {
      setStatus(ServiceStatus.Success)
    }
  }, [serviceHealthStatus])

  return <React.StrictMode>{getContent(status)}</React.StrictMode>
}

export default Options
