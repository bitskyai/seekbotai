import { usePageEffect } from "../../core/page.js";
import { GetUserDocument } from "../../graphql/generated.js";
import { useQuery } from "@apollo/client";

export default function AccountDetails(): JSX.Element {
  usePageEffect({ title: "Settings" });
  const { loading, error, data } = useQuery(GetUserDocument);
  console.log(`settings: `, loading, error, data);
  return <div>Settings</div>;
}
