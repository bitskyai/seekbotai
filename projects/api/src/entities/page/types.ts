import type { PageMetadata, Page, Tag, PageTag } from "@prisma/client";

export type CreateOrUpdatePageRes = {
  url: string;
  id?: string;
  status?: string;
  code?: string;
  message?: string;
};

export type PageMetadataShape = Partial<PageMetadata>;

export type PageTagWithNameShape = Partial<PageTag> & Pick<Tag, "name">;

export type PageShape = Partial<Page>;

export type TagShape = Partial<Tag>;

export type PageTagShape = Partial<PageTag>;

export type PageCreateOrUpdateShape = PageShape & {
  url: string;
  raw?: string;
  pageTags?: PageTagWithNameShape[];
  pageMetadata?: PageMetadataShape;
};

export type PageTagOutput = PageTag & {
  tag: Tag;
};

export type SearchResultPage = Page & {
  pageMetadata: PageMetadata;
  pageTags: PageTagOutput[];
};