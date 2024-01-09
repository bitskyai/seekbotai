import { getAppConfig } from "../helpers/config";
import { type Express } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

export async function setupProxy(app: Express) {
  const config = getAppConfig();
  const proxy = createProxyMiddleware({
    target: `http://${config.SEARCH_ENGINE_HOST_NAME}:${config.SEARCH_ENGINE_PORT}`,
    headers: {
      authorization: `Bearer ${config.SEARCH_ENGINE_MASTER_KEY}`,
    },
  });
  app.use("/indexes", proxy);
  app.use("/multi-search", proxy);
  app.use("/keys", proxy);
  app.use("/settings", proxy);
}
