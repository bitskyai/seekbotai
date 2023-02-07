import express from "express";
import { createYoga } from "graphql-yoga";
import path from "path";

import { schema } from "./schema";

const port = Number(process.env.API_PORT) || 4000;
const app = express();

const yoga = createYoga({ schema });
app.use(express.static(path.join(__dirname + "/public")));
app.use(express.static(path.join(__dirname + "/ui")));
app.use("/graphql", yoga);

app.listen(port, () => {
  console.info(`Server is running on http://localhost:${port}`);
});
