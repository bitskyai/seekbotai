import { DEFAULT_SELF_IDENTIFICATION } from "./bitskyLibs/shared";
import { defaultUser } from "./db/seedData/defaultUsers";
import cors from "cors";
import express from "express";
import { createYoga } from "graphql-yoga";
import helmet from "helmet";
import path from "path";
import "./entities";
import { getSchemaBuilder } from "./entities";
import { emitBrowserExtensionConnected } from "./event";
import { getAppConfig } from "./helpers/config";
import getLogger from "./helpers/logger";
import printGraphqlSchema from "./helpers/printSchema";
import { setupProxy } from "./searchEngine";

export async function createApp() {
  const config = getAppConfig();
  const app = express();
  app.use(cors());
  app.disable("x-powered-by");
  app.use((req, res, next) => {
    // Log details of the HTTP request
    const logger = getLogger();
    logger.debug("HTTP Request Detail", {
      url: req.url,
      method: req.method,
      body: req.body,
      query: req.query,
      headers: req.headers,
    });

    if (
      req.url.includes("/agent") &&
      req.method.toLowerCase() === "get" &&
      req.headers["x-seekbot-extension-id"]
    ) {
      let extensionId = req.headers["x-seekbot-extension-id"];
      if (Array.isArray(extensionId)) {
        extensionId = extensionId[0];
      }

      let optionsUrl = req.headers["x-seekbot-extension-options-url"];
      if (Array.isArray(optionsUrl)) {
        optionsUrl = optionsUrl[0];
      }

      let browserName = req.headers["x-seekbot-browser-name"];
      if (Array.isArray(browserName)) {
        browserName = browserName[0];
      }

      // this is a browser extension request
      emitBrowserExtensionConnected({
        extensionId: extensionId,
        optionsUrl: optionsUrl ?? "",
        browserName: browserName ?? "",
      });
    }

    // Continue to the next middleware or route handler
    next();
  });
  app.use(
    helmet({
      contentSecurityPolicy: false,
      frameguard: false,
    }),
  );
  app.use("/heartbeat", (req, res) => {
    res.send(DEFAULT_SELF_IDENTIFICATION);
  });

  app.use("/agent", (req, res) => {
    res.send(DEFAULT_SELF_IDENTIFICATION);
  });

  const yoga = createYoga({
    schema: getSchemaBuilder().toSchema({}),
    context: () => {
      if (config.DESKTOP_MODE) {
        // if it is desktop mode, then use the default user
        return { user: defaultUser };
      }
      return { user: defaultUser };
      // otherwise need to validate token add add user to `context`
    },
  });

  printGraphqlSchema(getSchemaBuilder().toSchema({}));
  app.use(express.static(path.join(__dirname + "/public")));
  app.use(express.static(path.join(__dirname + "/ui")));
  app.use(express.static(path.join(config.WEB_APP_HOME_PATH)));
  app.use("/graphql", yoga);
  await setupProxy(app);

  app.get("*", (req, res, next) => {
    res.sendFile(path.join(__dirname + "/ui/index.html"));
  });

  return app;
}
