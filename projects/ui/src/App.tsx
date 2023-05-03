import { useTranslation } from "react-i18next";
import { useQuery } from "urql";
import { GetBookmarksDocument } from "./graphql/generated";
import "./i18n/config";

function App() {
  const { t } = useTranslation();

  const [results] = useQuery({
    query: GetBookmarksDocument,
    variables: {
      tags: [14],
      searchString: "india",
    },
  });
  console.log(`results: `, results);
  return (
    <>
      <h1>{t("appName")}</h1>
      <div className="bg-zinc-800 flex-col h-screen w-full flex items-center justify-center p-4 gap-y-12 overflow-scroll"></div>
    </>
  );
}

export default App;
