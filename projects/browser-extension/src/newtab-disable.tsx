import { DEFAULT_HOST_NAME, DEFAULT_PROTOCOL } from "@bitsky/shared"
import { Result } from "antd"
import { useRef } from "react"

import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

import { StorageKeys } from "~storage"
import { ServiceStatus } from "~types"

import "./style.css"

function IndexNewtab() {
  const iframeElem = useRef(null)
  const [protocol] = useStorage({
    key: StorageKeys.ServiceProtocol,
    instance: new Storage({
      area: "local"
    })
  })
  const [hostName] = useStorage({
    key: StorageKeys.ServiceHostName,
    instance: new Storage({
      area: "local"
    })
  })
  const [serviceHealthStatus] = useStorage({
    key: StorageKeys.ServiceHealthStatus,
    instance: new Storage({
      area: "local"
    })
  })

  const [port] = useStorage({
    key: StorageKeys.ServicePort,
    instance: new Storage({
      area: "local"
    })
  })
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
