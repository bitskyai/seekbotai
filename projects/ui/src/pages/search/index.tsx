import { usePageEffect } from "../../core/page.js";
import { GetBookmarksDocument } from "../../graphql/generated.js";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "urql";

export default function Home(): JSX.Element {
  usePageEffect({ title: "Search" });

  const { t } = useTranslation();

  const [results] = useQuery({
    query: GetBookmarksDocument,
    variables: {
      tags: [14],
      searchString: "india",
    },
  });
  console.log(`results: `, results);

  let [searchParams] = useSearchParams();
  console.log(`searchParams: `, searchParams.get("tags"));

  return <div>test</div>;
}
