import { getPrismaClient } from "../../db";
import normalizeUrl from "../../forkRepos/normalize-url";
import getLogger from "../../helpers/logger";
import {
  extractPageContent,
  saveRawPage,
  saveScreenshot,
} from "../../helpers/pageExtraction";
import { startPagesIndex } from "../../searchEngine";
import { GQLContext } from "../../types";
import { schemaBuilder } from "../gql-builder";
import {
  PageCreateOrUpdatePayloadBM,
  CreateOrUpdatePageResBM,
  UpdatePageTagShapeBM,
  PageMetadataBM,
  UpdatablePageMetadataShapeBM,
  MutationResShapeBM,
} from "./schema.type";
import type {
  CreateOrUpdatePageRes,
  PageCreateOrUpdateShape,
  UpdatePageTagShape,
  UpdatablePageMetadataShape,
  MutationResShape,
} from "./types";
import { PageMetadata } from "@prisma/client";
import _ from "lodash";

schemaBuilder.mutationField("createOrUpdatePages", (t) =>
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
        let rawPageFileName = null;
        page.url = normalizeUrl(page.url);
        let screenshot: {
          fullSizeScreenshotPath?: string;
          previewScreenshotPath?: string;
        } = {};
        if (page.screenshot) {
          screenshot = await saveScreenshot(page.url, page.screenshot);
        }
        if (!page.content && page.raw) {
          rawPageFileName = await saveRawPage(page.url, page.raw);
          logger.debug(`rawPageFileName: ${rawPageFileName}`);
          const extractedPage = await extractPageContent(page.url, page.raw);
          page = _.merge(page, extractedPage);
        }

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
            title: page.title ?? page.url,
            description: page.description,
            url: page.url,
            icon: page.icon,
            userId: ctx.user.id,
            content: page.content,
          },
        });

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

schemaBuilder.mutationField("updatePageMetadata", (t) =>
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
  await startPagesIndex();

  return result;
}

// passed pageTags is the whole list of pageTags, not just the updated ones
schemaBuilder.mutationField("updatePageTags", (t) =>
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
  await startPagesIndex();

  return {
    success: !!result,
    message: "",
  };
}
