import { CHECK_SERVICE_HEALTH_INTERVAL_VALUE } from "../../../bitskyLibs/shared";
import { IpcEvents } from "../../../ipc-events";
import type { AppConfig } from "../../../types";
import type { BrowserExtensionConnectedData } from "../../../web-app/src/types";
import { getFullDateString, isVersionLessThan } from "../../helpers";
import ipcRendererManager from "../../ipc";
import { QuestionCircleOutlined } from "@ant-design/icons";
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Collapse,
  Row,
  Tooltip,
  Typography,
} from "antd";
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

    const checkBrowserExtensionHealth = async () => {
      const getExtensionsResponse = ipcRendererManager.sendSync(
        IpcEvents.SYNC_GET_EXTENSIONS,
      );

      if (getExtensionsResponse.status) {
        const extensions: BrowserExtensionConnectedData[] =
          getExtensionsResponse?.payload;
        setBrowserExtensionConnected(extensions);
      }
    };
    checkBrowserExtensionHealth();
    const extensionsIntervalId = setInterval(() => {
      checkBrowserExtensionHealth();
    }, CHECK_SERVICE_HEALTH_INTERVAL_VALUE);

    return () => {
      clearInterval(intervalId);
      clearInterval(extensionsIntervalId);
    };
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
              Make sure {extensionInfo.browserName} is running and the browser
              extension is enabled
            </li>
            <li>
              Wait for a few seconds, the browser extension will try to
              reconnect
            </li>
            <li>
              All above steps don&apos;t work, you can remove it and re-install
              the browser extension
            </li>
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
    let unHealthTime = CHECK_SERVICE_HEALTH_INTERVAL_VALUE * 2;
    if (isVersionLessThan(browserExtension.extensionVersion, "0.3.0")) {
      // make sure back compatible, if extension version less than 0.3.0, we will set unHealthTime to 1.5 minutes
      unHealthTime = 1.5 * 60 * 1000;
    }
    if (Date.now() - browserExtension.lastConnectedAt < unHealthTime) {
      status = HealthStatus.UP;
    }
    const onRemoveExtension = () => {
      const res = ipcRendererManager.sendSync(
        IpcEvents.SYNC_REMOVE_EXTENSION,
        browserExtension,
      );
      setBrowserExtensionConnected(res?.payload);
    };
    const actions: React.ReactNode[] = [];
    if (status === HealthStatus.DOWN) {
      actions.push(
        <a key="remove" href="#" onClick={onRemoveExtension}>
          Remove
        </a>,
      );
    }
    return (
      <Col span={6} style={{ minWidth: 300 }}>
        <Card actions={actions} hoverable className="browser-extension">
          <Meta
            avatar={getBadge(status)}
            title={browserExtension.browserName ?? "Unknown Browser"}
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
        <p>
          Last checked time <br /> {updatedAt}
        </p>
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
        <p>
          Extension Version
          <br /> {extensionInfo.extensionVersion}
        </p>
        <p>
          Last connection time
          <br /> {updatedAt}
        </p>
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
        <Title level={5}>
          Browser Extensions{" "}
          <Tooltip title="The browser extension actively collects data while you are browsing and securely transmits it to SeekBot, which then securely stores it locally. To make use of SeekBot, the installation and activation of this browser extension are required.">
            <Button
              type="text"
              shape="circle"
              icon={<QuestionCircleOutlined />}
            />
          </Tooltip>
        </Title>
      </Row>
      <Row gutter={16}>
        {browserExtensionConnected.length ? (
          browserExtensionConnected.map((extension) =>
            getBrowserExtensionCard(extension),
          )
        ) : (
          <div style={{ padding: "0 10px" }}>
            <Paragraph>
              <Text type="secondary">
                SeekBot browser extension is not connected.
              </Text>
            </Paragraph>
            <Alert
              type="warning"
              message="You must install SeekBot browser extension"
              description={
                <ul style={{ padding: "0 0 0 10px" }}>
                  <li>
                    <Paragraph
                      copyable={{
                        text: "https://chromewebstore.google.com/detail/kgipojdgplnnehpaoiobioagckhkdckh",
                      }}
                    >
                      <Button
                        href="https://chromewebstore.google.com/detail/kgipojdgplnnehpaoiobioagckhkdckh"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Install Chrome SeekBot Extension
                      </Button>
                    </Paragraph>
                  </li>
                  <li>
                    <Paragraph
                      copyable={{
                        text: "https://chromewebstore.google.com/detail/kgipojdgplnnehpaoiobioagckhkdckh",
                      }}
                    >
                      <Button
                        href="https://chromewebstore.google.com/detail/kgipojdgplnnehpaoiobioagckhkdckh"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Install Edge SeekBot Extension
                      </Button>
                    </Paragraph>
                  </li>
                </ul>
              }
              showIcon
            />
            <Paragraph style={{ marginTop: "10px" }}>
              <Text type="secondary">
                If the browser extension has been installed, please ensure that
                the browser in which the extension was installed is open and
                that the extension itself is activated.
              </Text>
            </Paragraph>
          </div>
        )}
      </Row>
      <Row>
        <Title level={5}>Services</Title>
      </Row>
      <Row gutter={16}>
        <Col span={6} style={{ minWidth: 300 }}>
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
        <Col span={6} style={{ minWidth: 300 }}>
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
    </div>
  );
}
