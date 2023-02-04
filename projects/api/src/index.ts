import express from "express";
import { NotFound } from "http-errors";
import { handleError } from "./core";
import env from "./env";
// import { handleGraphQL, updateSchema } from "./graphql";
import { withViews } from "./views";

const api = withViews(express());

api.enable("trust proxy");
api.disable("x-powered-by");

// Enable body parsing middleware
// http://expressjs.com/en/api.html#express.json
api.use(express.json({ limit: "1024mb" }));

// GraphQL API middleware
// api.use("/api", handleGraphQL);

api.get("/", (req, res) => {
    res.render("home");
});

api.get("/favicon.ico", function (req, res) {
    res.redirect("https://nodejs.org/static/images/favicons/favicon.ico");
});

api.get("*", function () {
    throw new NotFound();
});

api.use(handleError);

/**
 * Launch API for testing when in development mode.
 *
 * NOTE: This block will be removed from production build by Rollup.
 */
if (process.env.NODE_ENV === "development") {
    // updateSchema();

    const port = process.env.PORT ?? 8080;
    const envName = `\x1b[92m${process.env.APP_ENV}\x1b[0m`;
    const url = `\x1b[94mhttp://localhost:${port}/\x1b[0m`;

    const server = api.listen(port, function () {
        console.log(`Listening on ${url} (env: ${envName})`);
    });

    process.once("SIGTERM", function () {
        server.close();
    });
}

// export { api, db, env, updateSchema };
export { api, env };
