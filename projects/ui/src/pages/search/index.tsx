import { type SearchResultPage } from "../../graphql/generated";
import { DownOutlined } from "@ant-design/icons";
import { instantMeiliSearch } from "@meilisearch/instant-meilisearch";
import { Button, Form, Layout } from "antd";
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

const App = () => {
  const { t } = useTranslation();
  return (
    <InstantSearch indexName="pages" searchClient={searchClient}>
      <Configure
        hitsPerPage={20}
        attributesToSnippet={["content:200"]}
        snippetEllipsisText={"..."}
      />
      <Layout>
        <Sider width={300} style={{ padding: "0 10px" }} theme="light">
          <Panel header="Tag">
            <RefinementList
              attribute="pageTags.tag.name"
              searchable={true}
              searchablePlaceholder="Search tag"
              showMore={true}
            />
          </Panel>
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
                    { label: "20 hits per page", value: 20, default: true },
                    { label: "40 hits per page", value: 40 },
                  ]}
                />
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
                <Refresh />
              </div>
              <div>
                <ClearRefinements />
                <CurrentRefinements
                  transformItems={(items) =>
                    items.map((item) => {
                      const label = item.label.startsWith(
                        "hierarchicalCategories",
                      )
                        ? "Hierarchy"
                        : item.label;

                      return {
                        ...item,
                        attribute: label,
                      };
                    })
                  }
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
