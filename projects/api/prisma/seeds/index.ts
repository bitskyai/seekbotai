import { PrismaClient } from "@prisma/client";
import { getPrismaClient } from "../../src/db";
import seedProd from "./prod";

/**
 * Seed data for production purpose
 * @param prismaClient
 */
async function seed(prismaClient?: PrismaClient) {
  if (!prismaClient) {
    prismaClient = getPrismaClient();
  }
  await seedProd(prismaClient);
}

/**
 * Seed data that used for develop
 * @param prismaClient
 */
export async function seedDev(prismaClient?: PrismaClient) {
  await seed(prismaClient);
}

export default seed;
