import { getPrismaClient } from "../../../src/db";
import {
  bookmarkRaws,
  bookmarkTags,
  bookmarks,
} from "../../../src/db/seedData/exampleBookmarks";
import { PrismaClient } from "@prisma/client";

async function seed(prismaClient?: PrismaClient) {
  if (!prismaClient) {
    prismaClient = getPrismaClient();
  }

  for (let i = 0; i < bookmarks.length; i++) {
    const bookmark = bookmarks[i];
    await prismaClient.bookmark.upsert({
      where: { id: bookmark.id },
      create: bookmark,
      update: bookmark,
    });
  }

  // for (let i = 0; i < bookmarkRaws.length; i++) {
  //   const bookmarkRaw = bookmarkRaws[i];
  //   await prismaClient.bookmarkRaw.upsert({
  //     where: { id: bookmarkRaw.id },
  //     create: bookmarkRaw,
  //     update: bookmarkRaw,
  //   });
  // }

  for (let i = 0; i < bookmarkTags.length; i++) {
    const tags = bookmarkTags[i];
    for (let j = 0; j < tags.length; j++) {
      const tag = tags[j];
      await prismaClient.bookmarkTag.upsert({
        where: { id: tag.id },
        create: tag,
        update: tag,
      });
    }
  }
}

export default seed;
