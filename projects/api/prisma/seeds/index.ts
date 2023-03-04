import seedUser from "./seed-user";
import { PrismaClient } from "@prisma/client";

async function seed(prismaClient?: PrismaClient) {
  await seedUser(prismaClient);
}

export default seed;
