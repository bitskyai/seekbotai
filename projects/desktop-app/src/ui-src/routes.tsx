import { AppLayout } from "./layout/AppLayout";
import { RootError } from "./layout/RootError";
import React, { lazy } from "react";
import { Navigate, createHashRouter } from "react-router-dom";

const SettingsLayout = lazy(() => import("./layout/SettingsLayout"));

const Dashboard = lazy(() => import("./pages/dashboard"));
const Settings = lazy(() => import("./pages/settings"));

/**
 * Application routes
 * https://reactrouter.com/en/main/routers/create-browser-router
 */
export const router = createHashRouter([
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
