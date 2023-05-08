import { usePageEffect } from "../../core/page.js";
import { GetBookmarksDocument } from "../../graphql/generated.js";
import { Layout, theme, Typography, Input, Button } from "antd";
import { useState, useEffect } from "react";
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
  const [tags, setTags] = useState<number[]>(tagsParams ?? []);
  const [searchString, setSearchString] = useState(params.get("text") ?? "");
  const [{ data, fetching, error }, fetchBookmarks] = useQuery({
    query: GetBookmarksDocument,
    variables: {
      tags: tags,
      searchString: searchString,
    },
    pause: true,
  });

  console.log("data: ", data);
  console.log("fetching: ", fetching);
  const onSearch = () => {};

  useEffect(() => {
    fetchBookmarks();
  }, []);

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
      </Content>
    </Layout>
  );
}
