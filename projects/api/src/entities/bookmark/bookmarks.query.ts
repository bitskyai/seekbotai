import { getPrismaClient } from "../../db";
import { GQLContext } from "../../types";
import { builder } from "../gql-builder";

builder.queryField("bookmarks", (t) =>
  t.prismaField({
    type: ["Bookmark"],
    resolve: async (query, root, args, ctx, info) => {
      return getBookmarks(ctx);
    },
  }),
);

export async function getBookmarks(ctx: GQLContext) {
  const prismaClient = getPrismaClient();
  const bookmarks = await prismaClient.bookmark.findMany({
    where: { userId: ctx.user.id },
  });

  return bookmarks;
}
