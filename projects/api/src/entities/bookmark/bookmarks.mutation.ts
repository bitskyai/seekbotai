import { getPrismaClient } from "../../db";
import { extractPageContent } from "../../helpers/pageExtraction/index";
import { GQLContext } from "../../types";
import { schemaBuilder } from "../gql-builder";
import {
  BookmarkCreateInputType,
  CreateBookmarksRes,
  type BookmarkCreate,
} from "./Bookmark.type";
import _ from "lodash";

schemaBuilder.mutationField("createBookmarks", (t) =>
  t.field({
    type: [CreateBookmarksRes],
    args: {
      bookmarks: t.arg({ type: [BookmarkCreateInputType], required: true }),
    },
    resolve: async (root, args, ctx) => {
      const res = await createOrUpdateBookmarks({
        ctx,
        bookmarks: args.bookmarks,
      });

      return res;
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
  const bookmarksResult = [];
  //TODO: need to change to parallel
  for (let bookmark of bookmarks) {
    try {
      const createdBookmark = await prismaClient.$transaction(
        async (prisma) => {
          if (!bookmark.content && bookmark.raw) {
            const extractedPage = await extractPageContent(
              bookmark.url,
              bookmark.raw,
            );
            bookmark = _.merge(bookmark, extractedPage);
          }
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
        },
      );
      bookmarksResult.push({
        status: "success",
        url: createdBookmark.url,
        id: createdBookmark.id,
      });
    } catch (error: unknown) {
      const errorRes = {
        url: bookmark.url,
        status: "error",
        message: "",
      };
      if (error instanceof Error) {
        errorRes.message = error.message;
      } else {
        errorRes.message = error?.toString() ?? "Unknown error";
      }
      bookmarksResult.push(errorRes);
    }
  }

  return bookmarksResult;
}
