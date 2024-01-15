import { getPrismaClient } from "../../db";
import { systemShare } from "../../db/seedData/defaultUsers";
import { GQLContext } from "../../types";
import { getSchemaBuilder } from "../gql-builder";

getSchemaBuilder().queryField("tags", (t) =>
  t.prismaField({
    type: ["Tag"],
    resolve: async (query, root, args, ctx, info) => {
      return getTags(ctx);
    },
  }),
);

export async function getTags(ctx: GQLContext) {
  const prismaClient = getPrismaClient();
  const systemTags = await prismaClient.tag.findMany({
    where: { userId: systemShare.id },
  });
  const userTags = await prismaClient.tag.findMany({
    where: { userId: ctx.user.id },
  });

  return userTags.concat(systemTags);
}
