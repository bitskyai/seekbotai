import express from "express";
import { createYoga } from "graphql-yoga";
import path from "path";
import { defaultUser } from "./db/seedData/defaultUsers";
import { getAppConfig } from "./helpers/config";
import { schema } from "./schema";

export async function createApp() {
  const config = getAppConfig();
  const app = express();
  const yoga = createYoga({
    schema,
    context: () => {
      if (config.DESKTOP_MODE) {
        // if it is desktop mode, then use the default user
        return { user: defaultUser };
      }
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
