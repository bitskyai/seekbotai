import { overwriteAppConfig, getAppConfig } from "../helpers/config";
import getLogger from "../helpers/logger";
import { type MeiliSearchConfig } from "../types";
import { spawn } from "child_process";
import fs from "fs-extra";
import { join } from "path";

const MEILI_SEARCH_BINARY_NAME_PREFIX = "meilisearch_bin";

async function getMeiliSearchBinaryName(dirPath: string) {
  const dirContents = await fs.readdirSync(dirPath);
  console.log(dirContents);
  const meiliSearchBinaryName = dirContents.find((item) =>
    item.includes(MEILI_SEARCH_BINARY_NAME_PREFIX),
  );
  return meiliSearchBinaryName;
}

async function getMeiliSearchBinaryPathInSource() {
  const logger = getLogger();
  const config = getAppConfig();
  const latestMeiliSearchBinaryName =
    (await getMeiliSearchBinaryName(
      join(config.APP_SOURCE_PATH, "./src/searchEngine"),
    )) ?? MEILI_SEARCH_BINARY_NAME_PREFIX;
  const latestMeiliSearchBinaryPath = join(
    config.APP_SOURCE_PATH,
    "./src/searchEngine",
    latestMeiliSearchBinaryName,
  );
  logger.info(`latestMeiliSearchBinaryPath: ${latestMeiliSearchBinaryPath}`);
  return latestMeiliSearchBinaryPath;
}

export async function startSearchEngine(serverOptions?: MeiliSearchConfig) {
  try {
    const logger = getLogger();
    const config = overwriteAppConfig(serverOptions ?? {});

    const meiliSearchDBPath = join(
      config.APP_HOME_PATH,
      config.MEILISEARCH_DB_FOLDER,
    );

    const meiliSearchBinaryPath = await getMeiliSearchBinaryPathInSource();
    logger.info(`meiliSearchBinaryPath: ${meiliSearchBinaryPath}`);
    logger.info(`meiliSearchDBPath: ${meiliSearchDBPath}`);
    const meiliSearchProcess = spawn(
      meiliSearchBinaryPath,
      [
        "--http-addr",
        `${config.HOST_NAME}:${config.MEILISEARCH_PORT}`,
        "--master-key",
        config.MEILISEARCH_MASTER_KEY,
        "--db-path",
        meiliSearchDBPath,
        "--no-analytics",
      ],
      { cwd: config.APP_HOME_PATH },
    );
    meiliSearchProcess.stdout.on("data", (data) => {
      logger.info(`meilisearch stdout`, { data: data.toString() });
    });

    meiliSearchProcess.stderr.on("data", (data) => {
      logger.error(`meilisearch error`, { error: data.toString() });
    });

    meiliSearchProcess.on("close", (code) => {
      logger.info(`meilisearch process exited with code ${code}`);
    });

    meiliSearchProcess.on("exit", (code) => {
      logger.info(`meilisearch process exited with code ${code}`);
      if (code !== 0) {
        meiliSearchProcess.kill();
      }
    });
  } catch (err) {
    console.error(err);
    throw err;
  }
}

// export async function stopSearchEngine() {}
