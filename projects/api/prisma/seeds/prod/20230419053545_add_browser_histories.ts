import { PrismaClient } from "@prisma/client";
import { getPrismaClient } from "../../../src/db";
import { defaultUser } from "../../../src/db/seedData/defaultUsers";
import browserHistories from "../../../src/db/seedData/exampleBrowserHistories";

async function seed(prismaClient?: PrismaClient) {
  if (!prismaClient) {
    prismaClient = getPrismaClient();
  }

  for (let i = 0; i < browserHistories.length; i++) {
    const browserHistory = browserHistories[i];
    await prismaClient.browserHistory.upsert({
      where: { id: defaultUser.id },
      create: browserHistory,
      update: browserHistory,
    });
  }
}

export default seed;
