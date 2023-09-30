import { getAppConfig } from "../config";
import * as cheerio from "cheerio";
import * as crypto from "crypto";
import * as fs from "fs";
import sizeOf from "image-size";
import * as os from "os";
import * as path from "path";
import sharp from "sharp";

// Function to add spaces between adjacent text nodes in a Cheerio selection
function addSpacesBetweenTextNodes($el: cheerio.Cheerio, $: cheerio.Root) {
  $el.contents().each((index, node) => {
    if (node.type === "text") {
      node.data += " ";
    } else {
      addSpacesBetweenTextNodes($(node), $);
    }
  });
}

function getContent($: cheerio.Root) {
  // remove unwanted elements
  $("script").remove();
  $("style").remove();
  $("noscript").remove();
  $("iframe").remove();
  $("img").remove();
  $("svg").remove();
  $("video").remove();
  $("audio").remove();
  $("canvas").remove();
  $("map").remove();
  addSpacesBetweenTextNodes($("body"), $);

  let content = $("body").prop("innerText");
  // replace multiple new lines to space
  content = content.replace(/\n+/g, " ");
  // remove multiple spaces to only keep one
  content = content.replace(/\s+/g, " ");
  return content;
}

function getIcon($: cheerio.Root, url: string) {
  const parsedUrl = new URL(url);
  let icon = $('link[rel="icon"]').attr("href")?.trim();
  if (!icon) icon = $('link[rel="shortcut icon"]').attr("href")?.trim();
  if (!icon) icon = $('link[rel="apple-touch-icon"]').attr("href")?.trim();
  if (!icon)
    icon = $('link[rel="apple-touch-icon-precomposed"]').attr("href")?.trim();
  icon = $('link[rel="apple-touch-startup-image"]').attr("href")?.trim();
  if (!icon) icon = $('link[rel="fluid-icon"]').attr("href")?.trim();
  if (!icon) icon = $('link[rel="mask-icon"]').attr("href")?.trim();
  if (!icon) {
    icon = $('link[rel*="icon"]').attr("href")?.trim();
  }

  if (icon && icon.startsWith("//")) {
    // miss protocol
    icon = `${parsedUrl.protocol}${icon}`;
  } else if (icon && icon.startsWith("/")) {
    // miss host
    icon = `${parsedUrl.origin}${icon}`;
  } else {
    icon = `${parsedUrl.origin}/favicon.ico`;
  }
  return icon;
}

export async function extractPageContent(url: string, html: string) {
  const $ = cheerio.load(html);
  const title = $("title").text();
  const description = $("meta[name=description]").attr("content");
  const icon = getIcon($, url);
  const content = getContent($);

  return {
    url,
    title,
    description,
    icon,
    content,
  };
}

export async function saveRawPage(url: string, html: string) {
  try {
    const { SAVE_RAW_PAGE, APP_HOME_PATH } = getAppConfig();
    if (!SAVE_RAW_PAGE) return;
    const fileName = crypto.createHash("sha256").update(url).digest("hex");
    const fileDirectory = `${APP_HOME_PATH}/rawPages`;
    if (!fs.existsSync(fileDirectory)) {
      // If the directory doesn't exist, create it recursively
      fs.mkdirSync(fileDirectory, { recursive: true });
    }
    const filePath = path.join(fileDirectory, `${fileName}.html`);
    console.log(`Saving raw page to ${filePath}`);
    fs.writeFileSync(filePath, html);
    return fileName;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function saveScreenshot(
  url: string,
  screenshot: string,
): Promise<{
  fullSizeScreenshotPath?: string;
  previewScreenshotPath?: string;
}> {
  try {
    const {
      APP_HOME_PATH,
      SAVE_FULL_SIZE_SCREENSHOT,
      SCREENSHOT_FOLDER,
      SCREENSHOT_FULL_SIZE_FOLDER,
      SCREENSHOT_PREVIEW_FOLDER,
      SCREENSHOT_PREVIEW_CROP_HEIGHT,
    } = getAppConfig();
    const fileName = crypto.createHash("sha256").update(url).digest("hex");
    const screenshotsPath = path.join(`${APP_HOME_PATH}`, SCREENSHOT_FOLDER);
    let fullSizePath = path.join(screenshotsPath, SCREENSHOT_FULL_SIZE_FOLDER);
    if (!SAVE_FULL_SIZE_SCREENSHOT) {
      fullSizePath = os.tmpdir();
    }
    const previewPath = path.join(screenshotsPath, SCREENSHOT_PREVIEW_FOLDER);
    if (!fs.existsSync(fullSizePath)) {
      // If the directory doesn't exist, create it recursively
      fs.mkdirSync(fullSizePath, {
        recursive: true,
      });
    }

    if (!fs.existsSync(previewPath)) {
      // If the directory doesn't exist, create it recursively
      fs.mkdirSync(previewPath, {
        recursive: true,
      });
    }
    screenshot = screenshot.replace(/^['"]|['"]$/g, "");
    screenshot = screenshot.replace(/^data:image\/png;base64,/, "");
    const fullSizeScreenshotPath = path.join(fullSizePath, `${fileName}.png`);
    const previewScreenshotPath = path.join(previewPath, `${fileName}.png`);
    const buffer = Buffer.from(screenshot, "base64");
    fs.writeFileSync(fullSizeScreenshotPath, buffer);
    const dimensions = sizeOf(buffer);
    const previewWidth = Math.floor(
      (500 / SCREENSHOT_PREVIEW_CROP_HEIGHT) * (dimensions.width ?? 1024),
    );
    await sharp(buffer)
      .extract({
        left: 0,
        width: dimensions.width ?? 1024,
        top: 0,
        height: SCREENSHOT_PREVIEW_CROP_HEIGHT,
      })
      .resize(previewWidth, 500)
      .toFile(previewScreenshotPath);
    return {
      fullSizeScreenshotPath: SAVE_FULL_SIZE_SCREENSHOT
        ? path.join(
            SCREENSHOT_FOLDER,
            SCREENSHOT_FULL_SIZE_FOLDER,
            `${fileName}.png`,
          )
        : undefined,
      previewScreenshotPath: path.join(
        SCREENSHOT_FOLDER,
        SCREENSHOT_PREVIEW_FOLDER,
        `${fileName}.png`,
      ),
    };
  } catch (err) {
    console.error(err);
    return {};
  }
}
