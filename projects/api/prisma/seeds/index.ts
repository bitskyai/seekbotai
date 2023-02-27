import { PrismaClient } from "@prisma/client";
import seedUser from "./seed-user";

async function seed(prismaClient?: PrismaClient) {
  await seedUser(prismaClient);
}

export default seed;
