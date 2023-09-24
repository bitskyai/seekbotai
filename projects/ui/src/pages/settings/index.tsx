import { usePageEffect } from "../../core/search.js";
import { GetTagsDocument } from "../../graphql/generated.js";
import { useQuery } from "@apollo/client";

export default function AccountDetails(): JSX.Element {
  usePageEffect({ title: "Settings" });
  const { loading, error, data } = useQuery(GetTagsDocument);
  console.log(`settings: `, loading, error, data);
  return <div>Settings</div>;
}
