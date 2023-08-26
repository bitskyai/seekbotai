import { SortOrder } from "../common.type";
import { schemaBuilder } from "../gql-builder";

export const Page = schemaBuilder.prismaObject("Page", {
  fields: (t) => ({
    id: t.exposeID("id"),
    createdAt: t.expose("createdAt", { type: "DateTime" }),
    updatedAt: t.expose("updatedAt", { type: "DateTime" }),
    title: t.exposeString("title"),
    description: t.exposeString("description", { nullable: true }),
    icon: t.exposeString("icon", { nullable: true }),
    url: t.exposeString("url"),
    pageTags: t.relation("pageTags"),
    pageMetadata: t.relation("pageMetadata"),
    content: t.exposeString("content", { nullable: true }),
  }),
});

export const PageMetadata = schemaBuilder.inputType("PageMetadata", {
  fields: (t) => ({
    displayTitle: t.string({ required: false }),
    displayDescription: t.string({ required: false }),
    localMode: t.boolean({ required: false }),
    favorite: t.boolean({ required: false }),
    bookmarked: t.boolean({ required: false }),
    incognito: t.boolean({ required: false }),
    tabId: t.int({ required: false }),
    visitCount: t.int({ required: false }),
    typedCount: t.int({ required: false }),
  }),
});

export const PageCreateInputType = schemaBuilder.inputType(
  "PageCreateInputType",
  {
    fields: (t) => ({
      title: t.string({ required: true }),
      description: t.string({ required: false }),
      url: t.string({ required: true }),
      icon: t.string({ required: false }),
      content: t.string({ required: false }),
      raw: t.string({ required: false }),
      pageTags: t.stringList({ required: false }),
      PageMetadata: t.field({
        type: PageMetadata,
        required: false,
      }),
    }),
  },
);

export const PageResult = schemaBuilder.simpleObject("PageResult", {
  fields: (t) => ({
    url: t.string({ nullable: true }),
    id: t.string({ nullable: true }),
    name: t.string({ nullable: true }),
    status: t.string({ nullable: true }),
  }),
});

export const CreatePagesRes = schemaBuilder.simpleObject("CreatePagesRes", {
  fields: (t) => ({
    url: t.string({ nullable: false }),
    id: t.string({ nullable: true }),
    status: t.string({ nullable: true }),
    code: t.string({ nullable: true }),
    message: t.string({ nullable: true }),
  }),
});

export type pageMetadata = {
  displayTitle?: string;
  displayDescription?: string;
  localMode?: boolean;
  favorite?: boolean;
  bookmarked?: boolean;
  incognito?: boolean;
  tabId?: number;
  visitCount?: number;
  typedCount?: number;
};

export type PageCreate = {
  title?: string;
  description?: string | null | undefined;
  url: string;
  icon?: string | null | undefined;
  content?: string | null | undefined;
  raw?: string | null | undefined;
  pageTags?: string[] | null | undefined;
  pageMetadata?: pageMetadata | null | undefined;
};

export const PageSortOrderInput = schemaBuilder.inputType(
  "PageSortOrderInput",
  {
    fields: (t) => ({
      updatedAt: t.field({
        type: SortOrder,
      }),
    }),
  },
);
