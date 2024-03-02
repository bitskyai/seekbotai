import { CHECK_SERVICE_HEALTH_INTERVAL_VALUE } from "../../../bitskyLibs/shared";
import { IpcEvents } from "../../../ipc-events";
import type { AppConfig, Tour as ProductTour } from "../../../types";
import type { BrowserExtensionConnectedData } from "../../../web-app/src/types";
import importBookmarks1Img from "../../assets/tour/import-bookmarks-1.png";
import openSearchImg from "../../assets/tour/open-search.png";
import openSettingsImg from "../../assets/tour/open-settings.png";
import pinImg from "../../assets/tour/pin.png";
import searchImg from "../../assets/tour/search.png";
import { getFullDateString, isVersionLessThan } from "../../helpers";
import ipcRendererManager from "../../ipc";
import { QuestionCircleOutlined } from "@ant-design/icons";
import type { TourProps } from "antd";
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Collapse,
  Image,
  Row,
  Steps,
  Tooltip,
  Tour,
  Typography,
} from "antd";
import React, { useEffect, useRef, useState } from "react";
import "./style.css";

const { Meta } = Card;

const { Title, Text, Paragraph } = Typography;
enum HealthStatus {
  CHECKING = "CHECKING",
  UP = "UP",
  DOWN = "DOWN",
}
const cardMinWidth = 400;

export default function Dashboard() {
  const [open, setOpen] = useState<boolean>(false);
  const [productTour, setProductTour] = useState<ProductTour>({ steps: {} });
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
  const [currentStep, setCurrentStep] = useState(-1);
  const [importedBookmarks, setImportedBookmarks] = useState<boolean>(false);
  const [searched, setSearched] = useState<boolean>(false);
  const [stepInLocalStorage, setStepInLocalStorage] = useState(0);

  const servicesRef = useRef(null);
  const extensionsRef = useRef(null);
  const importBookmarksRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    ipcRendererManager.on(IpcEvents.EXTENSION_CONNECTED, (event, args) => {
      const extensions: BrowserExtensionConnectedData[] = args.payload;
      setBrowserExtensionConnected(extensions);
    });

    ipcRendererManager.on(
      IpcEvents.SYNC_PRODUCT_TOUR_UPDATED,
      (event, args) => {
        setProductTour(args.payload);
      },
    );

    const getProductTourRes = ipcRendererManager.sendSync(
      IpcEvents.SYNC_GET_PRODUCT_TOUR,
    );
    if (getProductTourRes.status) {
      setProductTour(getProductTourRes.payload);
    }

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

  useEffect(() => {
    if (productTour?.finished) {
      setStepInLocalStorage(4);
      setOpen(false);
      return;
    }

    if (productTour?.steps?.importBookmarks?.finished) {
      setImportedBookmarks(true);
    } else {
      setImportedBookmarks(false);
    }

    if (productTour?.steps?.search?.finished) {
      setSearched(true);
    } else {
      setSearched(false);
    }
  }, [productTour]);

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

  const getBrowserExtensionHealthStatus = (
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

    return status;
  };

  const getBrowserExtensionCard = (
    browserExtension: BrowserExtensionConnectedData,
  ) => {
    const status = getBrowserExtensionHealthStatus(browserExtension);
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
        (
          <a key="remove" href="#" onClick={onRemoveExtension}>
            Remove
          </a>
        ) as React.ReactNode,
      );
    }
    return (
      <Col
        key={browserExtension.uuid}
        span={6}
        style={{ minWidth: cardMinWidth }}
      >
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

  const getServiceHealthTourDescription = () => {
    let serviceHealthStepDescription = "";
    if (currentStep !== 0) {
      return serviceHealthStepDescription;
    }
    if (
      webAppHealthStatus === HealthStatus.UP &&
      searchEngineHealthStatus === HealthStatus.UP
    ) {
      document.body.classList.remove("seek-bot-tour-disable-next-step");
      document.body.classList.add("seek-bot-tour-enable-next-step");
      serviceHealthStepDescription =
        "Both services are running, you can go to next step";
    } else {
      document.body.classList.remove("seek-bot-tour-enable-next-step");
      document.body.classList.add("seek-bot-tour-disable-next-step");
      serviceHealthStepDescription =
        "Please wait for services to be running, normally it at most takes several seconds.";
    }
    return serviceHealthStepDescription;
  };

  const getBrowserExtensionTourDescription = () => {
    let browserExtensionStepDescription = <></>;
    if (currentStep !== 1) {
      return browserExtensionStepDescription;
    }
    if (browserExtensionConnected.length) {
      if (
        browserExtensionConnected.some(
          (extension) =>
            getBrowserExtensionHealthStatus(extension) === HealthStatus.UP,
        )
      ) {
        document.body.classList.remove("seek-bot-tour-disable-next-step");
        document.body.classList.add("seek-bot-tour-enable-next-step");
        browserExtensionStepDescription = (
          <p>SeekBot browser extension is connected, you can go to next step</p>
        );
      } else {
        document.body.classList.remove("seek-bot-tour-enable-next-step");
        document.body.classList.add("seek-bot-tour-disable-next-step");
        browserExtensionStepDescription = (
          <p>
            SeekBot browser extension is not connected, please wait for a few
            seconds. If it still not connected, you can try to remove and
            install again
          </p>
        );
      }
    } else {
      document.body.classList.remove("seek-bot-tour-enable-next-step");
      document.body.classList.add("seek-bot-tour-disable-next-step");
      browserExtensionStepDescription = (
        <div>
          <ol>
            <li>Click button to install SeekBot browser extension</li>
            <li>After installed, back to the SeekBot desktop application</li>
            <li>
              Waiting for about 20 seconds, SeekBot browser extension should
              automatically connect to SeekBot desktop application
            </li>
          </ol>
        </div>
      );
    }

    return browserExtensionStepDescription;
  };

  const getImportBookmarksDescription = () => {
    let importBookmarksStepDescription = "";
    if (currentStep !== 2) {
      return importBookmarksStepDescription;
    }
    if (importedBookmarks) {
      document.body.classList.remove("seek-bot-tour-disable-next-step");
      document.body.classList.add("seek-bot-tour-enable-next-step");
      importBookmarksStepDescription = "You have imported bookmarks";
    } else {
      document.body.classList.remove("seek-bot-tour-enable-next-step");
      document.body.classList.add("seek-bot-tour-disable-next-step");
      importBookmarksStepDescription =
        "Please follow instructions to import bookmarks";
    }
    return importBookmarksStepDescription;
  };

  const getSearchDescription = () => {
    let searchStepDescription = "";
    if (currentStep !== 3) {
      return searchStepDescription;
    }
    if (searched) {
      document.body.classList.remove("seek-bot-tour-disable-next-step");
      document.body.classList.add("seek-bot-tour-enable-next-step");
      searchStepDescription = "You have searched bookmarks";
    } else {
      document.body.classList.remove("seek-bot-tour-enable-next-step");
      document.body.classList.add("seek-bot-tour-disable-next-step");
      searchStepDescription =
        "Please follow instructions to try search feature";
    }
    return searchStepDescription;
  };

  const tourSteps: TourProps["steps"] = [
    {
      title: "Services Health",
      description: (
        <div>
          <p>
            {getBadge(HealthStatus.CHECKING)} means still checking service
            health status
          </p>
          <p>{getBadge(HealthStatus.UP)} means service is health </p>
          <p>
            {getBadge(HealthStatus.DOWN)} means service is down. Restart desktop
            application should solve this problem{" "}
          </p>
          <p>{getServiceHealthTourDescription()}</p>
        </div>
      ) as React.ReactNode,
      target: () => servicesRef.current,
    },
    {
      title: "Install the browser extension",
      description: getBrowserExtensionTourDescription() as React.ReactNode,
      target: () => extensionsRef.current,
    },
    {
      title: "Import bookmarks",
      description: getImportBookmarksDescription() as React.ReactNode,
      target: () => importBookmarksRef.current,
    },
    {
      title: "Search",
      description: getSearchDescription() as React.ReactNode,
      target: () => searchRef.current,
    },
  ];

  const getImportBookmarksStepDescription = () => {
    return (
      <div
        ref={importBookmarksRef}
        style={{ display: currentStep === 2 ? "block" : "none" }}
      >
        <Paragraph>
          <Text type="secondary">
            Pin the browser extension to your browser toolbar
          </Text>
          <br />
          <Image width={250} src={pinImg} />
        </Paragraph>
        <Paragraph>
          <Text type="secondary">Open settings</Text>
          <br />
          <Image width={250} src={openSettingsImg} />
        </Paragraph>
        <Paragraph>
          <Text type="secondary">
            Click on the Import Bookmarks button and then click Start Import
          </Text>
          <br />
          <Image width={250} src={importBookmarks1Img} />
        </Paragraph>
      </div>
    );
  };

  const getSearchStepDescription = () => {
    return (
      <div
        ref={searchRef}
        style={{ display: currentStep === 3 ? "block" : "none" }}
      >
        <Paragraph>
          <Text type="secondary">Open Search</Text>
          <br />
          <Image width={250} src={openSearchImg} />
        </Paragraph>
        <Paragraph>
          <Text type="secondary">
            Click on the search box and try to search bookmarks you imported
            before
          </Text>
          <br />
          <Image width={250} src={searchImg} />
        </Paragraph>
      </div>
    );
  };

  const startTour = (fromBeginning: boolean) => {
    if (fromBeginning) {
      const response = ipcRendererManager.sendSync(
        IpcEvents.SYNC_RESET_PRODUCT_TOUR,
      );
      setProductTour(response.payload);
      setCurrentStep(0);
    } else {
      setCurrentStep(stepInLocalStorage);
    }
    setOpen(true);
  };

  return (
    <div style={{ padding: "0 24px 24px 24px" }}>
      <Title level={4}>Dashboard</Title>
      <Card
        hoverable
        style={{ display: productTour?.notShow ? "none" : "block" }}
      >
        <Title level={4} style={{ margin: "0 0 10px 0" }}>
          Welcome!
        </Title>
        <Paragraph>
          Take just two minutes to begin with a brief tour of our product
        </Paragraph>
        <Button
          type="primary"
          onClick={() => {
            startTour(true);
          }}
        >
          Start tour
        </Button>
        <Steps
          style={{ marginTop: "10px" }}
          direction="vertical"
          current={currentStep}
          size="small"
          status={productTour?.finished ? "finish" : "process"}
          items={[
            {
              title: "Check the health of Services",
              description:
                "Only when API Server and Search Engine are running, you can use SeekBot",
            },
            { title: "Install the browser extension", description: "" },
            {
              title: "Import bookmarks",
              description: getImportBookmarksStepDescription(),
            },
            {
              title: "Search",
              description: getSearchStepDescription(),
            },
          ]}
        />
        <div className="seek-bot-tour">
          <Tour
            open={open}
            onChange={(current) => {
              setCurrentStep(current);
            }}
            onClose={() => {
              setOpen(false);
            }}
            onFinish={() => {
              setCurrentStep(4);
              setOpen(false);
            }}
            steps={tourSteps}
          />
        </div>

        <div>
          {currentStep === 4 ? (
            <Paragraph>
              <Text>
                Congratulations! You&apos;ve completed the product tour. Now, as
                you browse, you can utilize SeekBot to effortlessly search
                through your bookmarks and history using any keywords.
              </Text>
            </Paragraph>
          ) : (
            <></>
          )}
          <Button
            onClick={() => {
              ipcRendererManager.send(IpcEvents.SYNC_FINISH_PRODUCT_TOUR);
              setOpen(false);
            }}
          >
            {currentStep === 4 ? "Close Tour" : "Skip tour"}
          </Button>
        </div>
      </Card>
      <Row>
        <Title level={5}>
          <span>Browser Extensions</span>
          <Tooltip title="The browser extension actively collects data while you are browsing and securely transmits it to SeekBot, which then securely stores it locally. To make use of SeekBot, the installation and activation of this browser extension are required.">
            <Button
              type="text"
              shape="circle"
              icon={<QuestionCircleOutlined />}
            />
          </Tooltip>
        </Title>
      </Row>
      <Row gutter={[16, 16]} ref={extensionsRef}>
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
                        Chrome SeekBot Extension
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
                        Edge SeekBot Extension
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
      <Row gutter={[16, 16]} ref={servicesRef}>
        <Col span={6} style={{ minWidth: cardMinWidth }}>
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
        <Col span={6} style={{ minWidth: cardMinWidth }}>
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
