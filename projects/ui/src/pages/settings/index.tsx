import { usePageEffect } from "../../core/page.js";
// import ExtensionSettingsGeneral from "./general";
import ExtensionSettingsIgnorePatterns from "./ignorePatterns";
import { Layout, Tabs } from "antd";
import { useTranslation } from "react-i18next";
import "./style.css";

const { Content } = Layout;

export default function AccountDetails(): JSX.Element {
  const { t } = useTranslation();
  usePageEffect({ title: "Settings" });

  return (
    <Layout className="settings">
      <Content>
        <Tabs
          tabPosition={"left"}
          items={[
            // {
            //   label: <div>{t("settings.general")}</div>,
            //   key: "general",
            //   children: <ExtensionSettingsGeneral />,
            // },
            {
              label: <div>{t("settings.ignoreURLs")}</div>,
              key: "ignorePatterns",
              children: <ExtensionSettingsIgnorePatterns />,
            },
          ]}
        />
      </Content>
    </Layout>
  );
}
