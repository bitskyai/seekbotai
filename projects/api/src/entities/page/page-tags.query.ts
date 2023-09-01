import { getPrismaClient } from "../../db";
import getLogger from "../../helpers/logger";
import { GQLContext } from "../../types";
import { schemaBuilder } from "../gql-builder";

const logger = getLogger();

schemaBuilder.queryField("pageTags", (t) =>
  t.prismaField({
    type: ["PageTag"],
    resolve: async (query, root, args, ctx, info) => {
      logger.debug(`pageTags->query: `, query);
      return getPageTags(ctx);
    },
  }),
);

export async function getPageTags(ctx: GQLContext) {
  const prismaClient = getPrismaClient();
  const pages = await prismaClient.pageTag.findMany({
    where: { userId: ctx.user.id },
  });

  return pages;
}
