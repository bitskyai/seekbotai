import { HomeOutlined, StarOutlined } from "@ant-design/icons";
import { useMount } from "ahooks";
import { Button, Card, Input } from "antd";
import React, { useEffect, useState } from "react";

import { checkWhetherBookmarked } from "~packages/apis/bookmarks";
import Logo from "~packages/components/logo";
import { getActiveTab } from "~packages/helpers/tab";

import "./app.less";

const { Search } = Input;

const onSearch = (value: string) => console.log(value);

const goHomePage = () => {};

enum BOOKMARK_STATUS {
  Loading,
  Bookmarked,
  NotBookmarked
}

const App: React.FC = function App() {
  const [isBookmarked, setIsBookmarked] = useState(BOOKMARK_STATUS.Loading);

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
    // setIsBookmarked(BOOKMARK_STATUS.Loading);
    fetchData().catch((err) => {
      console.error(err);
      setIsBookmarked(BOOKMARK_STATUS.NotBookmarked);
    });
  });

  return (
    <div className="popup">
      <Card
        title={
          <>
            <Logo className="card-head-title-action" />
            <Search
              className="card-head-title-action"
              placeholder="Please type your search context"
              allowClear
              onSearch={onSearch}
              style={{ width: 400 }}
            />
          </>
        }
        extra={
          <>
            <Button
              type={
                isBookmarked === BOOKMARK_STATUS.Bookmarked
                  ? "primary"
                  : "default"
              }
              className="card-extra-action"
              icon={<StarOutlined />}
              loading={isBookmarked === BOOKMARK_STATUS.Loading ? true : false}
            />
            <Button className="card-extra-action" icon={<HomeOutlined />} />
          </>
        }
        className="card-without-radius">
        <p>Card content</p>
        <p>Card content</p>
      </Card>
    </div>
  );
};

export default App;
