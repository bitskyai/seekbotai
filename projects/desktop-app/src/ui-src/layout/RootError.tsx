import { Result } from "antd";
import { useRouteError } from "react-router-dom";

export function RootError(): JSX.Element {
  const err = useRouteError() as RouteError;

  return (
    <Result
      status={"error"}
      title={"Error"}
      subTitle={err.statusText ?? err.message}
    ></Result>
  );
}

type RouteError = Error & { status?: number; statusText?: string };
