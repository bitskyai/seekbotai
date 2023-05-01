import { getPrismaClient } from "../../../src/db";
import { defaultUser } from "../../../src/db/seedData/defaultUsers";
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
      create: { ...tag, userId: defaultUser.id },
      update: { ...tag, userId: defaultUser.id },
    });
  }
}

export default seed;
