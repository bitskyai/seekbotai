import { lazy } from "react"
import { Navigate, createHashRouter } from "react-router-dom"

import { AppLayout } from "./pages/settings/layout/AppLayout"
import { RootError } from "./pages/settings/layout/RootError"

const SettingsLayout = lazy(
  () => import("./pages/settings/layout/SettingsLayout")
)

const Dashboard = lazy(() => import("./pages/search/index"))
const Settings = lazy(() => import("./pages/settings/index"))

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
          { path: "settings", element: <Settings /> }
        ]
      }
    ]
  }
])
