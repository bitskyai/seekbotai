import { type SearchResultPage } from "../../graphql/generated";
import { instantMeiliSearch } from "@meilisearch/instant-meilisearch";
import { Layout } from "antd";
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
import Refresh from "../../components/Refresh";
import "instantsearch.css/themes/satellite.css";
import { CurrentRefinementsConnectorParamsRefinement } from "instantsearch.js/es/connectors/current-refinements/connectCurrentRefinements";

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
    <InstantSearch indexName="pages" searchClient={searchClient}>
      <Configure
        hitsPerPage={20}
        attributesToSnippet={["content:200"]}
        snippetEllipsisText={"..."}
      />
      <Layout>
        <Sider width={300} style={{ padding: "0 10px" }} theme="light">
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
          <Content>
            <div>
              <div>
                <SearchBox autoFocus />
              </div>
              <div>
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
                        items[i].refinements = transformBooleanToReadableValue(
                          items[i].refinements,
                        );
                      }
                      if (items[i].attribute === "pageMetadata.bookmarked") {
                        items[i].label = t("search.bookmarked");
                        items[i].refinements = transformBooleanToReadableValue(
                          items[i].refinements,
                        );
                      }
                    }
                    return items;
                  }}
                />
                <ClearRefinements
                  translations={{
                    resetButtonText: t("search.resetButtonText"),
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
