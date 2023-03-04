import { schema } from "./schema";
import express from "express";
import { createYoga } from "graphql-yoga";
import path from "path";

export async function createApp() {
  const app = express();

  const yoga = createYoga({ schema });
  console.log(`dirname: `, __dirname);
  app.use(express.static(path.join(__dirname + "/public")));
  app.use(express.static(path.join(__dirname + "/ui")));
  app.use("/graphql", yoga);

  app.get("*", (req, res, next) => {
    res.sendFile(path.join(__dirname + "/ui/index.html"));
  });

  return app;
}
