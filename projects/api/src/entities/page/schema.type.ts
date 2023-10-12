import { SortOrder } from "../common.type";
import type { MutationResShape } from "../common.type";
import { schemaBuilder } from "../gql-builder";
import type {
  PageMetadataShape,
  PageCreateOrUpdateShape,
  PageTagWithNameShape,
  PageTagOutput,
  CreateOrUpdatePageRes,
  SearchResultPage,
  UpdatablePageMetadataShape,
  UpdatePageTagShape,
  DeletePageShape,
} from "./types";
import type { PageMetadata, Tag } from "@prisma/client";

export const PageBM = schemaBuilder.prismaObject("Page", {
  fields: (t) => ({
    id: t.expose("id", { type: "UUID" }),
    createdAt: t.expose("createdAt", { type: "DateTime" }),
    updatedAt: t.expose("updatedAt", { type: "DateTime" }),
    title: t.exposeString("title"),
    description: t.exposeString("description", { nullable: true }),
    icon: t.exposeString("icon", { nullable: true }),
    url: t.expose("url", { type: "URL" }),
    pageTags: t.relation("pageTags"),
    pageMetadata: t.relation("pageMetadata"),
    content: t.exposeString("content", { nullable: true }),
  }),
});

export const PageMetadataBM = schemaBuilder.prismaObject("PageMetadata", {
  fields: (t) => ({
    id: t.exposeID("id"),
    createdAt: t.expose("createdAt", { type: "DateTime" }),
    updatedAt: t.expose("updatedAt", { type: "DateTime" }),
    lastVisitTime: t.expose("lastVisitTime", {
      type: "DateTime",
      nullable: true,
    }),
    pageId: t.expose("pageId", { type: "UUID" }),
    version: t.expose("version", { type: "Int" }),
    displayTitle: t.exposeString("displayTitle", { nullable: true }),
    displayDescription: t.exposeString("displayDescription", {
      nullable: true,
    }),
    localMode: t.exposeBoolean("localMode", { nullable: true }),
    favorite: t.exposeBoolean("favorite", { nullable: true }),
    bookmarked: t.exposeBoolean("bookmarked", { nullable: true }),
    incognito: t.exposeBoolean("incognito", { nullable: true }),
    tabId: t.expose("tabId", { type: "Int", nullable: true }),
    visitCount: t.expose("visitCount", { type: "Int", nullable: true }),
    typedCount: t.expose("typedCount", { type: "Int", nullable: true }),
  }),
});

export const PageTagBM = schemaBuilder.prismaObject("PageTag", {
  fields: (t) => ({
    id: t.exposeID("id"),
    createdAt: t.expose("createdAt", { type: "DateTime" }),
    updatedAt: t.expose("updatedAt", { type: "DateTime" }),
    pageId: t.expose("pageId", { type: "UUID" }),
    version: t.expose("version", { type: "Int" }),
    tag: t.relation("tag"),
  }),
});

export const TagTypeBM = schemaBuilder.objectRef<Tag>("TagDetail").implement({
  fields: (t) => ({
    id: t.exposeID("id"),
    createdAt: t.expose("createdAt", { type: "DateTime" }),
    updatedAt: t.expose("updatedAt", { type: "DateTime" }),
    name: t.exposeString("name"),
  }),
});

export const PageTagTypeBM = schemaBuilder
  .objectRef<PageTagOutput>("PageTagDetail")
  .implement({
    fields: (t) => ({
      id: t.exposeID("id"),
      createdAt: t.expose("createdAt", { type: "DateTime" }),
      updatedAt: t.expose("updatedAt", { type: "DateTime" }),
      pageId: t.expose("pageId", { type: "UUID" }),
      version: t.expose("version", { type: "Int" }),
      tag: t.expose("tag", {
        type: TagTypeBM,
      }),
    }),
  });

export const PageMetadataShapeTypeBM = schemaBuilder
  .objectRef<PageMetadata>("PageMetadataDetail")
  .implement({
    fields: (t) => ({
      id: t.exposeID("id"),
      createdAt: t.expose("createdAt", { type: "DateTime" }),
      updatedAt: t.expose("updatedAt", { type: "DateTime" }),
      lastVisitTime: t.expose("lastVisitTime", {
        type: "DateTime",
        nullable: true,
      }),
      pageId: t.expose("pageId", { type: "UUID" }),
      version: t.expose("version", { type: "Int" }),
      displayTitle: t.exposeString("displayTitle", { nullable: true }),
      displayDescription: t.exposeString("displayDescription", {
        nullable: true,
      }),
      localMode: t.exposeBoolean("localMode", { nullable: true }),
      favorite: t.exposeBoolean("favorite", { nullable: true }),
      bookmarked: t.exposeBoolean("bookmarked", { nullable: true }),
      incognito: t.exposeBoolean("incognito", { nullable: true }),
      tabId: t.expose("tabId", { type: "Int", nullable: true }),
      visitCount: t.expose("visitCount", { type: "Int", nullable: true }),
      typedCount: t.expose("typedCount", { type: "Int", nullable: true }),
      screenshotPreview: t.exposeString("screenshotPreview", {
        nullable: true,
      }),
      screenshot: t.exposeString("screenshotPreview", { nullable: true }),
    }),
  });

export const SearchResultPageBM = schemaBuilder
  .objectRef<SearchResultPage>("SearchResultPage")
  .implement({
    fields: (t) => ({
      id: t.exposeID("id"),
      createdAt: t.expose("createdAt", { type: "DateTime" }),
      updatedAt: t.expose("updatedAt", { type: "DateTime" }),
      title: t.exposeString("title"),
      description: t.exposeString("description", { nullable: true }),
      icon: t.exposeString("icon", { nullable: true }),
      url: t.expose("url", { type: "URL" }),
      pageTags: t.expose("pageTags", {
        type: [PageTagTypeBM],
      }),
      pageMetadata: t.expose("pageMetadata", {
        type: PageMetadataShapeTypeBM,
      }),
      content: t.exposeString("content", { nullable: true }),
    }),
  });

export const PageMetadataPayloadBM = schemaBuilder
  .inputRef<PageMetadataShape>("PageMetadataPayload")
  .implement({
    fields: (t) => ({
      lastVisitTime: t.field({ type: "DateTime", required: false }),
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

export const PageTagPayloadBM = schemaBuilder
  .inputRef<PageTagWithNameShape>("PageTagPayload")
  .implement({
    fields: (t) => ({
      name: t.string({ required: true }),
    }),
  });

export const PageCreateOrUpdatePayloadBM = schemaBuilder
  .inputRef<PageCreateOrUpdateShape>("PageCreateOrUpdatePayload")
  .implement({
    fields: (t) => ({
      title: t.string({ required: false }),
      description: t.string({ required: false }),
      url: t.string({ required: true }),
      icon: t.string({ required: false }),
      content: t.string({ required: false }),
      screenshot: t.string({ required: false }),
      raw: t.string({ required: false }),
      pageTags: t.field({
        type: [PageTagPayloadBM],
        required: false,
      }),
      pageMetadata: t.field({
        type: PageMetadataPayloadBM,
        required: false,
      }),
    }),
  });

export const UpdatablePageMetadataShapeBM = schemaBuilder
  .inputRef<UpdatablePageMetadataShape>("UpdatablePageMetadataPayload")
  .implement({
    fields: (t) => ({
      pageId: t.string({ required: true }),
      displayTitle: t.string({ required: false }),
      displayDescription: t.string({ required: false }),
      localMode: t.boolean({ required: true }),
      favorite: t.boolean({ required: true }),
      bookmarked: t.boolean({ required: true }),
      incognito: t.boolean({ required: true }),
      tabId: t.int({ required: false }),
    }),
  });

export const UpdatePageTagShapeBM = schemaBuilder
  .inputRef<UpdatePageTagShape>("UpdatePageTagPayload")
  .implement({
    fields: (t) => ({
      name: t.string({ required: true }),
    }),
  });

export const CreateOrUpdatePageResBM = schemaBuilder
  .objectRef<CreateOrUpdatePageRes>("CreateOrUpdatePageRes")
  .implement({
    fields: (t) => ({
      url: t.exposeString("url", { nullable: false }),
      id: t.exposeString("id", { nullable: true }),
      status: t.exposeString("status", { nullable: true }),
      code: t.exposeString("code", { nullable: true }),
      message: t.exposeString("message", { nullable: true }),
    }),
  });

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

export const DeletePageShapeBM = schemaBuilder
  .inputRef<DeletePageShape>("DeletePagePayload")
  .implement({
    fields: (t) => ({
      pageId: t.string({ required: true }),
      pattern: t.string({ required: false }),
      ignore: t.boolean({ required: false }),
      regularExpression: t.boolean({ required: false }),
    }),
  });
