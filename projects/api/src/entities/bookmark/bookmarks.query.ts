import { getPrismaClient } from "../../db";
import { GQLContext } from "../../types";
import { schemaBuilder } from "../gql-builder";
import { BookmarkSortOrderInput } from "./Bookmark.type";

schemaBuilder.queryField("bookmarks", (t) =>
  t.prismaField({
    type: ["Bookmark"],
    args: {
      searchString: t.arg.string({ required: false }),
      tags: t.arg.intList({ required: false }),
      skip: t.arg.int(),
      take: t.arg.int(),
      orderBy: t.arg({
        type: BookmarkSortOrderInput,
      }),
    },
    resolve: async (query, parent, args, ctx, info) => {
      return getBookmarks(
        ctx,
        args.searchString || undefined,
        args.tags || undefined,
      );
    },
  }),
);

export async function getBookmarks(
  ctx: GQLContext,
  searchString?: string,
  tags?: number[],
) {
  const prismaClient = getPrismaClient();
  const or = searchString
    ? {
        AND: [
          // { name: { contains: searchString } },
          // { description: { contains: searchString } },
          // { url: { contains: searchString } },
          { content: { contains: searchString } },
        ],
      }
    : {};
  let bookmarkIds = {};
  if (tags?.length) {
    // TODO: Tags support and and also need to support pagination
    const bookmarks = await prismaClient.bookmarkTag.findMany({
      select: {
        bookmarkId: true,
      },
      where: {
        userId: ctx.user.id,
        tagId: {
          in: tags,
        },
      },
    });

    bookmarkIds = {
      AND: {
        id: { in: bookmarks.map((bookmark) => bookmark.bookmarkId) },
      },
    };
  }
  const bookmarks = await prismaClient.bookmark.findMany({
    where: { userId: ctx.user.id, ...or, ...bookmarkIds },
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
