import { getPrismaClient } from "../../db";
import normalizeUrl from "../../forkRepos/normalize-url";
import getLogger from "../../helpers/logger";
import {
  extractPageContent,
  saveRawPage,
  saveScreenshot,
  removeRawPage,
  removeScreenshot,
} from "../../helpers/pageExtraction";
import {
  addDocumentsToPagesIndexByIds,
  removeDocumentsFromPagesIndexByIds,
} from "../../searchEngine";
import { GQLContext } from "../../types";
import { type MutationResShape, MutationResShapeBM } from "../common.type";
import { getSchemaBuilder } from "../gql-builder";
import {
  PageCreateOrUpdatePayloadBM,
  CreateOrUpdatePageResBM,
  UpdatePageTagShapeBM,
  PageMetadataBM,
  UpdatablePageMetadataShapeBM,
  DeletePageShapeBM,
} from "./schema.type";
import type {
  CreateOrUpdatePageRes,
  PageCreateOrUpdateShape,
  UpdatePageTagShape,
  UpdatablePageMetadataShape,
  DeletePageShape,
} from "./types";
import { PageMetadata } from "@prisma/client";
import _ from "lodash";

getSchemaBuilder().mutationField("createOrUpdatePages", (t) =>
  t.field({
    type: [CreateOrUpdatePageResBM],
    args: {
      pages: t.arg({ type: [PageCreateOrUpdatePayloadBM], required: true }),
    },
    resolve: async (root, args, ctx) => {
      const res = await createOrUpdatePages({
        ctx,
        pages: args.pages,
      });

      return res;
    },
  }),
);

export async function createOrUpdatePages({
  ctx,
  pages,
}: {
  ctx: GQLContext;
  pages: PageCreateOrUpdateShape[];
}): Promise<CreateOrUpdatePageRes[]> {
  const logger = getLogger();
  const prismaClient = getPrismaClient();
  const pagesResult = [];
  //TODO: need to change to parallel
  for (let page of pages) {
    try {
      const createdPage = await prismaClient.$transaction(async (prisma) => {
        // extract page content
        if (!page.content && page.raw) {
          const extractedPage = await extractPageContent(page.url, page.raw);
          page = _.merge(page, extractedPage);
        }
        page.url = normalizeUrl(page.url);

        // create or update page
        const result = await prisma.page.upsert({
          where: {
            userId_url_version: {
              url: page.url,
              userId: ctx.user.id,
              version: 0,
            },
          },
          create: {
            title: page.title ?? page.url,
            description: page.description,
            url: page.url,
            icon: page.icon,
            userId: ctx.user.id,
            content: page.content,
          },
          update: {
            title: page.title,
            description: page.description,
            url: page.url,
            icon: page.icon,
            userId: ctx.user.id,
            content: page.content,
          },
        });

        // Save screenshot and raw page to disk
        let rawPageFileName = null;
        let screenshot: {
          fullSizeScreenshotPath?: string;
          previewScreenshotPath?: string;
        } = {};

        if (page.screenshot) {
          screenshot = await saveScreenshot(result.id, page.screenshot);
        }
        if (!page.content && page.raw) {
          rawPageFileName = await saveRawPage(result.id, page.raw);
          logger.debug(`rawPageFileName: ${rawPageFileName}`);
        }

        // create or update `pageRaw`
        if (rawPageFileName) {
          // For now we only support one version of raw page, but we can support multiple versions in the future
          await prisma.pageRaw.upsert({
            where: {
              userId_fileName_version: {
                version: 0,
                fileName: rawPageFileName,
                userId: ctx.user.id,
              },
            },
            create: {
              userId: ctx.user.id,
              pageId: result.id,
              fileName: rawPageFileName,
            },
            update: {
              userId: ctx.user.id,
              pageId: result.id,
              fileName: rawPageFileName,
            },
          });
        }

        // create or update `pageMetadata`
        const metadata = page.pageMetadata ?? {};
        metadata.hostName = new URL(page.url).hostname;
        const currentMetadata = await prisma.pageMetadata.findFirst({
          where: {
            version: 0,
            pageId: result.id,
            userId: ctx.user.id,
          },
        });

        if (currentMetadata && !metadata.visitCount) {
          // if currentMetadata and metadata doesn't have visitCount, then auto add 1
          metadata.visitCount = currentMetadata.visitCount + 1;
        }
        metadata.screenshot =
          screenshot.fullSizeScreenshotPath ?? currentMetadata?.screenshot;
        metadata.screenshotPreview =
          screenshot.previewScreenshotPath ??
          currentMetadata?.screenshotPreview;

        await prisma.pageMetadata.upsert({
          where: {
            userId_pageId_version: {
              version: 0,
              pageId: result.id,
              userId: ctx.user.id,
            },
          },
          create: {
            userId: ctx.user.id,
            pageId: result.id,
            ...metadata,
          },
          update: {
            userId: ctx.user.id,
            pageId: result.id,
            ...metadata,
          },
        });

        // create or update `pageTags` and `tags`
        const pageTags = page.pageTags || [];
        for (let i = 0; i < pageTags.length; i++) {
          const pageTag = pageTags[i];
          const tag = await prisma.tag.upsert({
            where: {
              userId_name: { name: pageTag.name, userId: ctx.user.id },
            },
            create: {
              name: pageTag.name,
              userId: ctx.user.id,
            },
            update: {
              name: pageTag.name,
              userId: ctx.user.id,
            },
          });
          await prisma.pageTag.upsert({
            where: {
              userId_tagId_pageId: {
                pageId: result.id,
                tagId: tag.id,
                userId: ctx.user.id,
              },
            },
            create: {
              userId: ctx.user.id,
              pageId: result.id,
              tagId: tag.id,
            },
            update: {
              userId: ctx.user.id,
              pageId: result.id,
              tagId: tag.id,
            },
          });
        }
        return result;
      });
      pagesResult.push({
        status: "success",
        url: createdPage.url,
        id: createdPage.id,
      });
    } catch (error: unknown) {
      const errorRes = {
        url: page.url,
        status: "error",
        message: "",
      };
      if (error instanceof Error) {
        errorRes.message = error.message;
      } else {
        errorRes.message = error?.toString() ?? "Unknown error";
      }
      pagesResult.push(errorRes);
    }
  }

  return pagesResult;
}

getSchemaBuilder().mutationField("updatePageMetadata", (t) =>
  t.field({
    type: PageMetadataBM,
    args: {
      pageId: t.arg({ type: "String", required: true }),
      pageMetadata: t.arg({
        type: UpdatablePageMetadataShapeBM,
        required: true,
      }),
    },
    resolve: async (root, args, ctx) => {
      const res = await updatePageMetadata({
        ctx,
        pageId: args.pageId,
        pageMetadata: args.pageMetadata,
      });

      return res;
    },
  }),
);

export async function updatePageMetadata({
  ctx,
  pageId,
  pageMetadata,
}: {
  ctx: GQLContext;
  pageId: string;
  pageMetadata: UpdatablePageMetadataShape;
}): Promise<PageMetadata> {
  const prismaClient = getPrismaClient();

  const result = await prismaClient.pageMetadata.update({
    where: {
      userId_pageId_version: {
        version: 0,
        pageId: pageId,
        userId: ctx.user.id,
      },
    },
    data: pageMetadata,
  });

  // update index
  await addDocumentsToPagesIndexByIds([pageId]);

  return result;
}

// passed pageTags is the whole list of pageTags, not just the updated ones
getSchemaBuilder().mutationField("updatePageTags", (t) =>
  t.field({
    type: MutationResShapeBM,
    args: {
      pageId: t.arg({ type: "String", required: true }),
      pageTags: t.arg({
        type: [UpdatePageTagShapeBM],
        required: true,
      }),
    },
    resolve: async (root, args, ctx) => {
      const res = await updatePageTags({
        ctx,
        pageId: args.pageId,
        pageTags: args.pageTags,
      });

      return res;
    },
  }),
);

export async function updatePageTags({
  ctx,
  pageId,
  pageTags,
}: {
  ctx: GQLContext;
  pageId: string;
  pageTags: UpdatePageTagShape[];
}): Promise<MutationResShape> {
  const prismaClient = getPrismaClient();

  const currentPageTags = await prismaClient.pageTag.findMany({
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
    where: {
      userId: ctx.user.id,
      pageId: pageId,
    },
  });
  const removePageTagIds: string[] = [];
  const updatePageTagsHash: { [key: string]: string } = {};
  pageTags.map((pageTag) => (updatePageTagsHash[pageTag.name] = pageTag.name));

  for (let i = 0; i < currentPageTags.length; i++) {
    const currentPageTag = currentPageTags[i];
    if (!updatePageTagsHash[currentPageTag.tag.name]) {
      // user remove this page tag
      removePageTagIds.push(currentPageTag.id);
      delete updatePageTagsHash[currentPageTag.tag.name];
    }
    if (updatePageTagsHash[currentPageTag.tag.name]) {
      // user didn't update this page tag
      delete updatePageTagsHash[currentPageTag.tag.name];
    }
  }

  const addPageTags = Object.keys(updatePageTagsHash);

  const result = await prismaClient.$transaction(async (prisma) => {
    // remove page tags
    await prisma.pageTag.deleteMany({
      where: {
        id: {
          in: removePageTagIds,
        },
      },
    });

    for (let i = 0; i < addPageTags.length; i++) {
      const tagName = addPageTags[i];
      const tag = await prisma.tag.upsert({
        where: {
          userId_name: { name: tagName, userId: ctx.user.id },
        },
        create: {
          name: tagName,
          userId: ctx.user.id,
        },
        update: {
          name: tagName,
          userId: ctx.user.id,
        },
      });
      await prisma.pageTag.upsert({
        where: {
          userId_tagId_pageId: {
            pageId: pageId,
            tagId: tag.id,
            userId: ctx.user.id,
          },
        },
        create: {
          userId: ctx.user.id,
          pageId: pageId,
          tagId: tag.id,
        },
        update: {
          userId: ctx.user.id,
          pageId: pageId,
          tagId: tag.id,
        },
      });
    }
    return true;
  });
  // update index
  await addDocumentsToPagesIndexByIds([pageId]);

  return {
    success: !!result,
    message: "",
  };
}

getSchemaBuilder().mutationField("deletePages", (t) =>
  t.field({
    type: MutationResShapeBM,
    args: {
      pages: t.arg({
        type: [DeletePageShapeBM],
        required: true,
      }),
    },
    resolve: async (root, args, ctx) => {
      const res = await deletePages({
        ctx,
        pages: args.pages,
      });

      return res;
    },
  }),
);

export async function deletePages({
  ctx,
  pages,
}: {
  ctx: GQLContext;
  pages: DeletePageShape[];
}): Promise<MutationResShape> {
  const prismaClient = getPrismaClient();
  let deletePageIds: string[] = [];
  const ignoreURLContains: string[] = [];

  // generate deletePageIds and ignoreURLContains
  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    if (page.pageId) {
      deletePageIds.push(page.pageId);
    }
    if (page.pattern) {
      const pagesIds = await prismaClient.page.findMany({
        where: {
          url: {
            contains: page.pattern,
          },
        },
        select: {
          id: true,
        },
      });
      deletePageIds = deletePageIds.concat(pagesIds.map((page) => page.id));
      if (page.ignore) {
        ignoreURLContains.push(page.pattern);
      }
    }
  }

  deletePageIds = _.uniq(deletePageIds);

  try {
    await prismaClient.$transaction(async (prisma) => {
      await prisma.page.deleteMany({
        where: {
          id: {
            in: deletePageIds,
          },
        },
      });
      // remove screenshot
      deletePageIds.map(async (pageId) => {
        await removeScreenshot(pageId);
      });

      // remove raw page
      deletePageIds.map(async (pageId) => {
        await removeRawPage(pageId);
      });

      // also delete pages in pageIndex
      await removeDocumentsFromPagesIndexByIds(deletePageIds);
    });

    // update ignoreURLContains
    if (ignoreURLContains.length) {
      for (let i = 0; i < ignoreURLContains.length; i++) {
        await prismaClient.ignoreURL.upsert({
          where: {
            userId_pattern_regularExpression: {
              userId: ctx.user.id,
              pattern: ignoreURLContains[i],
              regularExpression: false,
            },
          },
          create: {
            userId: ctx.user.id,
            pattern: ignoreURLContains[i],
            regularExpression: false,
          },
          update: {
            userId: ctx.user.id,
            pattern: ignoreURLContains[i],
            regularExpression: false,
          },
        });
      }
    }
  } catch (error) {
    return {
      success: false,
      message: "",
    };
  }

  return {
    success: true,
    message: "",
  };
}
