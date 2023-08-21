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

async function getMeiliSearchBinaryPath() {
  // Why not `spawn` directly from ASAR Archives? - https://www.electronjs.org/docs/latest/tutorial/asar-archives#executing-binaries-inside-asar-archive
  const logger = getLogger();
  const config = getAppConfig();
  const latestMeiliSearchBinaryName =
    (await getMeiliSearchBinaryName(
      join(config.APP_SOURCE_PATH, "./src/searchEngine"),
    )) ?? MEILI_SEARCH_BINARY_NAME_PREFIX;
  logger.info(`latestMeiliSearchBinaryName: ${latestMeiliSearchBinaryName}`);
  // this is meiliSearch Binary for executing later
  const meiliSearchBinaryPathInHomePath = join(
    config.APP_HOME_PATH,
    latestMeiliSearchBinaryName,
  );
  logger.info(
    `meiliSearchBinaryPathInHomePath: ${meiliSearchBinaryPathInHomePath}`,
  );
  if (!fs.existsSync(meiliSearchBinaryPathInHomePath)) {
    logger.info(
      `${meiliSearchBinaryPathInHomePath} not exit. Copying to it...`,
    );
    const olderMeiliSearchBinaryName = await getMeiliSearchBinaryName(
      config.APP_HOME_PATH,
    );
    if (olderMeiliSearchBinaryName) {
      const olderMeiliSearchBinaryPath = join(
        config.APP_HOME_PATH,
        olderMeiliSearchBinaryName,
      );
      logger.info(`Removing ${olderMeiliSearchBinaryPath}`);
      fs.rmSync(olderMeiliSearchBinaryPath, { force: true });
      logger.info(`Removed ${olderMeiliSearchBinaryPath}`);
    }

    // copy from ASAR Archives to home path
    const latestMeiliSearchBinaryPath = join(
      config.APP_SOURCE_PATH,
      "./src/searchEngine",
      latestMeiliSearchBinaryName,
    );
    logger.info(
      `Copying ${latestMeiliSearchBinaryPath} to ${config.APP_HOME_PATH}`,
    );
    fs.copySync(latestMeiliSearchBinaryPath, meiliSearchBinaryPathInHomePath);
    logger.info(
      `Copied ${latestMeiliSearchBinaryPath} to ${config.APP_HOME_PATH}`,
    );
  }

  return meiliSearchBinaryPathInHomePath;
}

export async function startSearchEngine(serverOptions?: MeiliSearchConfig) {
  try {
    const logger = getLogger();
    const config = overwriteAppConfig(serverOptions ?? {});

    const meiliSearchDBPath = join(
      config.APP_HOME_PATH,
      config.MEILISEARCH_DB_FOLDER,
    );
    const meiliSearchBinaryPath = await getMeiliSearchBinaryPath();
    logger.info(`meiliSearchBinaryPath: ${meiliSearchBinaryPath}`);
    const meiliSearchProcess = spawn(meiliSearchBinaryPath, [
      "--http-addr",
      `${config.HOST_NAME}:${config.MEILISEARCH_PORT}`,
      "--master-key",
      config.MEILISEARCH_MASTER_KEY,
      "--db-path",
      meiliSearchDBPath,
    ]);
    meiliSearchProcess.stdout.on("data", (data) => {
      logger.info(`meilisearch stdout`, { data: data.toString() });
    });

    meiliSearchProcess.stderr.on("data", (data) => {
      logger.error(`meilisearch error`, { error: data.toString() });
    });

    meiliSearchProcess.on("close", (code) => {
      logger.info(`meilisearch process exited with code ${code}`);
    });
  } catch (err) {
    console.error(err);
    throw err;
  }
}

// export async function stopSearchEngine() {}
