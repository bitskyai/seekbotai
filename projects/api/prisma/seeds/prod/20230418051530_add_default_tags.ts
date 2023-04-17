import { PrismaClient } from "@prisma/client";
import { getPrismaClient } from "../../../src/db";
import defaultTags from "../../../src/db/seedData/defaultTags";
import { systemShare } from "../../../src/db/seedData/defaultUsers";

async function seed(prismaClient?: PrismaClient) {
  if (!prismaClient) {
    prismaClient = getPrismaClient();
  }

  for (let i = 0; i < defaultTags.length; i++) {
    const defaultTag = defaultTags[i];
    await prismaClient.tag.upsert({
      where: { id: defaultTag.id },
      create: { ...defaultTag, userId: systemShare.id },
      update: { ...defaultTag, userId: systemShare.id },
    });
  }
}

export default seed;
