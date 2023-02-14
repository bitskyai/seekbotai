import { PrismaClient } from "@prisma/client";
import { getAppConfig } from "./helpers/config";
export const prisma = new PrismaClient({
  datasources: { db: { url: getAppConfig().DATABASE_URL } },
});
