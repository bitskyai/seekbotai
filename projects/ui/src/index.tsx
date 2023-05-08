import { SnackbarProvider } from "notistack";
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { RecoilRoot } from "recoil";
import { createClient, Provider } from "urql";
import "./i18n/config";
import "./index.css";
import { router } from "./routes.js";
import { ThemeProvider } from "./theme/index.js";

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
    <RecoilRoot>
      <ThemeProvider>
        <SnackbarProvider>
          <Provider value={client}>
            <RouterProvider router={router} />
          </Provider>
        </SnackbarProvider>
      </ThemeProvider>
    </RecoilRoot>
  </React.StrictMode>,
);
