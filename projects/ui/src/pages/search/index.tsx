import { usePageEffect } from "../../core/page.js";
import { GetBookmarksDocument } from "../../graphql/generated.js";
import { updateURLQuery } from "../../helpers/utils.js";
import {
  FileImageOutlined,
  TagOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
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

  function getOrigin(url: string) {
    const urlObj = new URL(url);
    return urlObj.origin;
  }

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
                enterButton
                loading={loading}
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
              pagination={{
                position: "bottom",
                pageSizeOptions: ["50", "200", "500", "1000", "2000"],
                align: "center",
                defaultPageSize: 50,
                showTotal: (total, range) =>
                  `Showing ${range[0]}-${range[1]} of ${total} items`, // Custom total display
              }}
              dataSource={data?.bookmarks ?? []}
              renderItem={(item) => (
                <List.Item
                  key={item.id}
                  actions={[
                    <IconText
                      icon={ClockCircleOutlined}
                      text={`${t("viewedAt")}: ${new Date(
                        item.updatedAt,
                      ).toLocaleString("en-US", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}`}
                      key="list-vertical-like-o"
                    />,
                    <IconText
                      icon={FileImageOutlined}
                      text={getOrigin(item.url)}
                      key="list-vertical-like-o"
                    />,
                  ].concat(
                    item.bookmarkTags.map((item) => (
                      <IconText
                        icon={TagOutlined}
                        text={item.tag.name}
                        key={item.tag.id}
                      />
                    )),
                  )}
                >
                  <List.Item.Meta
                    avatar={<Avatar src={item.icon} />}
                    title={
                      <a key="url-link" target="blank" href={item.url}>
                        {item.name}
                      </a>
                    }
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
