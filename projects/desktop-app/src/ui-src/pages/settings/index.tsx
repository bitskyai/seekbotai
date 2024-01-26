import { IpcEvents } from "../../../ipc-events";
import type { AppConfig, AppPreferences } from "../../../types";
import ipcRendererManager from "../../ipc";
import {
  ProForm,
  ProFormDigit,
  ProFormGroup,
  ProFormSelect,
  ProFormText,
} from "@ant-design/pro-components";
import { Typography } from "antd";
import React from "react";

const { Title } = Typography;

export default function Settings() {
  const response = ipcRendererManager.sendSync(IpcEvents.SYNC_GET_APP_CONFIG);
  const appConfig: AppConfig = response.payload.config;
  const appPreferences: AppPreferences = {
    DESKTOP_APP_USER_DATA_PATH: appConfig.DESKTOP_APP_USER_DATA_PATH,
    WEB_APP_LOG_LEVEL: appConfig.WEB_APP_LOG_LEVEL,
    WEB_APP_LOG_MAX_SIZE: appConfig.WEB_APP_LOG_MAX_SIZE,
    WEB_APP_MASTER_KEY: appConfig.WEB_APP_MASTER_KEY,
    SEARCH_ENGINE_INDEXING_FREQUENCY:
      appConfig.SEARCH_ENGINE_INDEXING_FREQUENCY,
    SEARCH_ENGINE_MASTER_KEY: appConfig.SEARCH_ENGINE_MASTER_KEY,
  };

  const onFormChange = () => {
    console.log("onFormChange");
  };

  return (
    <div style={{ padding: "0 24px" }}>
      <Title level={4}>Settings</Title>
      <div>
        <ProForm
          grid={true}
          initialValues={appPreferences}
          onValuesChange={(_, values) => {
            console.log(values);
          }}
          onFinish={async (value) => console.log(value)}
          submitter={{
            searchConfig: {
              submitText: "Save",
              resetText: "Reset",
            },
          }}
        >
          <ProFormGroup title="Desktop App">
            <ProFormText
              disabled
              name="DESKTOP_APP_USER_DATA_PATH"
              label="User Data Folder"
              tooltip="This is the path where the SeekBot Desktop App stores its data, including the database, logs, screenshots, etc. If you change it, it will automatically move all your data to the new location and delete old folder."
              rules={[{ required: true, message: "You must select a folder" }]}
            />
          </ProFormGroup>
          <ProFormGroup title="API Service">
            <ProFormText.Password
              name="WEB_APP_MASTER_KEY"
              label="API Key"
              tooltip="API key is used to authenticate requests to the SeekBot, if you change it, make sure you also update in the SeekBot browser extension."
              rules={[{ required: true, message: "You must set an API key" }]}
            />
            <ProFormSelect
              name="WEB_APP_LOG_LEVEL"
              label="Log Level"
              width="md"
              valueEnum={{
                error: "Error",
                warn: "Warn",
                info: "Info",
                debug: "Debug",
              }}
              tooltip="Log level is the minimum level of log messages that are written to the log file. For example, if you set it to 'Info', then only 'Error', 'Warn', and 'Info' messages will be written to the log file."
              placeholder="Please select a log level"
              rules={[
                { required: true, message: "You must select a log level" },
              ]}
            />
            <ProFormDigit
              name="WEB_APP_LOG_MAX_SIZE"
              label="Log Max Size"
              width="md"
              placeholder="Please type in a log max size"
              tooltip="Log max size is the maximum size of the log file in megabytes. When the log file reaches this size, it will be rotated."
              rules={[
                { required: true, message: "You must type a log max size" },
              ]}
            />
          </ProFormGroup>
          <ProFormGroup title="Search Engine">
            {/* <ProFormText.Password
              width={"lg"}
              name="SEARCH_ENGINE_MASTER_KEY"
              label="API Key"
              rules={[{ required: true, message: "You must set an API key" }]}
            /> */}
            <ProFormDigit
              name="SEARCH_ENGINE_INDEXING_FREQUENCY"
              width={"md"}
              label="Indexing Frequency"
              tooltip="Indexing frequency is the number of seconds between each indexing run. More frequent indexing will make the search results more accurate, but it will also consume more resources."
              placeholder="Please type in an indexing frequency"
              rules={[
                {
                  required: true,
                  message: "You must type an indexing frequency",
                },
              ]}
            />
          </ProFormGroup>
        </ProForm>
      </div>
    </div>
  );
}
