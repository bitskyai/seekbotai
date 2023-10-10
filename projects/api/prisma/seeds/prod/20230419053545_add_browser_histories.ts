import { getPrismaClient } from "../../../src/db";
import browserHistories, {
  pageMetadata,
} from "../../../src/db/seedData/exampleBrowserHistories";
import { PrismaClient } from "@prisma/client";

async function seed(prismaClient?: PrismaClient) {
  if (!prismaClient) {
    prismaClient = getPrismaClient();
  }

  for (let i = 0; i < browserHistories.length; i++) {
    const browserHistory = browserHistories[i];
    await prismaClient.page.upsert({
      where: { id: browserHistory.id },
      create: browserHistory,
      update: browserHistory,
    });
  }

  for (let i = 0; i < pageMetadata.length; i++) {
    const metadata = pageMetadata[i];
    await prismaClient.pageMetadata.upsert({
      where: { id: metadata.id },
      create: metadata,
      update: metadata,
    });
  }
}

export default seed;
