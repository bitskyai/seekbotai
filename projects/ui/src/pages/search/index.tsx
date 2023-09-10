import "instantsearch.css/themes/algolia-min.css";
import { type SearchResultPage } from "../../graphql/generated";
import { DownOutlined } from "@ant-design/icons";
import { instantMeiliSearch } from "@meilisearch/instant-meilisearch";
import { Button, Form } from "antd";
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
  const [expand, setExpand] = useState(false);
  return (
    <div className="ais-InstantSearch">
      <InstantSearch indexName="pages" searchClient={searchClient}>
        <div>
          <div>
            <SearchBox autoFocus />
            <Button
              size="large"
              type="link"
              onClick={() => {
                setExpand(!expand);
              }}
            >
              <DownOutlined rotate={expand ? 180 : 0} rev={undefined} />{" "}
              {expand ? t("search.lessOptions") : t("search.moreOptions")}
            </Button>
          </div>
          <div className="search-options" hidden={expand ? false : true}>
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
          {/* <Hits hitComponent={Hit} />
          <Pagination showLast={true} /> */}
          <ClearRefinements />
          <RefinementList
            attribute="pageTags.tag.name"
            searchable={true}
            searchablePlaceholder="Search tag"
            showMore={true}
          />
          <ToggleRefinement
            attribute="pageMetadata.bookmarked"
            label="Bookmarked"
          />
          <ToggleRefinement
            attribute="pageMetadata.favorite"
            label="Favorite"
          />
          <InfiniteHits showPrevious hitComponent={Hit} />
        </div>
      </InstantSearch>
    </div>
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
