import { getPrismaClient } from "../db";

export const getChangedPages = async (since: Date) => {
  const prismaClient = getPrismaClient();
  const pages = await prismaClient.page.findMany({
    include: {
      pageTags: {
        include: {
          tag: {
            select: {
              createdAt: true,
              updatedAt: true,
              name: true,
              id: true,
              version: true,
            },
          },
        },
      },
      pageMetadata: {
        select: {
          id: true,
          createdAt: true,
          updatedAt: true,
          lastVisitTime: true,
          pageId: true,
          displayTitle: true,
          displayDescription: true,
          localMode: true,
          favorite: true,
          bookmarked: true,
          incognito: true,
          tabId: true,
          visitCount: true,
          typedCount: true,
          version: true,
          hostName: true,
          screenshot: true,
          screenshotPreview: true,
        },
      },
    },
    where: {
      OR: [
        {
          updatedAt: {
            gt: new Date(since),
          },
        },
        {
          pageMetadata: {
            updatedAt: {
              gt: new Date(since),
            },
          },
        },
        {
          pageTags: {
            some: {
              tag: {
                updatedAt: {
                  gt: new Date(since),
                },
              },
            },
          },
        },
      ],
    },
  });

  // console.log(pages);
  return pages;
};
