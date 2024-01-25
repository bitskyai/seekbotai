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
              width="lg"
              disabled
              name="DESKTOP_APP_USER_DATA_PATH"
              label="User Data Path"
              rules={[{ required: true, message: "You must select a folder" }]}
            />
          </ProFormGroup>
          <ProFormGroup title="API Service">
            <ProFormText.Password
              width={"lg"}
              name="WEB_APP_MASTER_KEY"
              label="API Key"
              rules={[{ required: true, message: "You must set an API key" }]}
            />

            <ProFormSelect
              name="WEB_APP_LOG_LEVEL"
              label="Log Level"
              valueEnum={{
                error: "Error",
                warn: "Warn",
                info: "Info",
                debug: "Debug",
              }}
              placeholder="Please select a log level"
              rules={[
                { required: true, message: "You must select a log level" },
              ]}
            />

            <ProFormDigit
              name="WEB_APP_LOG_MAX_SIZE"
              label="Log Max Size"
              placeholder="Please type in a log max size"
              rules={[
                { required: true, message: "You must type a log max size" },
              ]}
            />
          </ProFormGroup>
          <ProFormGroup title="Search Engine">
            <ProFormText.Password
              width={"lg"}
              name="SEARCH_ENGINE_MASTER_KEY"
              label="API Key"
              rules={[{ required: true, message: "You must set an API key" }]}
            />
            <ProFormDigit
              name="SEARCH_ENGINE_INDEXING_FREQUENCY"
              width={"lg"}
              label="Indexing Frequency"
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
