import * as cheerio from "cheerio";

export async function extractPageContent(url: string, html: string) {
  const $ = cheerio.load(html);
  const title = $("title").text();
  const description = $("meta[name=description]").attr("content");
  const icon = $('link[rel="shortcut icon"]').attr("href");
  const content = $("body").text();
  return {
    url,
    title,
    description,
    icon,
    content,
  };
}
