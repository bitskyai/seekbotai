import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { ConfigProvider } from "antd";
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { RecoilRoot } from "recoil";
import "./i18n/config";
import "./index.css";
import { router } from "./routes.js";

const host = import.meta.env.VITE_API_URL;
let url = `${host}/graphql`;
if (!host) {
  url = `${window.location.origin}/graphql`;
}

const apolloClient = new ApolloClient({
  uri: url,
  cache: new InMemoryCache(),
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ApolloProvider client={apolloClient}>
      <RecoilRoot>
        <ConfigProvider>
          <RouterProvider router={router} />
        </ConfigProvider>
      </RecoilRoot>
    </ApolloProvider>
  </React.StrictMode>,
);
