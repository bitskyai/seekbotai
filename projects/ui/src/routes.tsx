import { lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppLayout } from "./layout/AppLayout.js";
import { RootError } from "./layout/RootError.js";

const Dashboard = lazy(() => import("./pages/dashboard/index.js"));

const SettingsLayout = lazy(() => import("./pages/settings/SettingsLayout.js"));
const AccountDetails = lazy(() => import("./pages/settings/AccountDetails.js"));

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
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: "dashboard", element: <Dashboard /> },
      {
        path: "settings",
        element: <SettingsLayout />,
        children: [
          { index: true, element: <Navigate to="/settings/account" /> },
          { path: "account", element: <AccountDetails /> },
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
