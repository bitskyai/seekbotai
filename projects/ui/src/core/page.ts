/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import * as React from "react";
import { useLocation } from "react-router-dom";
import { config } from "./config.js";

export function usePageEffect(
  options?: Options,
  deps: React.DependencyList = [],
) {
  const location = useLocation();

  // Once the page component was rendered, update the HTML document's title
  React.useEffect(() => {
    const previousTitle = document.title;

    document.title =
      location.pathname === "/"
        ? options?.title ?? config.app.name
        : options?.title
        ? `${options.title} - ${config.app.name}`
        : config.app.name;

    return function () {
      document.title = previousTitle;
    };
  }, [
    ...deps /* eslint-disable-line react-hooks/exhaustive-deps */,
    location,
    options?.title,
  ]);

  // Send "page view" event to Google Analytics
  // https://support.google.com/analytics/answer/11403294?hl=en
  React.useEffect(() => {
    if (!(options?.trackPageView === false)) {
      console.log("track page");
    }
  }, [location, options?.title, options?.trackPageView]);
}

type Options = {
  title?: string;
  /** @default true */
  trackPageView?: boolean;
};
