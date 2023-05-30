import { getPrismaClient } from "../../db";
import { GQLContext } from "../../types";
import { schemaBuilder } from "../gql-builder";
import {
  BookmarkCreateInputType,
  Bookmark,
  BookmarkResult,
  type BookmarkCreate,
} from "./Bookmark.type";

schemaBuilder.mutationField("createBookmarks", (t) =>
  t.field({
    type: [Bookmark],
    args: {
      bookmarks: t.arg({ type: [BookmarkCreateInputType], required: true }),
    },
    resolve: async (root, args, ctx) => {
      return createOrUpdateBookmarks({
        ctx,
        bookmarks: args.bookmarks,
      });
    },
  }),
);

export async function createOrUpdateBookmarks({
  ctx,
  bookmarks,
}: {
  ctx: GQLContext;
  bookmarks: BookmarkCreate[];
}) {
  const prismaClient = getPrismaClient();
  //TODO: need to change to parrallel
  const successBookmarks = [];
  const failedBookmarks = [];
  for (const bookmark of bookmarks) {
    try {
      successBookmarks.push(
        await prismaClient.$transaction(async (prisma) => {
          const result = await prisma.bookmark.upsert({
            where: {
              userId_url: { url: bookmark.url, userId: ctx.user.id },
            },
            create: {
              name: bookmark.name,
              description: bookmark.description,
              url: bookmark.url,
              icon: bookmark.icon,
              userId: ctx.user.id,
              content: bookmark.content,
            },
            update: {
              name: bookmark.name,
              description: bookmark.description,
              url: bookmark.url,
              icon: bookmark.icon,
              userId: ctx.user.id,
              content: bookmark.content,
            },
          });
          const bookmarkTags = bookmark.bookmarkTags || [];
          for (let i = 0; i < bookmarkTags.length; i++) {
            const tagName = bookmarkTags[i];
            const tag = await prisma.tag.upsert({
              where: {
                userId_name: { name: tagName, userId: ctx.user.id },
              },
              create: {
                name: tagName,
                userId: ctx.user.id,
              },
              update: {
                name: tagName,
                userId: ctx.user.id,
              },
            });
            await prisma.bookmarkTag.upsert({
              where: {
                userId_tagId_bookmarkId: {
                  bookmarkId: result.id,
                  tagId: tag.id,
                  userId: ctx.user.id,
                },
              },
              create: {
                userId: ctx.user.id,
                bookmarkId: result.id,
                tagId: tag.id,
              },
              update: {
                userId: ctx.user.id,
                bookmarkId: result.id,
                tagId: tag.id,
              },
            });
          }
          return result;
        }),
      );
    } catch (error) {
      failedBookmarks.push(bookmark);
      console.log("error", error);
    }
  }
  // return {
  //   success: successBookmarks,
  //   fail: failedBookmarks,
  // };
  return successBookmarks;
}
