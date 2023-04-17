import { PrismaClient } from "@prisma/client";
import * as path from "path";
import { systemUser } from "../../../src/db/seedData/defaultUsers";
import { getFilesByExtNames } from "../../../src/helpers/utils";

async function loadModule(moduleName: string) {
  const myModule = await import(`./${moduleName}`);
  const defaultModuleFn = myModule.default as (prismaClient: any) => void;
  return defaultModuleFn;
}
/**
 * Seed data for production purpose
 * TODO: improve the error handle of seed prod - issue-17
 * @param prismaClient
 */
async function seed(prismaClient: PrismaClient) {
  if (process.env.DESKTOP_MODE === "true") {
    const seedFiles = getFilesByExtNames(
      path.join(__dirname, "."),
      [".ts"],
      [/index\.ts/],
    );
    seedFiles.sort((fileA, fileB) => {
      if (fileA > fileB) {
        return 1;
      }

      if (fileA < fileB) {
        return -1;
      }
      return 0;
    });
    const latestSeededFiles =
      (await prismaClient?.seed.findMany({
        take: 1,
        orderBy: { createdAt: "desc" },
      })) || [];
    const latestSeededFile = latestSeededFiles[0];

    let startSeeding = false;
    if (!latestSeededFile || !latestSeededFile.seedName) {
      // seed from begin
      startSeeding = true;
    }
    for (let i = 0; i < seedFiles.length; i++) {
      const seedFileName = path.basename(seedFiles[i]);
      if (startSeeding) {
        const seedFun = await loadModule(seedFileName);
        await prismaClient.$transaction(async (prisma) => {
          await seedFun(prisma);
          await prisma.seed.create({
            data: { seedName: seedFileName, userId: systemUser.id },
          });
        });
      } else if (latestSeededFile?.seedName === seedFileName) {
        startSeeding = true;
      }
    }
  }
}

export default seed;
