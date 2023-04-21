import { getPrismaClient } from "../../../src/db";
import { systemShare } from "../../../src/db/seedData/defaultUsers";
import { PrismaClient } from "@prisma/client";

async function seed(prismaClient?: PrismaClient) {
  if (!prismaClient) {
    prismaClient = getPrismaClient();
  }

  const tags = [
    {
      id: 100,
      name: "Test",
    },
  ];

  for (let i = 0; i < tags.length; i++) {
    const tag = tags[i];
    await prismaClient.tag.upsert({
      where: { id: tag.id },
      create: { ...tag, userId: systemShare.id },
      update: { ...tag, userId: systemShare.id },
    });
  }
}

export default seed;
