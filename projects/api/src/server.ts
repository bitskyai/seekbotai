import { createApp } from "./app";
import { setupDB } from "./db";
import { overwriteAppConfig } from "./helpers/config";
import { DEFAULT_APP_OPTIONS } from "./helpers/constants";
import getLogger from "./helpers/logger";
import { WebAppOptions } from "./types";
import * as http from "http";
import enableDestroy from "server-destroy";

let server: http.Server;
let processExit = false;

/**
 * start start, it is useful when you need to programmatically start server
 * @param serverOptions : you should only use this when it isn't possible for you to set config in environment value
 */
export async function startWebApp(serverOptions?: WebAppOptions) {
  const logger = getLogger();
  try {
    const config = overwriteAppConfig(
      serverOptions ?? {
        WEB_APP_DATABASE_URL: DEFAULT_APP_OPTIONS.WEB_APP_DATABASE_URL,
      },
    );
    logger.info(`application config`, { config: config });

    // start search engine
    // if (config.WEB_APP_START_SEARCH_ENGINE) {
    //   await startSearchEngine(serverOptions);
    // }

    await setupDB();
    const app = await createApp();
    if (server) {
      server.destroy();
    }
    server = app.listen(config.WEB_APP_PORT, function () {
      logger.info(
        `API Server listening on http://${config.SEARCH_ENGINE_HOST_NAME}:%d/ in %s mode`,
        config.WEB_APP_PORT,
        config.NODE_ENV,
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
    logger.error("start server has error", { error: err });
    throw err;
  }
}

export async function stopWebApp() {
  const logger = getLogger();
  try {
    // close server
    server.destroy();
    // await stopSearchEngine();
  } catch (err) {
    logger.error(err);
    throw err;
  }
}
