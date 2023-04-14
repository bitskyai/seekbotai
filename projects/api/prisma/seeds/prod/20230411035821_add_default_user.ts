import { PrismaClient } from "@prisma/client";
import { getPrismaClient } from "../../../src/db";
import defaultUser from "../../../src/db/defaultUser";

async function seed(prismaClient?: PrismaClient) {
  if (!prismaClient) {
    prismaClient = getPrismaClient();
  }
  // Delete previous `User`
  const user = await prismaClient.user.findFirst({
    where: { id: defaultUser.id },
  });

  if (!user) {
    await prismaClient.user.create({
      data: defaultUser,
    });
  }
}

export default seed;
