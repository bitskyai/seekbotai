import {
  DeleteOutlined,
  LoadingOutlined,
  SearchOutlined,
  SettingOutlined,
  StarOutlined
} from "@ant-design/icons";
import { useMount } from "ahooks";
import { Avatar, Button, Card, List } from "antd";
import React, { useState } from "react";
import browser from "webextension-polyfill";

import { checkWhetherBookmarked } from "~packages/apis/bookmarks";
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

function getItem(optionObj: {
  title: React.ReactNode;
  key: React.Key;
  icon: React.ReactNode;
  description: React.ReactNode;
  click: Function;
}) {
  return optionObj;
}

const App: React.FC = function App() {
  const [isBookmarked, setIsBookmarked] = useState(BOOKMARK_STATUS.Loading);

  const closePopup = () => window.close();

  const goSettingsPage = () => {
    browser.tabs.create({
      url: `/options.html#/settings`
    });
    closePopup();
  };

  const goSearchPage = () => {
    browser.tabs.create({
      url: `/options.html#/search`
    });
    closePopup();
  };

  const deleteBookmark = async () => {
    console.log(`deleteBookmark`);
  };

  const addBookmark = async () => {
    console.log(`addBookmark`);
  };

  let items = [];
  if (isBookmarked === BOOKMARK_STATUS.Bookmarked) {
    items.push(
      getItem({
        title: chrome.i18n.getMessage("deleteBookmark"),
        description: "option+s",
        key: MENU_KEYS.DeleteBookmark,
        icon: <DeleteOutlined />,
        click: deleteBookmark
      })
    );
  } else {
    let option = {
      title: chrome.i18n.getMessage("addBookmark"),
      description: "option+s",
      key: MENU_KEYS.AddBookmark,
      icon: <StarOutlined />,
      click: addBookmark
    };
    if (isBookmarked === BOOKMARK_STATUS.Loading) {
      option.click = async () => {};
      option.icon = <LoadingOutlined />;
    }
    items.push(getItem(option));
  }

  items.push(
    getItem({
      title: chrome.i18n.getMessage("search"),
      description: "option+f",
      key: MENU_KEYS.Search,
      icon: <SearchOutlined />,
      click: goSearchPage
    })
  );

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
        <List
          itemLayout="horizontal"
          dataSource={items}
          renderItem={(item) => (
            <List.Item onClick={() => item.click(item)}>
              <List.Item.Meta
                avatar={
                  <Avatar
                    style={{ backgroundColor: "#1890ff" }}
                    icon={item.icon}
                  />
                }
                title={item.title}
                description={item.description}
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default App;
