import { getPrismaClient } from "../../../src/db";
import { getAppConfig } from "../../../src/helpers/config";
import getLogger from "../../../src/helpers/logger";
import { getFilesByExtNames } from "../../../src/helpers/utils";
import { loadModule } from "../utils";
import { PrismaClient } from "@prisma/client";
import * as path from "path";

/**
 * Seed data for production purpose
 * TODO: improve the error handle of seed prod - issue-17
 * @param prismaClient
 */
async function seed(prismaClient?: PrismaClient) {
  const logger = getLogger();
  if (!prismaClient) {
    prismaClient = getPrismaClient();
  }
  const config = getAppConfig();
  logger.debug(`config: ${JSON.stringify(config, null, 2)}`);
  if (config.DESKTOP_MODE === true) {
    const seedFiles = getFilesByExtNames(
      path.join(__dirname, "."),
      [".ts", ".js"],
      [/index\.ts/, /^ignore_/, /files/, /index\.js/],
    );
    // console.log(`seedFiles: `, seedFiles);
    seedFiles.sort((fileA, fileB) => {
      if (fileA > fileB) {
        return 1;
      }

      if (fileA < fileB) {
        return -1;
      }
      return 0;
    });

    for (let i = 0; i < seedFiles.length; i++) {
      const seedFileName = seedFiles[i];
      const seedFun = await loadModule(seedFileName);
      await seedFun(prismaClient);
    }
  }
}

export default seed;
