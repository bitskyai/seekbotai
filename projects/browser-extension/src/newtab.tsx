import { DEFAULT_HOST_NAME, DEFAULT_PROTOCOL } from "@bitsky/shared"

import { useStorage } from "@plasmohq/storage/hook"

import { StorageKeys } from "~storage"

import "./style.css"

function IndexNewtab() {
  const [protocol] = useStorage(StorageKeys.ServiceProtocol)
  const [hostName] = useStorage(StorageKeys.ServiceHostName)

  const [port] = useStorage(StorageKeys.ServicePort)
  const url = `${protocol ?? DEFAULT_PROTOCOL}://${
    hostName ?? DEFAULT_HOST_NAME
  }:${port}`
  return (
    <div style={{}}>
      <iframe
        src={url}
        className="full-screen"
        style={{ height: window.screen.height }}
      />
    </div>
  )
}

export default IndexNewtab
