import {
  DeleteOutlined,
  SearchOutlined,
  SettingOutlined,
  StarOutlined
} from "@ant-design/icons";
import { useMount } from "ahooks";
import { Button, Card } from "antd";
import type { MenuProps } from "antd/es/menu";
import React, { useState } from "react";

// import browser from "webextension-polyfill";

import {
  sendToActiveContentScript,
  sendToBackground
} from "@plasmohq/messaging";

import { checkWhetherBookmarked } from "~packages/apis/bookmarks";
import MESSAGE_NAMES from "~packages/helpers/messageNames";
import { getActiveTab } from "~packages/helpers/tab";

import "./app.less";

enum BOOKMARK_STATUS {
  Loading,
  Bookmarked,
  NotBookmarked
}

enum MENU_KEYS {
  DeleteBookmark,
  AddBookmark,
  Search
}

type MenuItem = Required<MenuProps>["items"][number];

function getItem(optionObj: {
  label: React.ReactNode;
  key: React.Key;
  icon?: React.ReactNode;
  children?: MenuItem[];
  type?: "group";
  disabled?: Boolean;
}): MenuItem {
  return optionObj as MenuItem;
}

const App: React.FC = function App() {
  const [isBookmarked, setIsBookmarked] = useState(BOOKMARK_STATUS.Loading);

  const closePopup = () => window.close();

  const goSettingsPage = () => {
    // browser.tabs.create({
    //   url: `/options.html#/settings`
    // });
    if (chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage();
    } else {
      window.open(chrome.runtime.getURL("options.html"));
    }
    closePopup();
  };

  const goSearchPage = () => {
    // browser.tabs.create({
    //   url: `/options.html#/search`
    // });
    if (chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage();
    } else {
      window.open(chrome.runtime.getURL("options.html"));
    }
    closePopup();
  };

  const bookmarkCurrentPage = async () => {
    console.log("bookmarkCurrentPage");
    const content = await sendToActiveContentScript({
      name: MESSAGE_NAMES.CONTENT_SCRIPTS_GET_PAGE_CONTENT
    });
    const bookmark = await sendToBackground({
      name: MESSAGE_NAMES.BOOKMARKS_CREATE,
      body: content
    });
    console.log(`popup -> content: `, content);
    console.log(`popup -> bookmark: `, bookmark);
  };

  const removeCurrentPageBookmark = async () => {
    console.log("removeCurrentPageBookmark");
    const content = await sendToActiveContentScript({
      name: MESSAGE_NAMES.CONTENT_SCRIPTS_GET_PAGE_CONTENT
    });
    await sendToBackground({
      name: MESSAGE_NAMES.BOOKMARKS_DELETE,
      body: {
        url: content.url
      }
    });
  };

  useMount(() => {
    const fetchData = async () => {
      const tab = await getActiveTab();
      const data = await checkWhetherBookmarked(tab?.url);
      if (data?.status) {
        setIsBookmarked(BOOKMARK_STATUS.Bookmarked);
      } else {
        setIsBookmarked(BOOKMARK_STATUS.NotBookmarked);
      }
    };
    fetchData().catch((err) => {
      setIsBookmarked(BOOKMARK_STATUS.NotBookmarked);
    });
  });

  return (
    <div className="popup">
      <Card
        title={chrome.i18n.getMessage("extensionName")}
        extra={
          <>
            <Button
              type="link"
              block
              icon={<SettingOutlined />}
              onClick={goSettingsPage}
              title={chrome.i18n.getMessage("tooltipSettingIcon")}
            />
          </>
        }
        className="card-without-radius">
        {isBookmarked === BOOKMARK_STATUS.Bookmarked ? (
          <Button
            type="text"
            style={{ width: "100%", height: "auto" }}
            icon={<DeleteOutlined />}
            size="large"
            onClick={removeCurrentPageBookmark}>
            {chrome.i18n.getMessage("tooltipBookmarked")}
          </Button>
        ) : (
          <Button
            type="text"
            style={{ width: "100%", height: "auto" }}
            icon={<StarOutlined />}
            loading={isBookmarked === BOOKMARK_STATUS.Loading}
            size="large"
            onClick={bookmarkCurrentPage}>
            {chrome.i18n.getMessage("tooltipBookmark")}
          </Button>
        )}
        <Button
          type="text"
          style={{ width: "100%", height: "auto" }}
          icon={<SearchOutlined />}
          onClick={goSearchPage}
          size="large">
          {chrome.i18n.getMessage("search")}
        </Button>
      </Card>
    </div>
  );
};

export default App;
