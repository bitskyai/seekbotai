import { instantMeiliSearch } from "@meilisearch/instant-meilisearch";
import { Layout, Space } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  CurrentRefinements,
  HitsPerPage,
  InfiniteHits,
  InstantSearch,
  SortBy,
  SearchBox,
  ClearRefinements,
  ToggleRefinement,
  RefinementList,
  Configure,
  Stats,
} from "react-instantsearch";
import "./style.css";
import Panel from "../../components/AisPanel";
import Refresh from "../../components/Refresh";
import "instantsearch.css/themes/satellite.css";
import { DEFAULT_MEILISEARCH_MASTER_KEY } from "../../../../shared";
import { subscribe } from "../../helpers/event";
import HitItem, { HIT_ITEM_REFRESH } from "./HitItem";
import { CurrentRefinementsConnectorParamsRefinement } from "instantsearch.js/es/connectors/current-refinements/connectCurrentRefinements";

const { Content, Sider } = Layout;

let url = import.meta.env.VITE_API_URL;
if (!url) {
  url = `${window.location.origin}`;
}

const searchClient = instantMeiliSearch(url, DEFAULT_MEILISEARCH_MASTER_KEY, {
  finitePagination: true,
});

const SearchPage = () => {
  const { t } = useTranslation();
  const [infiniteHitsKey, setInfiniteHitsKey] = useState(0);
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

  const onRefresh = () => {
    setInfiniteHitsKey(infiniteHitsKey + 1);
  };

  subscribe(HIT_ITEM_REFRESH, () => {
    onRefresh();
  });

  return (
    <div className="search-container">
      <InstantSearch
        indexName="pages"
        stalledSearchDelay={1000}
        routing={true}
        initialUiState={{
          pages: { sortBy: "pages:pageMetadata.lastVisitTime:desc" },
        }}
        searchClient={searchClient}
      >
        <Configure
          hitsPerPage={20}
          attributesToSnippet={["content:300"]}
          snippetEllipsisText={"..."}
        />
        <Layout>
          <Sider className="search-side-bar" width={300} theme="light">
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
            <Panel header={t("search.tag")}>
              <RefinementList
                attribute="pageTags.tag.name"
                searchable={true}
                searchablePlaceholder={t("search.searchTag")}
                showMore={true}
              />
            </Panel>
            <Panel header={t("search.hostName")}>
              <RefinementList
                attribute="pageMetadata.hostName"
                searchable={true}
                searchablePlaceholder={t("search.searchHostName")}
                showMore={true}
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
                    <Refresh onRefresh={onRefresh} />
                    <Stats />
                  </Space>
                </div>
                <div>
                  <CurrentRefinements
                    transformItems={(items) => {
                      for (let i = 0; i < items.length; i++) {
                        if (items[i].attribute === "pageTags.tag.name") {
                          items[i].label = t("search.tag");
                        }
                        if (items[i].attribute === "pageMetadata.hostName") {
                          items[i].label = t("search.hostName");
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
                {/* TODO: Fix this is a temp solution to fix hits not refreshed */}
                <InfiniteHits key={infiniteHitsKey} hitComponent={HitItem} />
              </div>
            </Content>
          </Layout>
        </Layout>
      </InstantSearch>
    </div>
  );
};

export default SearchPage;
