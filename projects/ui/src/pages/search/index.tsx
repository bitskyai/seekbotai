import { type SearchResultPage } from "../../graphql/generated";
import { instantMeiliSearch } from "@meilisearch/instant-meilisearch";
import { Layout, Space, List, Avatar } from "antd";
import { useTranslation } from "react-i18next";
import {
  CurrentRefinements,
  HitsPerPage,
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
import {
  FileImageOutlined,
  TagOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { CurrentRefinementsConnectorParamsRefinement } from "instantsearch.js/es/connectors/current-refinements/connectCurrentRefinements";
import { createElement } from "react";

function getOrigin(url: string) {
  const urlObj = new URL(url);
  return urlObj.origin;
}

const { Content, Sider } = Layout;

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

const IconText = ({ icon, text }: { icon: React.FC; text: string }) => (
  <Space>
    {createElement(icon)}
    {text}
  </Space>
);

const App = () => {
  const { t } = useTranslation();
  const transformBooleanToReadableValue = (
    refinements: CurrentRefinementsConnectorParamsRefinement[],
  ) => {
    for (let j = 0; j < refinements.length; j++) {
      if (refinements[j].value === "true") {
        refinements[j].label = t("yes");
      }
      if (refinements[j].value === "false") {
        refinements[j].label = t("no");
      }
    }
    return refinements;
  };

  return (
    <div className="search-container">
      <InstantSearch indexName="pages" searchClient={searchClient}>
        <Configure
          hitsPerPage={20}
          attributesToSnippet={["content:200"]}
          snippetEllipsisText={"..."}
        />
        <Layout>
          <Sider className="search-side-bar" width={300} theme="light">
            <Panel header={t("search.tag")}>
              <RefinementList
                attribute="pageTags.tag.name"
                searchable={true}
                searchablePlaceholder={t("search.searchTag")}
                showMore={true}
              />
            </Panel>
            <Panel header={t("search.bookmark")}>
              <ToggleRefinement
                attribute="pageMetadata.bookmarked"
                label={t("search.bookmarked")}
              />
            </Panel>
            <Panel header={t("search.favorite")}>
              <ToggleRefinement
                attribute="pageMetadata.favorite"
                label={t("search.favorited")}
              />
            </Panel>
          </Sider>
          <Layout>
            <Content className="search-content">
              <div className="search-bar">
                <SearchBox autoFocus />
                <div className="search-items">
                  <Space size="small">
                    <HitsPerPage
                      items={[
                        {
                          label: t("search.resultsPerPage", {
                            resultsNumber: "20",
                          }),
                          value: 20,
                          default: true,
                        },
                        {
                          label: t("search.resultsPerPage", {
                            resultsNumber: "40",
                          }),
                          value: 40,
                        },
                      ]}
                    />
                    <SortBy
                      items={[
                        {
                          value: "pages:pageMetadata.lastVisitTime:desc",
                          label: t("search.lastVisited"),
                        },
                        {
                          value: "pages:pageMetadata.visitCount:desc",
                          label: t("search.mostVisited"),
                        },
                      ]}
                    />
                    <ClearRefinements
                      className="clear-refinements-button"
                      translations={{
                        resetButtonText: t("search.resetButtonText"),
                      }}
                    />
                  </Space>
                </div>
                <div>
                  <CurrentRefinements
                    transformItems={(items) => {
                      for (let i = 0; i < items.length; i++) {
                        if (items[i].attribute === "pageTags.tag.name") {
                          items[i].label = t("search.tag");
                        }
                        if (items[i].attribute === "pageMetadata.favorite") {
                          items[i].label = t("search.favorited");
                          items[i].refinements =
                            transformBooleanToReadableValue(
                              items[i].refinements,
                            );
                        }
                        if (items[i].attribute === "pageMetadata.bookmarked") {
                          items[i].label = t("search.bookmarked");
                          items[i].refinements =
                            transformBooleanToReadableValue(
                              items[i].refinements,
                            );
                        }
                      }
                      return items;
                    }}
                  />
                </div>
              </div>
              <div className="search-results">
                <InfiniteHits hitComponent={Hit} />
              </div>
            </Content>
          </Layout>
        </Layout>
      </InstantSearch>
    </div>
  );
};

const Hit = ({ hit }: { hit: SearchResultPage }) => {
  const { t } = useTranslation();
  return (
    <List.Item
      key={hit.id}
      actions={[
        <IconText
          icon={ClockCircleOutlined}
          text={`${t("viewedAt")}: ${
            hit.pageMetadata.lastVisitTime
              ? new Date(hit.pageMetadata.lastVisitTime).toLocaleString(
                  "en-US",
                  {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  },
                )
              : ""
          }`}
          key="list-vertical-like-o"
        />,
        <IconText
          icon={FileImageOutlined}
          text={getOrigin(hit.url)}
          key="list-vertical-like-o"
        />,
      ].concat(
        hit.pageTags.map((item) => (
          <IconText icon={TagOutlined} text={item.tag.name} key={item.tag.id} />
        )),
      )}
    >
      <List.Item.Meta
        avatar={<Avatar src={hit.icon} />}
        title={
          <a key="url-link" target="blank" href={hit.url}>
            <Highlight
              attribute={
                hit.pageMetadata.displayTitle
                  ? "pageMetadata.displayTitle"
                  : hit.title
                  ? "title"
                  : "url"
              }
              hit={hit}
            />
          </a>
        }
        description={hit.pageMetadata.displayDescription ?? hit.description}
      />

      {/* <div className="hit-name">
        <Highlight attribute="title" hit={hit} />
      </div> */}
      {/* <img
        src={hit.icon ?? ""}
        alt={hit.pageMetadata.displayTitle ?? hit.title}
      /> */}
      <div className="hit-content">
        <Snippet attribute="content" hit={hit} />
      </div>
    </List.Item>
  );
};

export default App;
