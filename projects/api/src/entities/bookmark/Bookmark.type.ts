import { SortOrder } from "../common.type";
import { schemaBuilder } from "../gql-builder";

export const Bookmark = schemaBuilder.prismaObject("Bookmark", {
  fields: (t) => ({
    id: t.exposeID("id"),
    createdAt: t.expose("createdAt", { type: "DateTime" }),
    name: t.exposeString("name"),
    description: t.exposeString("description", { nullable: true }),
    icon: t.exposeString("icon", { nullable: true }),
    url: t.exposeString("url"),
    favorite: t.exposeBoolean("favorite"),
    bookmarkTags: t.relation("bookmarkTags"),
    content: t.exposeString("content", { nullable: true }),
  }),
});

export const BookmarkCreateInputType = schemaBuilder.inputType(
  "BookmarkCreateInputType",
  {
    fields: (t) => ({
      name: t.string({ required: true }),
      description: t.string({ required: false }),
      url: t.string({ required: true }),
      icon: t.string({ required: false }),
      bookmarkTags: t.stringList({ required: false }),
      content: t.string({ required: false }),
      raw: t.string({ required: false }),
    }),
  },
);

export const BookmarkResult = schemaBuilder.simpleObject("BookmarkResult", {
  fields: (t) => ({
    url: t.string({ nullable: true }),
    id: t.string({ nullable: true }),
    name: t.string({ nullable: true }),
    status: t.string({ nullable: true }),
  }),
});

export const CreateBookmarksRes = schemaBuilder.simpleObject(
  "CreateBookmarksRes",
  {
    fields: (t) => ({
      success: t.field({ type: BookmarkResult }),
    }),
  },
);

export type BookmarkCreate = {
  name: string;
  description?: string | null | undefined;
  url: string;
  icon?: string | null | undefined;
  bookmarkTags?: string[] | null | undefined;
  content?: string | null | undefined;
};

export const BookmarkSortOrderInput = schemaBuilder.inputType(
  "BookmarkSortOrderInput",
  {
    fields: (t) => ({
      updatedAt: t.field({
        type: SortOrder,
      }),
    }),
  },
);
