import { getPrismaClient } from "../../db";
import { GQLContext } from "../../types";
import { schemaBuilder } from "../gql-builder";
import { IgnoreURLBM } from "./schema.type";

schemaBuilder.queryField("ignoreURLs", (t) =>
  t.field({
    type: [IgnoreURLBM],
    resolve: async (parent, args, ctx) => {
      return getIgnoreURLs({ ctx });
    },
  }),
);

export async function getIgnoreURLs({ ctx }: { ctx: GQLContext }) {
  const prisma = getPrismaClient();
  const ignoreURLs = await prisma.ignoreURL.findMany({
    where: {
      userId: ctx.user.id,
    },
  });
  return ignoreURLs;
}
