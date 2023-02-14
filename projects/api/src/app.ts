import express from "express";
import { createYoga } from "graphql-yoga";
import path from "path";

import { schema } from "./schema";

export async function createApp() {
  const app = express();

  const yoga = createYoga({ schema });
  app.use(express.static(path.join(__dirname + "/public")));
  app.use(express.static(path.join(__dirname + "/ui")));
  app.use("/graphql", yoga);

  return app;
}
