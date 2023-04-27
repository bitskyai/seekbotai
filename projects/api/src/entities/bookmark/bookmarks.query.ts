import { getPrismaClient } from "../../db";
import { GQLContext } from "../../types";
import { schemaBuilder } from "../gql-builder";

schemaBuilder.queryField("bookmarks", (t) =>
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
    include: {
      bookmarkTags: {
        include: {
          tag: {
            select: {
              createdAt: true,
              name: true,
              id: true,
              userId: true,
            },
          },
        },
      },
    },
  });

  return bookmarks;
}
