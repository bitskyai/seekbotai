import { DEFAULT_HOST_NAME, DEFAULT_PROTOCOL } from "@bitsky/shared"
import { Result } from "antd"
import { useRef } from "react"

import { useStorage } from "@plasmohq/storage/hook"

import { StorageKeys } from "~storage"
import { ServiceStatus } from "~types"

import "./style.css"

function IndexNewtab() {
  const iframeElem = useRef(null)
  const [protocol] = useStorage(StorageKeys.ServiceProtocol)
  const [hostName] = useStorage(StorageKeys.ServiceHostName)
  const [serviceHealthStatus] = useStorage(StorageKeys.ServiceHealthStatus)

  const [port] = useStorage(StorageKeys.ServicePort)
  const url = `${protocol ?? DEFAULT_PROTOCOL}://${
    hostName ?? DEFAULT_HOST_NAME
  }:${port}`
  return (
    <div style={{}}>
      {serviceHealthStatus === ServiceStatus.Failed ? (
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
      {serviceHealthStatus !== ServiceStatus.Failed ? (
        <iframe
          id="test"
          ref={iframeElem}
          src={url}
          className="full-screen"
          style={{ height: window.screen.height }}
        />
      ) : (
        ""
      )}
    </div>
  )
}

export default IndexNewtab
