import { defaultUser } from "./db/seedData/defaultUsers";
import { DEFAULT_SELF_IDENTIFICATION } from "@bitsky/shared";
import express from "express";
import { createYoga } from "graphql-yoga";
import helmet from "helmet";
import path from "path";
import "./entities";
import { schemaBuilder } from "./entities";
import { getAppConfig } from "./helpers/config";

export async function createApp() {
  const config = getAppConfig();
  const app = express();
  app.disable("x-powered-by");
  app.use(helmet());
  app.use("/heartbeat", (req, res) => {
    res.send(DEFAULT_SELF_IDENTIFICATION);
  });

  const yoga = createYoga({
    schema: schemaBuilder.toSchema({}),
    context: () => {
      if (config.DESKTOP_MODE) {
        // if it is desktop mode, then use the default user
        return { user: defaultUser };
      }
      return { user: defaultUser };
      // otherwise need to validate token add add user to `context`
    },
  });
  app.use(express.static(path.join(__dirname + "/public")));
  app.use(express.static(path.join(__dirname + "/ui")));
  app.use("/graphql", yoga);

  app.get("*", (req, res, next) => {
    res.sendFile(path.join(__dirname + "/ui/index.html"));
  });

  return app;
}
