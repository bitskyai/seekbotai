import { getPrismaClient } from "../../src/db";
import { PrismaClient } from "@prisma/client";

async function seed(prismaClient?: PrismaClient) {
  if (!prismaClient) {
    prismaClient = getPrismaClient();
  }
  // Delete all `User` and `Message` records
  await prismaClient.user.deleteMany({});
  // (Re-)Create dummy `User` and `Message` records
  await prismaClient.user.create({
    data: {
      name: "Jack",
    },
  });
}

export default seed;
