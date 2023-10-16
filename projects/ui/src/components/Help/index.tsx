import "./index.css";
import React from "react";
import { useTranslation } from "react-i18next";
import "./index.css";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";

export type LogoProps = {
  style?: React.CSSProperties;
  i18nKey: string;
};

const Logo: React.FC<LogoProps> = ({ i18nKey, style }) => {
  const { t } = useTranslation();
  return (
    <span style={{ paddingLeft: 5, ...style }}>
      <Tooltip title={t(i18nKey)}>
        <QuestionCircleOutlined rev={"question-mark"} />
      </Tooltip>
    </span>
  );
};

export default Logo;
