import { DEFAULT_SELF_IDENTIFICATION, PORT_RANGE } from "@bitsky/shared"

import { setApolloClientToNull } from "~background/modules/apis"
import { ImportThread } from "~background/modules/imports"
import { LogFormat } from "~helpers/LogFormat"
import {
  getServiceHostName,
  getServicePort,
  getServiceProtocol,
  setServiceDiscoverStatus,
  setServiceHealthStatus,
  setServicePort
} from "~storage"
import { ServiceStatus } from "~types"

import SERVICE_DISCOVER_CONSTANTS from "./constants"

export * from "./constants"

const logFormat = new LogFormat("modules/serviceDiscover")
const _check_service_health_interval_value =
  SERVICE_DISCOVER_CONSTANTS.CHECK_SERVICE_HEALTH_INTERVAL_VALUE // half minutes
let _interval_check_service_health_handler = null
// scan ports to find backend service, if found, return true, otherwise return false
export const discoverService = async (
  timeout = 1000,
  concurrent = 10
): Promise<ServiceStatus> => {
  console.info(...logFormat.formatArgs(`discoverService start`))
  await setServiceDiscoverStatus(ServiceStatus.Checking)
  await setServicePort(null)
  const startTime = Date.now()
  let found = false
  let port = PORT_RANGE[0]
  let jobIndex = 0 // for debug

  const getNextPorts = () => {
    const ports = []
    for (let i = 0; i < concurrent && port <= PORT_RANGE[1]; i++) {
      ports.push(port)
      port++
    }
    return ports
  }
  const protocol = await getServiceProtocol()
  const hostname = await getServiceHostName()

  while (!found && port <= PORT_RANGE[1]) {
    jobIndex++
    const ports = getNextPorts()
    const importThreads = []
    for (let i = 0; i < ports.length; i++) {
      const url = `${protocol}://${hostname}:${ports[i]}/heartbeat`
      console.debug(...logFormat.formatArgs(`jobIndex: ${jobIndex}, url:`, url))
      const importThread = new ImportThread({
        url,
        timeout
      })
      importThreads.push(importThread)
    }
    const pagesData = await Promise.all(
      importThreads.map((thread) => thread.start())
    )

    console.debug(
      ...logFormat.formatArgs(`jobIndex: ${jobIndex}, pagesData:`, pagesData)
    )

    for (let i = 0; i < pagesData.length; i++) {
      const pageData = pagesData[i]
      if (pageData && pageData.content === DEFAULT_SELF_IDENTIFICATION) {
        const url = new URL(pageData.url)
        const port = Number(url.port)
        console.info(
          ...logFormat.formatArgs(
            `Found service: ${pageData.url}, port: ${port}`
          )
        )
        setServicePort(port)
        found = true
        break
      }
    }
  }
  let status = ServiceStatus.Failed
  if (found) {
    status = ServiceStatus.Success
  }

  await setServiceDiscoverStatus(status)

  console.info(
    ...logFormat.formatArgs(
      `discoverService finished, time: ${
        Date.now() - startTime
      }ms, status: ${status}`
    )
  )

  return status
}

export const checkServiceHealth = async (
  timeout = 1000
): Promise<ServiceStatus> => {
  let status = ServiceStatus.Checking
  await setServiceHealthStatus(ServiceStatus.Checking)
  try {
    const startTime = Date.now()
    const protocol = await getServiceProtocol()
    const hostname = await getServiceHostName()
    const port = await getServicePort()

    if (!port) {
      // let us discover service again
      status = await discoverService(timeout)
    } else {
      const url = `${protocol}://${hostname}:${port}/heartbeat`
      console.info(...logFormat.formatArgs(`checkServiceHealth url: ${url}`))
      const importThread = new ImportThread({
        url,
        timeout
      })
      const pageData = await importThread.start()
      if (pageData && pageData.content === DEFAULT_SELF_IDENTIFICATION) {
        status = ServiceStatus.Success
      } else {
        // let us discover service again
        status = await discoverService(timeout)
      }
    }

    await setServiceHealthStatus(status)
    if (status === ServiceStatus.Failed) {
      setApolloClientToNull()
    }
    console.info(
      ...logFormat.formatArgs(
        `checkServiceHealth finished, time: ${Date.now() - startTime}ms`
      )
    )
    return status
  } catch (error) {
    console.error(
      ...logFormat.formatArgs(
        `checkServiceHealth failed, error:${error.message}}`
      )
    )
    await setServiceHealthStatus(ServiceStatus.Failed)
    setApolloClientToNull()
  }
}

export const startIntervalServiceHealthCheck = async (timeout = 1000) => {
  // clear previous interval if it has
  clearInterval(_interval_check_service_health_handler)
  _interval_check_service_health_handler = setInterval(() => {
    checkServiceHealth(timeout)
  }, _check_service_health_interval_value)
  console.info(...logFormat.formatArgs(`startIntervalServiceHealthCheck`))
}

export const stopIntervalServiceHealthCheck = async () => {
  clearInterval(_interval_check_service_health_handler)
  console.info(...logFormat.formatArgs(`stopIntervalServiceHealthCheck`))
}

export const init = async ({ timeout }: { timeout: number }) => {
  console.info(...logFormat.formatArgs(`init`))
  startIntervalServiceHealthCheck(timeout)
}
