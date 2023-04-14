import { PrismaClient } from "@prisma/client";
import * as path from "path";
import defaultUser from "../../../src/db/defaultUser";
import { getFilesByExtNames } from "../../../src/helpers/utils";

async function loadModule(moduleName: string) {
  const myModule = await import(`./${moduleName}`);
  const defaultModuleFn = myModule.default as (prismaClient: any) => void;
  return defaultModuleFn;
}
/**
 * Seed data for production purpose
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
    console.log("seedFiles: ", seedFiles);
    console.log("latestSeededFiles: ", latestSeededFiles);
    console.log("current filename: ", path.basename(__filename));
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
            data: { seedName: seedFileName, userId: defaultUser.id },
          });
        });
      } else if (latestSeededFile?.seedName === seedFileName) {
        startSeeding = true;
      }
    }
  }
}

export default seed;
