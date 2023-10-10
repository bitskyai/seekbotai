import { getPrismaClient } from "../../../src/db";
import { ignoreURLs } from "../../../src/db/seedData/defaultIgnoreUrls";
import { PrismaClient } from "@prisma/client";

async function seed(prismaClient?: PrismaClient) {
  if (!prismaClient) {
    prismaClient = getPrismaClient();
  }

  for (let i = 0; i < ignoreURLs.length; i++) {
    const ignoreURL = ignoreURLs[i];
    console.log(ignoreURL);
    await prismaClient.ignoreURL.upsert({
      where: { id: ignoreURL.id },
      create: ignoreURL,
      update: ignoreURL,
    });
  }
}

export default seed;
