import { HomeOutlined, StarOutlined } from "@ant-design/icons";
import { Button, Card, Input } from "antd";
import React, { useEffect, useState } from "react";

import { sendToBackground } from "@plasmohq/messaging";

import { MESSAGE_NAMES } from "~background";
import Logo from "~packages/components/logo";

import "./app.less";

const { Search } = Input;

const onSearch = (value: string) => console.log(value);

const goHomePage = () => {};

const App: React.FC = function App() {
  const [isBookmarked, setIsBookmarked] = useState(`null`);

  useEffect(() => {
    const fetchData = async () => {
      console.log(`App -> bookmarks/status`);
      const data = await sendToBackground({
        name: MESSAGE_NAMES.BOOKMARKS_GET_STATUS,
        body: {
          url: "http://bitsky.ai"
        }
      });
      console.log(`App:`, data);
    };
    setIsBookmarked("loading");

    fetchData().catch((err) => {
      console.error(err);
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
            <Button className="card-extra-action" icon={<StarOutlined />} />
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
