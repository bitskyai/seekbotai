import * as http from "http";
import { createApp } from "./app";
import { setupDB } from "./db";
import { overwriteAppConfig } from "./helpers/config";
import { DEFAULT_APP_CONFIG } from "./helpers/constants";
import getLogger from "./helpers/logger";
import { ServerOptions } from "./types";

import enableDestroy from "server-destroy";

let server: http.Server;
let processExit = false;

/**
 * start start, it is useful when you need to programmatically start server
 * @param serverOptions : you should only use this when it isn't possible for you to set config in environment value
 */
export async function startServer(serverOptions?: ServerOptions) {
  try {
    const config = overwriteAppConfig(
      serverOptions ?? { DATABASE_URL: DEFAULT_APP_CONFIG.DATABASE_URL }
    );
    const logger = getLogger();
    logger.info(`config: %s`, config);
    await setupDB();
    const app = await createApp();
    if (server) {
      server.destroy();
    }
    server = app.listen(config.PORT, function () {
      console.log(
        `API Server listening on http://localhost:${config.PORT}/ in ${config.NODE_ENV} mode`
      );
      logger.info(
        "API Server listening on http://localhost:%d/ in %s mode",
        config.PORT,
        config.NODE_ENV
      );
    });
    enableDestroy(server);

    // Handle signals gracefully. Heroku will send SIGTERM before idle.
    process.on("SIGTERM", () => {
      logger.info(`SIGTERM received`);
      logger.info("Closing http.Server ..");
      processExit = true;
      server.destroy();
    });
    process.on("SIGINT", () => {
      logger.info(`SIGINT(Ctrl-C) received`);
      logger.info("Closing http.Server ..");
      processExit = true;
      server.destroy();
    });

    server.on("close", () => {
      logger.info("API Server closed");

      logger.info("Giving 100ms time to cleanup..");
      // Give a small time frame to clean up
      if (processExit) {
        setTimeout(process.exit, 100);
      }
    });
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function stopServer() {
  try {
    // close server
    server.destroy();
  } catch (err) {
    console.error(err);
    throw err;
  }
}
