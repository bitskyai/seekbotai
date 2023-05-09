import { usePageEffect } from "../../core/page.js";
import { GetBookmarksDocument } from "../../graphql/generated.js";
import { updateURLQuery } from "../../helpers/utils.js";
import { FileImageOutlined, TagOutlined } from "@ant-design/icons";
import { useQuery } from "@apollo/client";
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
import { createElement } from "react";
import { useTranslation } from "react-i18next";
import "./style.css";

const { Header, Content } = Layout;
const { Title } = Typography;
const { Search } = Input;

export default function Home(): JSX.Element {
  const { t } = useTranslation();

  usePageEffect({ title: t("search.title") });
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const padding = 20;
  const params = new URLSearchParams(window.location.search);
  const tagsStr = params.get("tags");
  const tagsParams = tagsStr?.split(",").map((tag) => parseInt(tag));
  const {
    loading,
    error,
    data,
    refetch: fetchBookmarks,
  } = useQuery(GetBookmarksDocument, {
    variables: { tags: tagsParams, searchString: params.get("text") ?? "" },
  });

  const onSearch = (value: string) => {
    updateURLQuery([{ paramName: "searchString", paramValue: value }]);
    fetchBookmarks({ searchString: value });
  };

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
                placeholder={t("search.placeholder")}
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
          {loading ? (
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
                      <a href={item.url} key="url-link" target="blank">
                        <IconText
                          icon={FileImageOutlined}
                          text={item.url}
                          key="list-vertical-like-o"
                        />
                      </a>,
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
