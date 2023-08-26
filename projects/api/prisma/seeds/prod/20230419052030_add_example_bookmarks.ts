import { getPrismaClient } from "../../../src/db";
import {
  pageMetadata,
  pageTags,
  pages,
} from "../../../src/db/seedData/exampleBookmarks";
import { PrismaClient } from "@prisma/client";

async function seed(prismaClient?: PrismaClient) {
  if (!prismaClient) {
    prismaClient = getPrismaClient();
  }

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    await prismaClient.page.upsert({
      where: { id: page.id },
      create: page,
      update: page,
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

  for (let i = 0; i < pageTags.length; i++) {
    const tags = pageTags[i];
    for (let j = 0; j < tags.length; j++) {
      const tag = tags[j];
      await prismaClient.pageTag.upsert({
        where: { id: tag.id },
        create: tag,
        update: tag,
      });
    }
  }
}

export default seed;
