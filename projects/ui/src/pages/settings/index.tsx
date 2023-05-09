import { usePageEffect } from "../../core/page.js";
import { useQuery, gql } from "@apollo/client";
import { GetTagsDocument } from "../../graphql/generated.js";

export default function AccountDetails(): JSX.Element {
  usePageEffect({ title: "Settings" });
  const { loading, error, data } = useQuery(GetTagsDocument);
  console.log(`settings: `, loading, error, data);
  return <div>Settings</div>;
}
