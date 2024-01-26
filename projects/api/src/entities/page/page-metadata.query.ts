import { getPrismaClient } from "../../db";
import getLogger from "../../helpers/logger";
import { GQLContext } from "../../types";
import { getSchemaBuilder } from "../gql-builder";
import { PageMetadataBM } from "./schema.type";

getSchemaBuilder().queryField("pageMetadata", (t) =>
  t.prismaField({
    type: [PageMetadataBM],
    resolve: async (query, root, args, ctx, info) => {
      const logger = getLogger();
      logger.debug(`pageMetadata->query: `, query);
      return getPageMetadata(ctx);
    },
  }),
);

export async function getPageMetadata(ctx: GQLContext) {
  const prismaClient = getPrismaClient();
  const pageMetadatas = await prismaClient.pageMetadata.findMany({
    where: { userId: ctx.user.id },
  });

  return pageMetadatas;
}
