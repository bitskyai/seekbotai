import { getPrismaClient } from "../db";

/**
 * What is possible to change in page:
 * 1. Update page - Browser extension capture new version of page
 * 2. Update page metadata - Browser extension capture new version of page or user update page metadata(like displayTitle, displayDescription, favorite, bookmarked, etc)
 * 3. Update page tag - User add tag to page
 * 4. Remove page tag - User remove tag to page
 * 5. Update tag - User add/edit/remove tag and those tags are used by pages
 *
 * Following cases are handled by other place:
 * 1. Remove page - When a user remove a page need to remove from index first that remove from database
 * @param since
 * @returns
 */
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
          // case 1: when update page
          updatedAt: {
            gte: since.toISOString(),
          },
        },
        {
          // case 2: when update page metadata
          pageMetadata: {
            updatedAt: {
              gte: since.toISOString(),
            },
          },
        },
        {
          // case 3: when add page tag
          pageTags: {
            some: {
              updatedAt: {
                gte: since.toISOString(),
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

export const getPagesByIds = async (ids: string[]) => {
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
      id: {
        in: ids,
      },
    },
  });

  return pages;
};
