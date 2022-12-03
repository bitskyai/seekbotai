import { Button } from "antd";
import * as React from "react";
import { Tabs, browser } from "webextension-polyfill-ts";

import { ThemeProvider } from "~packages/antd-theme";

function openWebPage(url: string): Promise<Tabs.Tab> {
  return browser.tabs.create({ url });
}

function IndexPopup() {
  return (
    <ThemeProvider>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: 16
        }}>
        <h1>
          Welcome to your{" "}
          <a href="https://www.bitsky.ai/">Bookmark Intelligence - bitsky.ai</a>{" "}
          Extension!
        </h1>
        <h2>Popup</h2>
        <button
          id="options__button"
          type="button"
          onClick={(): Promise<Tabs.Tab> => openWebPage("options.html")}>
          Options Page
        </button>
        <Button type="primary">Live long and prosper</Button>
      </div>
    </ThemeProvider>
  );
}

export default IndexPopup;
