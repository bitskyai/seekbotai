import { usePageEffect } from "../../core/page.js";

export default function AccountDetails(): JSX.Element {
  usePageEffect({ title: "Settings" });

  return <div>Settings</div>;
}
