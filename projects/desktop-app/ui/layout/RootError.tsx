import { Result } from "antd"
import { useRouteError } from "react-router-dom"

export function RootError(): JSX.Element {
  const err = useRouteError() as RouteError

  return (
    <Result
      status={"error"}
      title={chrome.i18n.getMessage("errorPageTitle")}
      subTitle={err.statusText ?? err.message}></Result>
  )
}

type RouteError = Error & { status?: number; statusText?: string }
