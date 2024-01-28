import { ApolloClient, type NormalizedCacheObject } from "@apollo/client"

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

let _apolloClient: ApolloClient<NormalizedCacheObject>
let _current_protocol: string
let _current_hostName: string
let _current_port: number
let _current_apiKey: string

const _initApolloClient = async () => {
  const serviceHealthStatus = await getServiceHealthStatus()
  if (serviceHealthStatus == ServiceStatus.Success) {
    const protocol = await getServiceProtocol()
    const hostName = await getServiceHostName()
    const port = await getServicePort()
    const apiKey = await getServiceAPIKey()
    console.debug(
      ...logFormat.formatArgs("current service config", {
        _current_protocol,
        _current_hostName,
        _current_port,
        _current_apiKey
      })
    )
    console.debug(
      ...logFormat.formatArgs("new service config", {
        protocol,
        hostName,
        port,
        apiKey
      })
    )
    if (
      protocol === _current_protocol &&
      hostName === _current_hostName &&
      port === _current_port &&
      apiKey === _current_apiKey &&
      _apolloClient
    ) {
      console.info(
        ...logFormat.formatArgs(
          "_initApolloClient -> service config not changed, skip"
        )
      )
      return
    }
    _apolloClient = await newApolloClient({
      protocol,
      hostName,
      port,
      apiKey
    })
    _current_protocol = protocol
    _current_hostName = hostName
    _current_port = port
    _current_apiKey = apiKey
  } else if (serviceHealthStatus == ServiceStatus.Failed) {
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
  const storage = new Storage({ area: "local" })
  let refreshApolloClientHandler = null
  // refresh apollo client when service config changed, add timeout to avoid refresh too frequently
  const refreshApolloClient = async () => {
    console.info(...logFormat.formatArgs("init -> refreshApolloClient"))
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

export const waitUtilApolloClientReady = async (): Promise<
  ApolloClient<NormalizedCacheObject>
> => {
  if (_apolloClient) {
    return _apolloClient
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
export const getApolloClient = async (): Promise<
  ApolloClient<NormalizedCacheObject>
> => {
  if (!_apolloClient) {
    // if apollo client is not ready, try to init it
    _initApolloClient()
  }
  return _apolloClient
}

// Used when cannot connect to server, we need to set apollo client to null
// like health check
export const setApolloClientToNull = () => {
  _apolloClient = undefined
}
