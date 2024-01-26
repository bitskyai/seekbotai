import { IpcEvents } from "../../../ipc-events";
import type { AppConfig } from "../../../types";
import ipcRendererManager from "../../ipc";
import { Badge, Card, Col, Row, Typography } from "antd";
import React, { useEffect } from "react";
import "./style.css";

const { Meta } = Card;

const { Title } = Typography;
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

  useEffect(() => {
    const response = ipcRendererManager.sendSync(IpcEvents.SYNC_GET_APP_CONFIG);
    const appConfig: AppConfig = response.payload.config;
    console.log("appConfig", appConfig);
    const webAppHealthURL = `${"http://"}${appConfig.WEB_APP_HOST_NAME}:${
      appConfig.WEB_APP_PORT
    }/health`;
    const searchEngineHealthURL = `${"http://"}${
      appConfig.SEARCH_ENGINE_HOST_NAME
    }:${appConfig.SEARCH_ENGINE_PORT}/health`;

    const checkServiceHealth = async (
      url: string,
      setHealthStatus: React.Dispatch<React.SetStateAction<HealthStatus>>,
    ) => {
      console.log("Checking health of", url);
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

    checkServiceHealth(webAppHealthURL, setWebAppHealthStatus);
    checkServiceHealth(searchEngineHealthURL, setSearchEngineHealthStatus);

    const intervalId = setInterval(() => {
      checkServiceHealth(webAppHealthURL, setWebAppHealthStatus);
      checkServiceHealth(searchEngineHealthURL, setSearchEngineHealthStatus);
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
  const getDisplayHealthStatus = (healthStatus: HealthStatus) => {
    switch (healthStatus) {
      case HealthStatus.CHECKING:
        return "Trying to connect";
      case HealthStatus.UP:
        return "Service is running";
      case HealthStatus.DOWN:
        return "Service is down, please restart the desktop app";
    }
  };
  return (
    <div style={{ padding: "0 24px" }}>
      <Title level={4}>Dashboard</Title>
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Meta
              avatar={getBadge(webAppHealthStatus)}
              title="API Service"
              description={getDisplayHealthStatus(webAppHealthStatus)}
            ></Meta>
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Meta
              avatar={getBadge(searchEngineHealthStatus)}
              title="Search Engine"
              description={getDisplayHealthStatus(webAppHealthStatus)}
            ></Meta>
          </Card>
        </Col>
      </Row>
      <Row gutter={16}></Row>
    </div>
  );
}
