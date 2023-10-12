import { getPrismaClient } from "../../../src/db";
import { defaultPreference } from "../../../src/db/seedData/defaultPreference";
import { PrismaClient } from "@prisma/client";

async function seed(prismaClient?: PrismaClient) {
  if (!prismaClient) {
    prismaClient = getPrismaClient();
  }

  await prismaClient.preference.upsert({
    where: { id: defaultPreference.id },
    create: defaultPreference,
    update: defaultPreference,
  });
}
export default seed;
