import { HomeOutlined, StarOutlined } from "@ant-design/icons";
import { Button, Card, Input } from "antd";
import React, { useEffect, useState } from "react";

import { getBookmarkStatus } from "~packages/apis/bookmarks";
import Logo from "~packages/components/logo";

import "./app.less";

const { Search } = Input;

const onSearch = (value: string) => console.log(value);

const goHomePage = () => {};

const App: React.FC = () => {
  const [isBookmarked, setIsBookmarked] = useState(`null`);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getBookmarkStatus("http://bitsky.ai");
      console.log(data);
    };
    setIsBookmarked("loading");
    fetchData().catch((err) => {
      console.error(err);
    });
  });

  return (
    <div className={"popup"}>
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
            <Button className={"card-extra-action"} icon={<StarOutlined />} />
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
