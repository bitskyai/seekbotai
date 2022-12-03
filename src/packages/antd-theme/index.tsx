import { ConfigProvider } from "antd";
import type { ReactNode } from "react";
import React from "react";

import "./antd.less";

export function ThemeProvider({ children = null as ReactNode }) {
  return <ConfigProvider>{children}</ConfigProvider>;
}
