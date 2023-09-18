import { type SearchResultPage } from "../../graphql/generated";
import { DownOutlined } from "@ant-design/icons";
import { instantMeiliSearch } from "@meilisearch/instant-meilisearch";
import algoliasearch from "algoliasearch/lite";
import { Button, Form, Layout } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  InfiniteHits,
  InstantSearch,
  SortBy,
  SearchBox,
  Highlight,
  ClearRefinements,
  ToggleRefinement,
  RefinementList,
  Configure,
  Snippet,
} from "react-instantsearch";
import "./style.css";
import Panel from "../../components/AisPanel";
import "instantsearch.css/themes/satellite.css";

const { Header, Content, Sider } = Layout;

let url = import.meta.env.VITE_API_URL;
if (!url) {
  url = `${window.location.origin}`;
}
console.log("url", url);
const searchClient = instantMeiliSearch(
  url,
  "8499a9f9-a7a5-4bb2-a445-bc82afe1366c",
  {
    finitePagination: true,
  },
);

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const App = () => {
  const { t } = useTranslation();
  return (
    <InstantSearch indexName="pages" searchClient={searchClient}>
      <Layout>
        <Sider width={300} style={{ padding: "0 10px" }} theme="light">
          <Panel header="Bookmark">
            <ToggleRefinement
              attribute="pageMetadata.bookmarked"
              label="Bookmarked"
            />
          </Panel>
          <Panel header="Favorite">
            <ToggleRefinement
              attribute="pageMetadata.favorite"
              label="Favorite"
            />
          </Panel>
          <Panel header="Tag">
            <RefinementList
              attribute="pageTags.tag.name"
              searchable={true}
              searchablePlaceholder="Search tag"
              showMore={true}
            />
          </Panel>
        </Sider>
        <Layout>
          <Content>
            <div>
              <div>
                <SearchBox autoFocus />
              </div>
              <div>
                <ClearRefinements />
                <Form {...layout}>
                  <Form.Item label={t("search.sortBy")}>
                    <SortBy
                      items={[
                        {
                          value: "pages:pageMetadata.lastVisitTime:desc",
                          label: "Last Visit Time",
                        },
                        {
                          value: "pages:pageMetadata.visitCount:desc",
                          label: "Most Visited",
                        },
                      ]}
                    />
                  </Form.Item>
                </Form>
              </div>

              <Configure
                hitsPerPage={10}
                attributesToSnippet={["content:50"]}
                snippetEllipsisText={"..."}
              />
            </div>
            <div className="search-results">
              <InfiniteHits showPrevious hitComponent={Hit} />
            </div>
          </Content>
        </Layout>
      </Layout>
    </InstantSearch>
  );
};

const Hit = ({ hit }: { hit: SearchResultPage }) => (
  <div key={hit.id}>
    <div className="hit-name">
      <Highlight attribute="title" hit={hit} />
    </div>
    <img
      src={hit.icon ?? ""}
      alt={hit.pageMetadata.displayTitle ?? hit.title}
    />
    <div className="hit-content">
      <Snippet attribute="content" hit={hit} />
    </div>
  </div>
);

export default App;
