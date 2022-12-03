import { Button } from "antd";
import antdResetCssText from "data-text:antd/dist/reset.css";
import type { PlasmoContentScript } from "plasmo";
import * as React from "react";

import { ThemeProvider } from "~packages/antd-theme";

export const config: PlasmoContentScript = {
  matches: ["https://www.plasmo.com/*"]
};

export const getStyle = () => {
  const style = document.createElement("style");
  style.textContent = antdResetCssText;
  return style;
};

function HelloWorldOverlay() {
  return (
    <ThemeProvider>
      <h2>Contents</h2>
      <Button type="primary">Hello World - Contents</Button>
    </ThemeProvider>
  );
}

export default HelloWorldOverlay;
