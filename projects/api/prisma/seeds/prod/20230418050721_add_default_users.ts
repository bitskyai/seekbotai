import { PrismaClient } from "@prisma/client";
import { getPrismaClient } from "../../../src/db";
import defaultUsers from "../../../src/db/seedData/defaultUsers";

async function seed(prismaClient?: PrismaClient) {
  if (!prismaClient) {
    prismaClient = getPrismaClient();
  }

  for (let i = 0; i < defaultUsers.length; i++) {
    const defaultUser = defaultUsers[i];
    await prismaClient.user.upsert({
      where: { id: defaultUser.id },
      create: defaultUser,
      update: defaultUser,
    });
  }
}

export default seed;
