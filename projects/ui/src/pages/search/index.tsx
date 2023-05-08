import { usePageEffect } from "../../core/page.js";
import { GetBookmarksDocument } from "../../graphql/generated.js";
import { FileImageOutlined, TagOutlined } from "@ant-design/icons";
import {
  Layout,
  theme,
  Typography,
  Input,
  Button,
  Skeleton,
  Avatar,
  List,
  Space,
} from "antd";
import { useState, useEffect, createElement } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "urql";
import "./style.css";

const { Header, Content } = Layout;
const { Title } = Typography;
const { Search } = Input;

export default function Home(): JSX.Element {
  usePageEffect({ title: "Search" });
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const { t } = useTranslation();
  const padding = 20;
  const params = new URLSearchParams(window.location.search);
  const tagsStr = params.get("tags");
  const tagsParams = tagsStr?.split(",").map((tag) => parseInt(tag));
  const [tags] = useState<number[]>(tagsParams ?? []);
  const [searchString, setSearchString] = useState(params.get("text") ?? "");
  const [{ data, fetching }, fetchBookmarks] = useQuery({
    query: GetBookmarksDocument,
    variables: {
      tags: tags,
      searchString: searchString,
    },
    pause: true,
    requestPolicy: "network-only",
  });
  console.log(`searchString: `, searchString);
  console.log(`tags: `, tags);
  console.log("data: ", data);
  console.log("fetching: ", fetching);
  const onSearch = (value: string) => {
    setSearchString(value ?? "");
    fetchBookmarks({ requestPolicy: "network-only" });
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const IconText = ({ icon, text }: { icon: React.FC; text: string }) => (
    <Space>
      {createElement(icon)}
      {text}
    </Space>
  );

  return (
    <Layout
      style={{ padding: `0 ${padding}px`, backgroundColor: colorBgContainer }}
    >
      <Header
        style={{
          padding: 0,
          backgroundColor: colorBgContainer,
        }}
      >
        <Title level={3}>{t("search.title")}</Title>
      </Header>
      <Content>
        <div>
          <div className="search-container">
            <div className="search-remaining">
              <Search
                placeholder="input search text"
                allowClear
                enterButton="Search"
                size="large"
                onSearch={onSearch}
              />
            </div>
            <div style={{ width: 160 }}>
              <Button size="large" type="link">
                {t("search.advancedSearch")}
              </Button>
            </div>
          </div>
        </div>
        <div>
          {fetching ? (
            <Skeleton active />
          ) : (
            <List
              itemLayout="vertical"
              size="large"
              // pagination={{
              //   onChange: (page) => {
              //     console.log(page);
              //   },
              //   pageSize: 3,
              // }}
              dataSource={data?.bookmarks ?? []}
              renderItem={(item) => (
                <List.Item
                  key={item.id}
                  actions={item.bookmarkTags
                    .map((item) => (
                      <IconText
                        icon={TagOutlined}
                        text={item.tag.name}
                        key={item.tag.id}
                      />
                    ))
                    .concat([
                      <IconText
                        icon={FileImageOutlined}
                        text={item.url}
                        key="list-vertical-like-o"
                      />,
                    ])}
                >
                  <List.Item.Meta
                    avatar={<Avatar src={item.icon} />}
                    title={item.name}
                    description={item.description}
                  />
                  {/* {item.content} */}
                </List.Item>
              )}
            />
          )}
        </div>
      </Content>
    </Layout>
  );
}
