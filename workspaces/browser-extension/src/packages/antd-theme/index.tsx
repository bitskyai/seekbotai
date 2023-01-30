import { ConfigProvider } from "antd";
import type { ReactNode } from "react";
import * as React from "react";

import "./antd.less";

export function ThemeProvider({ children = null }: { children: ReactNode }) {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#a1701d"
        }
      }}>
      {children}
    </ConfigProvider>
  );
}

export default ThemeProvider;
