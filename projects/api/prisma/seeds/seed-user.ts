import { PrismaClient } from "@prisma/client";
import { getPrismaClient } from "../../src/db";

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
