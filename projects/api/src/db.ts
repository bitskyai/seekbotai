import { PrismaClient } from "@prisma/client";
import { fork } from "child_process";
import fs from "fs-extra";
import { last, trim } from "lodash";
import path from "path";
import seeds from "../prisma/seeds";
import { getAppConfig } from "./helpers/config";
import getLogger from "./helpers/logger";
import { getPlatformName } from "./helpers/utils";
import { Migration } from "./types";

const logger = getLogger();

let _prismaClient: PrismaClient;
let databaseURL: string;

export function getPrismaClient() {
  const latestDatabaseURL = getAppConfig().DATABASE_URL;
  if (latestDatabaseURL != databaseURL) {
    databaseURL = latestDatabaseURL;
    _prismaClient = new PrismaClient({
      datasources: { db: { url: databaseURL } },
    });
  }
  logger.info(`DATABASE_URL: ${getAppConfig().DATABASE_URL}`);
  return _prismaClient;
}

export const LATEST_MIGRATION = "20230313153628_init"; // This needs to be updated every time you create a migration!
export const LATEST_SEED = "2023";

export const platformToExecutables: any = {
  win32: {
    migrationEngine:
      "node_modules/@prisma/engines/migration-engine-windows.exe",
    queryEngine: "node_modules/@prisma/engines/query_engine-windows.dll.node",
  },
  linux: {
    migrationEngine:
      "node_modules/@prisma/engines/migration-engine-debian-openssl-1.1.x",
    queryEngine:
      "node_modules/@prisma/engines/libquery_engine-debian-openssl-1.1.x.so.node",
  },
  darwin: {
    migrationEngine: "node_modules/@prisma/engines/migration-engine-darwin",
    queryEngine:
      "node_modules/@prisma/engines/libquery_engine-darwin.dylib.node",
  },
  darwinArm64: {
    migrationEngine:
      "node_modules/@prisma/engines/migration-engine-darwin-arm64",
    queryEngine:
      "node_modules/@prisma/engines/libquery_engine-darwin-arm64.dylib.node",
  },
};

export async function seed(prismaClient?: PrismaClient) {
  await seeds(prismaClient);
}

export async function setupDB() {
  const config = getAppConfig();
  if (!config.SETUP_DB) {
    logger.info(`Don't need to setup DB`);
    return;
  }
  let needsMigration = false;
  if (config.DATABASE_PROVIDER !== "sqlite") {
    // currently setupDB only for sqlite
    return;
  }
  // remove `file:`
  const dbPath = trim(config.DATABASE_URL).substring(5);
  const dbExists = fs.existsSync(dbPath);
  const prisma = getPrismaClient();
  logger.info(`dbPath: ${dbPath}`);
  if (!dbExists) {
    needsMigration = true;
    // prisma for whatever reason has trouble if the database file does not exist yet.
    // So just touch it here
    fs.copySync(
      path.join(config.APP_SOURCE_PATH, "./prisma/bi-latest.db"),
      dbPath,
    );
  } else {
    try {
      const latest: Migration[] =
        await prisma.$queryRaw`select * from _prisma_migrations order by finished_at`;
      needsMigration = last(latest)?.migration_name !== LATEST_MIGRATION;
    } catch (e) {
      logger.error(e);
      needsMigration = true;
    }
  }

  if (needsMigration) {
    try {
      const schemaPath = path.join(
        config.APP_SOURCE_PATH,
        "prisma",
        "schema.prisma",
      );
      logger.info(
        `Needs a migration. Running prisma migrate with schema path ${schemaPath}`,
      );

      // first create or migrate the database! If you were deploying prisma to a cloud service, this migrate deploy
      // command you would run as part of your CI/CD deployment. Since this is an electron app, it just needs
      // to run when the production app is started. That way if the user updates AriNote and the schema has
      // changed, it will transparently migrate their DB.
      await runPrismaCommand({
        appSourcePath: config.APP_SOURCE_PATH,
        command: ["migrate", "deploy", "--schema", schemaPath],
        dbUrl: config.DATABASE_URL,
      });
    } catch (e) {
      logger.error(e);
      process.exit(1);
    }
  } else {
    logger.info("Does not need migration");
  }

  if (config.SEED_DB) {
    // seed
    logger.info("Seeding...");
    await seed();
  } else {
    logger.info("Does not need seed");
  }
}

export async function runPrismaCommand({
  appSourcePath,
  command,
  dbUrl,
}: {
  appSourcePath: string;
  command: string[];
  dbUrl: string;
}): Promise<number> {
  const platformName = getPlatformName();

  const qePath = path.join(
    appSourcePath,
    platformToExecutables[platformName].queryEngine,
  );
  const mePath = path.join(
    appSourcePath,
    platformToExecutables[platformName].migrationEngine,
  );
  logger.info("Migration engine path: %s", mePath);
  logger.info("Query engine path: %s", qePath);

  // Currently we don't have any direct method to invoke prisma migration programatically.
  // As a workaround, we spawn migration script as a child process and wait for its completion.
  // Please also refer to the following GitHub issue: https://github.com/prisma/prisma/issues/4703
  try {
    const exitCode = await new Promise((resolve, _) => {
      const prismaPath = path.resolve(
        __dirname,
        "..",
        "node_modules/prisma/build/index.js",
      );
      logger.info("Prisma path: %s", prismaPath);

      const child = fork(prismaPath, command, {
        env: {
          ...process.env,
          DATABASE_URL: dbUrl,
          PRISMA_MIGRATION_ENGINE_BINARY: mePath,
          PRISMA_QUERY_ENGINE_LIBRARY: qePath,

          // Prisma apparently needs a valid path for the format and introspection binaries, even though
          // we don't use them. So we just point them to the query engine binary. Otherwise, we get
          // prisma:  Error: ENOTDIR: not a directory, unlink '/some/path/electron-prisma-trpc-example/packed/mac-arm64/ElectronPrismaTrpcExample.app/Contents/Resources/app.asar/node_modules/@prisma/engines/prisma-fmt-darwin-arm64'
          PRISMA_FMT_BINARY: qePath,
          PRISMA_INTROSPECTION_ENGINE_BINARY: qePath,
        },
        stdio: "pipe",
      });

      child.on("message", (msg: string) => {
        logger.info(msg);
      });

      child.on("error", (err: object) => {
        logger.error("Child process got error: %s", err);
      });

      child.on("close", (code: string, signal: string) => {
        resolve(code);
      });

      child.stdout?.on("data", function (data: object) {
        logger.info("prisma: %s", data.toString());
      });

      child.stderr?.on("data", function (data: object) {
        logger.error("prisma: %s", data.toString());
      });
    });

    if (exitCode !== 0)
      throw Error(`command ${command} failed with exit code ${exitCode}`);

    return exitCode;
  } catch (e) {
    logger.error(e);
    throw e;
  }
}
