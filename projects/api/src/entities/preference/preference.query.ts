import { getPrismaClient } from "../../db";
import { GQLContext } from "../../types";
import { schemaBuilder } from "../gql-builder";
import { QueryPreferenceBM } from "./schema.type";
import { QueryPreference } from "./types";

schemaBuilder.queryField("preference", (t) =>
  t.field({
    type: QueryPreferenceBM,
    resolve: async (parent, args, ctx) => {
      return getPreference({ ctx });
    },
  }),
);

export async function getPreference({
  ctx,
}: {
  ctx: GQLContext;
}): Promise<QueryPreference> {
  const prisma = getPrismaClient();
  const preference = await prisma.preference.findFirst({
    where: {
      id: ctx.user.id,
    },
    include: {
      ignoreURLs: true,
    },
  });

  return preference ?? {};
}
