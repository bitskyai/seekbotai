import "./index.css";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import React from "react";

export type LogoProps = {
  style?: React.CSSProperties;
  title: string;
};

const Logo: React.FC<LogoProps> = ({ title, style }) => {
  return (
    <span style={{ paddingLeft: 5, ...style }}>
      <Tooltip title={title}>
        <QuestionCircleOutlined rev={"question-mark"} />
      </Tooltip>
    </span>
  );
};

export default Logo;
