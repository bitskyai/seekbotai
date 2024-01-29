import { AppLayout } from "./layout/AppLayout";
import { RootError } from "./layout/RootError";
import React, { lazy } from "react";
import { Navigate, createHashRouter } from "react-router-dom";

// const SettingsLayout = lazy(() => import("./layout/SettingsLayout"));

const Dashboard = lazy(() => import("./pages/dashboard"));
const Search = lazy(() => import("./pages/search"));
// const Settings = lazy(() => import("./pages/settings"));

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
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "search", element: <Search /> },
      // {
      //   path: "",
      //   element: <SettingsLayout />,
      //   children: [
      //     { index: true, element: <Navigate to="/settings" /> },
      //     { path: "settings", element: <Settings /> },
      //   ],
      // },
    ],
  },
]);
