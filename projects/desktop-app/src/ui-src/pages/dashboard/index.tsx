import { IpcEvents } from "../../../ipc-events";
import type { AppConfig } from "../../../types";
import type { BrowserExtensionConnectedData } from "../../../web-app/src/types";
import ipcRendererManager from "../../ipc";
import { Badge, Card, Col, Row, Typography } from "antd";
import React, { useEffect, useState } from "react";
import "./style.css";

const { Meta } = Card;

const { Title, Text } = Typography;
enum HealthStatus {
  CHECKING = "CHECKING",
  UP = "UP",
  DOWN = "DOWN",
}

export default function Dashboard() {
  const [webAppHealthStatus, setWebAppHealthStatus] =
    React.useState<HealthStatus>(HealthStatus.CHECKING);
  const [searchEngineHealthStatus, setSearchEngineHealthStatus] =
    React.useState<HealthStatus>(HealthStatus.CHECKING);
  const [lastCheckedTime, setLastCheckedTime] = React.useState<Date>(
    new Date(),
  );
  const [browserExtensionConnected, setBrowserExtensionConnected] = useState<{
    [key: string]: BrowserExtensionConnectedData;
  }>({});

  useEffect(() => {
    ipcRendererManager.on(IpcEvents.EXTENSION_CONNECTED, (event, args) => {
      const data: BrowserExtensionConnectedData = args.payload;
      console.info("extension connected", data);
      if (!data || !data.extensionId) {
        return;
      }
      const key = `${data.browserName}:${data.extensionId}`;
      setBrowserExtensionConnected((prevState) => {
        return {
          ...prevState,
          [key]: data,
        };
      });
    });

    const checkServiceHealth = async (
      url: string,
      setHealthStatus: React.Dispatch<React.SetStateAction<HealthStatus>>,
    ) => {
      try {
        const response = await fetch(url);
        if (response.status === 200) {
          setHealthStatus(HealthStatus.UP);
        } else {
          setHealthStatus(HealthStatus.DOWN);
        }
      } catch (error) {
        setHealthStatus(HealthStatus.DOWN);
      }
    };

    const checkServiceHealthStatus = async () => {
      const response = ipcRendererManager.sendSync(
        IpcEvents.SYNC_GET_APP_CONFIG,
      );
      const appConfig: AppConfig = response?.payload?.config ?? {};
      const webAppHealthURL = `${"http://"}${appConfig?.WEB_APP_HOST_NAME}:${
        appConfig?.WEB_APP_PORT
      }/health`;
      const searchEngineHealthURL = `${"http://"}${
        appConfig.SEARCH_ENGINE_HOST_NAME
      }:${appConfig.SEARCH_ENGINE_PORT}/health`;
      checkServiceHealth(webAppHealthURL, setWebAppHealthStatus);
      checkServiceHealth(searchEngineHealthURL, setSearchEngineHealthStatus);
      setLastCheckedTime(new Date());
    };

    checkServiceHealthStatus();
    const intervalId = setInterval(() => {
      checkServiceHealthStatus();
    }, 30 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  const getBadge = (healthStatus: HealthStatus) => {
    switch (healthStatus) {
      case HealthStatus.CHECKING:
        return <Badge className="seek-bot-status-dot" status="processing" />;
      case HealthStatus.UP:
        return <Badge className="seek-bot-status-dot" status="success" />;
      case HealthStatus.DOWN:
        return <Badge className="seek-bot-status-dot" status="error" />;
    }
  };

  const getBrowserExtensionCard = (
    browserExtension: BrowserExtensionConnectedData,
  ) => {
    let status = HealthStatus.DOWN;
    if (Date.now() - browserExtension.lastConnectedAt < 1.5 * 60 * 1000) {
      status = HealthStatus.UP;
    }
    return (
      <Col span={4} style={{ minWidth: 300 }}>
        <Card hoverable>
          <Meta
            avatar={getBadge(status)}
            title={browserExtension.browserName}
            description={getExtensionDescription(status, browserExtension)}
          ></Meta>
        </Card>
      </Col>
    );
  };
  const getDisplayHealthStatus = (
    healthStatus: HealthStatus,
    checkedTime: Date,
  ) => {
    const updatedAt = `${checkedTime.getHours()}:${checkedTime.getMinutes()}:${checkedTime.getSeconds()}`;
    const commonFields = (
      <>
        <p>Last checked time: {updatedAt}</p>
      </>
    );
    switch (healthStatus) {
      case HealthStatus.CHECKING:
        return (
          <>
            <p>Connecting</p>
            {commonFields}
          </>
        );
      case HealthStatus.UP:
        return (
          <>
            <p>Running</p>
            {commonFields}
          </>
        );
      case HealthStatus.DOWN:
        return (
          <>
            <p>
              Down. Most of time, restart SeekBot desktop application can solve
              this issue
            </p>
            {commonFields}
          </>
        );
    }
  };

  const getExtensionDescription = (
    healthStatus: HealthStatus,
    extensionInfo: BrowserExtensionConnectedData,
  ) => {
    const checkedTime = new Date(extensionInfo.lastConnectedAt);
    const updatedAt = `${checkedTime.getHours()}:${checkedTime.getMinutes()}:${checkedTime.getSeconds()}`;
    const commonFields = (
      <>
        <p>Extension Version: {extensionInfo.extensionVersion}</p>
        <p>Last connection time: {updatedAt}</p>
      </>
    );
    switch (healthStatus) {
      case HealthStatus.CHECKING:
        return (
          <>
            <p>Connecting</p>
            {commonFields}
          </>
        );
      case HealthStatus.UP:
        return (
          <>
            <p>Running</p>
            {commonFields}
          </>
        );
      case HealthStatus.DOWN:
        return (
          <>
            <p>
              Down. Check whether {extensionInfo.browserName} is running or
              whether SeekBot Browser Extension is disabled or Whether you
              changed API key but forgot to update in SeekBot browser extension
            </p>
            {commonFields}
          </>
        );
    }
  };
  return (
    <div style={{ padding: "0 24px" }}>
      <Title level={4}>Dashboard</Title>
      <Row>
        <Title level={5}>Services</Title>
      </Row>
      <Row gutter={16}>
        <Col span={4} style={{ minWidth: 300 }}>
          <Card hoverable>
            <Meta
              avatar={getBadge(webAppHealthStatus)}
              title="API Server"
              description={getDisplayHealthStatus(
                webAppHealthStatus,
                lastCheckedTime,
              )}
            ></Meta>
          </Card>
        </Col>
        <Col span={4} style={{ minWidth: 300 }}>
          <Card hoverable>
            <Meta
              avatar={getBadge(searchEngineHealthStatus)}
              title="Search Engine"
              description={getDisplayHealthStatus(
                webAppHealthStatus,
                lastCheckedTime,
              )}
            ></Meta>
          </Card>
        </Col>
      </Row>
      <Row>
        <Title level={5}>Browser Extensions</Title>
      </Row>
      <Row gutter={16}>
        {Object.keys(browserExtensionConnected).length ? (
          Object.keys(browserExtensionConnected).map((key) =>
            getBrowserExtensionCard(browserExtensionConnected[key]),
          )
        ) : (
          <>
            <Text type="secondary">
              No connected SeekBot browser extensions. If you already opened a
              browser that installed SeekBot extension, please wait a minute,
              SeekBot browser extension will automatically connect SeekBot API
              Server.
            </Text>
          </>
        )}
      </Row>
    </div>
  );
}
