import { getPrismaClient } from "../db";
import { PAGES_INDEX_NAME } from "./constants";
import { SearchEngineIndex } from "@prisma/client";
import { type Settings } from "meilisearch";

export const getPageIndex = async (): Promise<SearchEngineIndex | null> => {
  const prismaClient = getPrismaClient();
  const pageIndexingRecord = await prismaClient.searchEngineIndex.findFirst({
    where: {
      indexName: PAGES_INDEX_NAME,
    },
  });
  return pageIndexingRecord;
};

export const updatePageIndex = async ({
  lastIndexAt,
  version,
}: {
  lastIndexAt?: Date;
  version?: number;
}): Promise<void> => {
  const prismaClient = getPrismaClient();
  const updateData: { lastIndexAt?: Date; version?: number } = {};
  if (lastIndexAt) {
    updateData["lastIndexAt"] = lastIndexAt;
  }
  if (version) {
    updateData["version"] = version;
  }
  await prismaClient.searchEngineIndex.upsert({
    where: {
      indexName: PAGES_INDEX_NAME,
    },
    create: {
      indexName: PAGES_INDEX_NAME,
      lastIndexAt: lastIndexAt ?? new Date(),
      version: version ?? 0,
    },
    update: {
      ...updateData,
    },
  });
};

export const pageIndexSettings: { version: number; settings: Settings } = {
  version: 1,
  settings: {
    searchableAttributes: [
      "pageMetadata.displayTitle",
      "pageMetadata.displayDescription",
      "title",
      "description",
      "url",
      "content",
    ],
    filterableAttributes: [
      "pageMetadata.bookmarked",
      "pageMetadata.favorite",
      "pageMetadata.hostName",
      "pageMetadata.incognito",
      "pageMetadata.lastVisitTime",
      "pageMetadata.localMode",
      "pageTags.tag.name",
    ],
    sortableAttributes: [
      "pageMetadata.bookmarked",
      "pageMetadata.favorite",
      "pageMetadata.lastVisitTime",
      "pageMetadata.typeCount",
      "pageMetadata.updatedAt",
      "pageMetadata.visitCount",
    ],
    rankingRules: [
      "attribute",
      "words",
      "proximity",
      "typo",
      "sort",
      "exactness",
    ],
    distinctAttribute: "url",
    faceting: {
      maxValuesPerFacet: 100,
      sortFacetValuesBy: {
        "*": "count",
      },
    },
  },
};
