import logo from "../../assets/icon.svg";
import { Avatar, Space } from "antd";
import "./index.css";
import { useTranslation } from "react-i18next";

function Logo() {
  const { t } = useTranslation();
  return (
    <div className="bitsky-logo">
      <a
        className="bitsky-logo-text"
        href="https://www.bitsky.ai"
        target="_blank"
        rel="noreferrer"
      >
        <Space align="center">
          <Avatar src={<img src={logo} />}></Avatar>
          {t("appName")}
        </Space>
      </a>
    </div>
  );
}

export default Logo;
