import logo from "../../assets/icon.svg";
import { Avatar, Space } from "antd";
import "./index.css";
import React from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import "./index.css";

export type LogoProps = {
  url?: string;
};

const Logo: React.FC<LogoProps> = ({ url }) => {
  const { t } = useTranslation();
  return (
    <div className="bitsky-logo">
      <NavLink className="bitsky-logo-text" to={url ? url : "/"}>
        <Space align="center">
          <Avatar src={<img src={logo} />}></Avatar>
          {t("appName")}
        </Space>
      </NavLink>
    </div>
  );
};

export default Logo;
