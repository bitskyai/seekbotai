import type { PageMetadata, Page, Tag, PageTag } from "@prisma/client";

export type CreateOrUpdatePageRes = {
  url: string;
  id?: string;
  status?: string;
  code?: string;
  message?: string;
};

export type PageMetadataShape = Partial<PageMetadata>;

export type PageTagWithNameShape = Pick<Tag, "name">;

export type PageShape = Partial<Page>;

export type TagShape = Partial<Tag>;

export type PageTagShape = Partial<PageTag>;

export type PageCreateOrUpdateShape = PageShape & {
  url: string;
  raw?: string;
  screenshot?: string;
  pageTags?: PageTagWithNameShape[];
  pageMetadata?: PageMetadataShape;
};

export type UpdatablePageMetadataShape = Pick<
  PageMetadata,
  | "pageId"
  | "displayTitle"
  | "displayDescription"
  | "localMode"
  | "favorite"
  | "bookmarked"
  | "incognito"
  | "tabId"
>;

export type UpdatePageTagShape = PageTagWithNameShape;

export type PageTagOutput = PageTag & {
  tag: Tag;
};

export type SearchResultPage = Page & {
  pageMetadata: PageMetadata;
  pageTags: PageTagOutput[];
};

export type MutationResShape = {
  success: boolean;
  message?: string;
};

export type DeletePageShape = {
  pageId: string;
  pattern?: string;
  ignore?: boolean;
  regularExpression?: boolean;
};
