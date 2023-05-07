import { lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppLayout } from "./layout/AppLayout.js";
import { RootError } from "./layout/RootError.js";
const SettingsLayout = lazy(() => import("./layout/SettingsLayout.js"));

const Dashboard = lazy(() => import("./pages/search/index.js"));
const Settings = lazy(() => import("./pages/settings/index.js"));

/**
 * Application routes
 * https://reactrouter.com/en/main/routers/create-browser-router
 */
export const router = createBrowserRouter([
  {
    path: "",
    element: <AppLayout />,
    errorElement: <RootError />,
    children: [
      { index: true, element: <Navigate to="/search" replace /> },
      { path: "search", element: <Dashboard /> },
      {
        path: "",
        element: <SettingsLayout />,
        children: [
          { index: true, element: <Navigate to="/settings" /> },
          { path: "settings", element: <Settings /> },
        ],
      },
    ],
  },
]);

// Clean up on module reload (HMR)
// https://vitejs.dev/guide/api-hmr
if (import.meta.hot) {
  import.meta.hot.dispose(() => router.dispose());
}
