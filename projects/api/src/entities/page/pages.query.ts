import { getPrismaClient } from "../../db";
import { PAGES_INDEX_NAME, getMeiliSearchClient } from "../../searchEngine";
import { GQLContext } from "../../types";
import { getSchemaBuilder } from "../gql-builder";
import { PageSortOrderInput, SearchResultPageBM } from "./schema.type";
import { SearchResultPage } from "./types";

getSchemaBuilder().queryField("pages", (t) =>
  t.field({
    type: [SearchResultPageBM],
    args: {
      searchString: t.arg.string(),
      tags: t.arg.stringList(),
      skip: t.arg.int(),
      take: t.arg.int(),
      insensitive: t.arg.boolean(),
      orderBy: t.arg({
        type: PageSortOrderInput,
      }),
    },
    resolve: async (parent, args, ctx) => {
      // return getPages({
      //   ctx,
      //   searchString: args.searchString || undefined,
      //   tags: args.tags || undefined,
      // });
      return meiliSearch({
        ctx,
        searchString: args.searchString || undefined,
        tags: args.tags || undefined,
      });
    },
  }),
);

export async function meiliSearch({
  ctx,
  searchString,
  tags,
}: {
  ctx: GQLContext;
  searchString?: string;
  tags?: string[];
}) {
  const client = await getMeiliSearchClient();
  const result = await client.index(PAGES_INDEX_NAME).search(searchString);
  return result.hits as SearchResultPage[];
}

export async function getPages({
  ctx,
  searchString,
  tags,
}: {
  ctx: GQLContext;
  searchString?: string;
  tags?: string[];
}) {
  const OR_CONDITION_SPLITER = ",";
  const AND_CONDITION_SPLITER = "+";
  const searchProperties: string[] = ["name", "description", "url", "content"];

  const prismaClient = getPrismaClient();
  const orConditions: object[] = [];
  searchString = searchString?.trim();
  if (searchString) {
    // get all OR conditions
    const orConditionSearchStrings =
      searchString?.split(OR_CONDITION_SPLITER) || [];

    if (orConditionSearchStrings.length > 0) {
      orConditionSearchStrings.map((orConditionSearchString) => {
        orConditionSearchString = orConditionSearchString.trim();
        if (orConditionSearchString) {
          const subOrConditions: object[] = [];
          searchProperties.map((property) => {
            const andConditions: object[] = [];
            const andConditionSearchStrings = orConditionSearchString.split(
              AND_CONDITION_SPLITER,
            );

            andConditionSearchStrings.map((andConditionSearchString) => {
              andConditionSearchString = andConditionSearchString.trim();
              if (andConditionSearchString) {
                const andCondition = {
                  [property]: { contains: andConditionSearchString },
                };

                andConditions.push(andCondition);
              }
            });

            if (andConditions.length > 0) {
              subOrConditions.push({
                AND: andConditions,
              });
            }
          });

          if (subOrConditions.length > 0) {
            orConditions.push({
              OR: subOrConditions,
            });
          }
        }
      });
    }
  }

  const orSearchByString = orConditions.length
    ? {
        OR: orConditions,
      }
    : {};

  let pageIds = {};
  if (tags?.length) {
    // TODO: Tags support and and also need to support pagination
    const pages = await prismaClient.pageTag.findMany({
      select: {
        pageId: true,
      },
      where: {
        userId: ctx.user.id,
        tagId: {
          in: tags,
        },
      },
    });

    pageIds = {
      AND: {
        id: { in: pages.map((page) => page.pageId) },
      },
    };
  }
  const pages = await prismaClient.page.findMany({
    where: {
      userId: ctx.user.id,
      ...orSearchByString,
      ...pageIds,
    },
    orderBy: {
      updatedAt: "desc",
    },
    include: {
      pageTags: {
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

  return pages;
}
