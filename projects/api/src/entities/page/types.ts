import type { PageMetadata, Page, Tag, PageTag } from "@prisma/client";

export type CreateOrUpdatePageRes = {
  url: string;
  id?: string;
  status?: string;
  code?: string;
  message?: string;
};

export type PageMetadataShape = Partial<PageMetadata>;

export type PageTagShape = Partial<PageTag> & Pick<Tag, "name">;

export type PageShape = Partial<Page>;

export type PageCreateOrUpdateShape = PageShape & {
  url: string;
  raw?: string;
  pageTags?: PageTagShape[];
  pageMetadata?: PageMetadataShape;
};
