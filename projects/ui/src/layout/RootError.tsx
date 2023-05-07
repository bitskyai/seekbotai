import { Result } from "antd";
import { useTranslation } from "react-i18next";
import { useRouteError } from "react-router-dom";

export function RootError(): JSX.Element {
  const err = useRouteError() as RouteError;
  const { t } = useTranslation();

  return (
    <Result
      status={err.status || "error"}
      title={t("error.title")}
      subTitle={err.statusText ?? err.message}
    ></Result>
  );
}

type RouteError = Error & { status?: number; statusText?: string };
