import { Storage } from "@plasmohq/storage"

import { LogFormat } from "~helpers/LogFormat"
import { newApolloClient } from "~helpers/apolloClientFactory"
import {
  StorageKeys,
  getServiceAPIKey,
  getServiceHealthStatus,
  getServiceHostName,
  getServicePort,
  getServiceProtocol
} from "~storage"
import { ServiceStatus } from "~types"

const logFormat = new LogFormat("apis/apolloClient")

let _apolloClient = undefined

const _initApolloClient = async () => {
  const serviceHealthStatus = await getServiceHealthStatus()
  if (serviceHealthStatus == ServiceStatus.Success) {
    const protocol = await getServiceProtocol()
    const hostName = await getServiceHostName()
    const port = await getServicePort()
    const apiKey = await getServiceAPIKey()
    _apolloClient = await newApolloClient({
      protocol,
      hostName,
      port,
      apiKey
    })
  } else {
    _apolloClient = undefined
  }
}

/**
 * Init apollo client and watch following storage keys:
 * 1. StorageKeys.ServiceAPIKey
 * 2. StorageKeys.ServiceHostName
 * 3. StorageKeys.ServicePort
 * 4. StorageKeys.ServiceProtocol
 * if any key changed, refresh apollo client
 */
export const init = async () => {
  // try to init apollo client
  await _initApolloClient()

  // watch service config change
  const storage = new Storage()
  let refreshApolloClientHandler = null
  // refresh apollo client when service config changed, add timeout to avoid refresh too frequently
  const refreshApolloClient = async () => {
    console.info(...logFormat.formatArgs("init -> refreshApolloClient"))
    _apolloClient = null
    clearTimeout(refreshApolloClientHandler)
    refreshApolloClientHandler = setTimeout(async () => {
      await _initApolloClient()
    }, 500)
  }

  const storageWatchList = {
    [StorageKeys.ServiceHealthStatus]: refreshApolloClient,
    [StorageKeys.ServiceAPIKey]: refreshApolloClient,
    [StorageKeys.ServiceHostName]: refreshApolloClient,
    [StorageKeys.ServicePort]: refreshApolloClient,
    [StorageKeys.ServiceProtocol]: refreshApolloClient
  }
  storage.watch(storageWatchList)
  console.info(...logFormat.formatArgs("init finished"))
}

export const waitUtilApolloClientReady = async () => {
  if (_apolloClient) {
    return true
  }
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      if (_apolloClient) {
        clearInterval(interval)
        resolve(_apolloClient)
      }
    }, 100)
  })
}

// what happens if apollo client is not ready for a long time?
// since background cannot show UI, we can only log error
// UI also need to listen to `storageWatchList` to give user feedback
export const getApolloClient = async () => {
  // await waitUtilApolloClientReady()
  return _apolloClient
}

// Used when cannot connect to server, we need to set apollo client to null
// like health check
export const setApolloClientToNull = () => {
  _apolloClient = undefined
}
