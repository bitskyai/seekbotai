import { Result } from "antd";
import { useRouteError } from "react-router-dom";
import { useTranslation } from "react-i18next";

export function RootError(): JSX.Element {
  const err = useRouteError() as RouteError;
  const { t } = useTranslation();

  return (
    <Result status={err.status || "error"} title={t("error.title")} subTitle={err.statusText ?? err.message}></Result>
  );
}

type RouteError = Error & { status?: number; statusText?: string };
