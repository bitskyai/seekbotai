import { getPrismaClient } from "../../db";
import { GQLContext } from "../../types";
import { builder } from "../gql-builder";

builder.queryField("bookmarkTags", (t) =>
  t.prismaField({
    type: ["BookmarkTag"],
    resolve: async (query, root, args, ctx, info) => {
      console.log(`bookmarkTags->query: `, query);
      return getBookmarkTags(ctx);
    },
  }),
);

export async function getBookmarkTags(ctx: GQLContext) {
  const prismaClient = getPrismaClient();
  const bookmarks = await prismaClient.bookmarkTag.findMany({
    where: { userId: ctx.user.id },
  });

  return bookmarks;
}
