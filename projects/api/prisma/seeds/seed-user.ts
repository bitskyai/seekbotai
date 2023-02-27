import { PrismaClient } from "@prisma/client";
import { prisma } from "../../src/db";

async function seed(prismaClient?: PrismaClient) {
  if (!prismaClient) {
    prismaClient = prisma;
  }
  // Delete all `User` and `Message` records
  await prismaClient.message.deleteMany({});
  await prismaClient.user.deleteMany({});
  // (Re-)Create dummy `User` and `Message` records
  await prismaClient.user.create({
    data: {
      name: "Jack",
      messages: {
        create: [
          {
            body: "A Note for Jack",
          },
          {
            body: "Another note for Jack",
          },
        ],
      },
    },
  });
  await prismaClient.user.create({
    data: {
      name: "Ryan",
      messages: {
        create: [
          {
            body: "A Note for Ryan",
          },
          {
            body: "Another note for Ryan",
          },
        ],
      },
    },
  });
  await prismaClient.user.create({
    data: {
      name: "Adam",
      messages: {
        create: [
          {
            body: "A Note for Adam",
          },
          {
            body: "Another note for Adam",
          },
        ],
      },
    },
  });
}

export default seed;
