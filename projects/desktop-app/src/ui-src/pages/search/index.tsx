import { IpcEvents } from "../../../ipc-events";
import type { AppConfig } from "../../../types";
import ipcRendererManager from "../../ipc";
import React, { useRef } from "react";

export default function Settings() {
  const response = ipcRendererManager.sendSync(IpcEvents.SYNC_GET_APP_CONFIG);
  const appConfig: AppConfig = response.payload.config;
  const iframeElem = useRef(null);
  const url = `http://${appConfig.WEB_APP_HOST_NAME}:${appConfig.WEB_APP_PORT}`;
  return (
    <iframe
      id="search-iframe"
      ref={iframeElem}
      src={url}
      className="full-screen"
      style={{ height: "100%", width: "100%" }}
    />
  );
}
