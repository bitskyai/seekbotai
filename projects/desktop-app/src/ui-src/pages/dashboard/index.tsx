import { IpcEvents } from "../../../ipc-events";
import type { AppConfig } from "../../../types";
import type { BrowserExtensionConnectedData } from "../../../web-app/src/types";
import { getFullDateString } from "../../helpers";
import ipcRendererManager from "../../ipc";
import { Badge, Card, Col, Collapse, Row, Typography } from "antd";
import React, { useEffect, useState } from "react";
import "./style.css";

const { Meta } = Card;

const { Title, Text, Paragraph } = Typography;
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
  const [browserExtensionConnected, setBrowserExtensionConnected] = useState<
    BrowserExtensionConnectedData[]
  >([]);

  useEffect(() => {
    const getExtensionsResponse = ipcRendererManager.sendSync(
      IpcEvents.SYNC_GET_EXTENSIONS,
    );

    if (getExtensionsResponse.status) {
      const extensions: BrowserExtensionConnectedData[] =
        getExtensionsResponse?.payload;
      setBrowserExtensionConnected(extensions);
    }

    ipcRendererManager.on(IpcEvents.EXTENSION_CONNECTED, (event, args) => {
      const extensions: BrowserExtensionConnectedData[] = args.payload;
      setBrowserExtensionConnected(extensions);
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

  const extensionDownHowToFix = (
    extensionInfo: BrowserExtensionConnectedData,
  ) => {
    const items = [
      {
        key: 1,
        label: "How to fix",
        children: (
          <ul>
            <li>
              Make sure {extensionInfo.browserName} is running and the SeekBot
              Browser Extension is enabled
            </li>
            <li>Wait for a few seconds, the extension will try to reconnect</li>
            <li>If all above steps don&apos;t work, you can remove it</li>
          </ul>
        ),
      },
    ];
    return <Collapse ghost items={items} />;
  };

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
    const onRemoveExtension = () => {
      const res = ipcRendererManager.sendSync(
        IpcEvents.SYNC_REMOVE_EXTENSION,
        browserExtension,
      );
      setBrowserExtensionConnected(res?.payload);
    };
    return (
      <Col span={4} style={{ minWidth: 300 }}>
        <Card
          actions={[
            <a key="remove" href="#" onClick={onRemoveExtension}>
              Remove
            </a>,
          ]}
          hoverable
        >
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
    const updatedAt = getFullDateString(checkedTime);
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
    const updatedAt = getFullDateString(checkedTime);
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
            <p>Down</p>
            {commonFields}
            {extensionDownHowToFix(extensionInfo)}
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
        {browserExtensionConnected.length ? (
          browserExtensionConnected.map((extension) =>
            getBrowserExtensionCard(extension),
          )
        ) : (
          <>
            <Paragraph>
              <Text type="secondary">
                No connected SeekBot browser extensions.
              </Text>
            </Paragraph>
          </>
        )}
      </Row>
    </div>
  );
}
