import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { SnackbarProvider } from "notistack";
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { RecoilRoot } from "recoil";
import "./i18n/config";
import "./index.css";
import { router } from "./routes.js";
import { ThemeProvider } from "./theme/index.js";

let url = import.meta.env.VITE_API_URL;
if (!url) {
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
        <ThemeProvider>
          <SnackbarProvider>
            <RouterProvider router={router} />
          </SnackbarProvider>
        </ThemeProvider>
      </RecoilRoot>
    </ApolloProvider>
  </React.StrictMode>,
);
