import App from "./App";
import React from "react";
import ReactDOM from "react-dom/client";
import { createClient, Provider } from "urql";
import "./index.css";

let url = import.meta.env.VITE_API_URL;
if (!url) {
  url = `${window.location.href}graphql`;
}
const client = createClient({
  // url: import.meta.env.VITE_API_URL || "http://localhost:4000/graphql",
  url,
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider value={client}>
      <App />
    </Provider>
  </React.StrictMode>,
);
