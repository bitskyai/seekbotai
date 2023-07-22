import { Storage } from "@plasmohq/storage"

import { LogFormat } from "~helpers/LogFormat"
import { newApolloClient } from "~helpers/apolloClientFactory"
import {
  StorageKeys,
  getServiceAPIKey,
  getServiceHostName,
  getServicePort,
  getServiceProtocol
} from "~storage"

const logFormat = new LogFormat("apis/apolloClient")

let _apolloClient = null

const _initApolloClient = async () => {
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
}

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
    [StorageKeys.ServiceAPIKey]: refreshApolloClient,
    [StorageKeys.ServiceHostName]: refreshApolloClient,
    [StorageKeys.ServicePort]: refreshApolloClient,
    [StorageKeys.ServiceProtocol]: refreshApolloClient
  }
  storage.watch(storageWatchList)
  console.info(...logFormat.formatArgs("init finished"))
}

const waitUtilApolloClientReady = async () => {
  if (_apolloClient) {
    return true
  }
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      if (_apolloClient) {
        clearInterval(interval)
        resolve(true)
      }
    }, 100)
  })
}

// what happens if apollo client is not ready for a long time?
// since background cannot show UI, we can only log error
// UI also need to listen to `storageWatchList` to give user feedback
export const getApolloClient = async () => {
  await waitUtilApolloClientReady()
  return _apolloClient
}
