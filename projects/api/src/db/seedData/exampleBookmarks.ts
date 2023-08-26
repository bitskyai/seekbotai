import { country, knowledge } from "./defaultTags";
import { defaultUser } from "./defaultUsers";
import { readFileSync } from "fs";
import { join } from "path";

export const usWikipedia = {
  id: "751cb9ec-869a-46fd-bd80-0d3f5a27ec18",
  userId: defaultUser.id,
  title: "United States - Wikipedia",
  description: "",
  url: "https://en.wikipedia.org/wiki/United_States",
  content: readFileSync(
    join(__dirname, "./files/us_wikipedia_content.txt"),
    "utf-8",
  ),
};

export const usWikipediaRaw = {
  id: "2cc63734-f9b6-438b-8576-9326daf518ac",
  raw: readFileSync(join(__dirname, "./files/us_wikipedia_raw.html"), "utf-8"),
  userId: defaultUser.id,
  pageId: usWikipedia.id,
};

export const usWikipediaTags = [
  {
    id: "b42136dd-492c-468d-92b2-2ceb44d8f727",
    pageId: usWikipedia.id,
    tagId: knowledge.id,
    userId: defaultUser.id,
  },
  {
    id: "c6b6a4ad-8700-4b23-9ddd-be231b250b4f",
    pageId: usWikipedia.id,
    tagId: country.id,
    userId: defaultUser.id,
  },
];

export const usWikipediaPageMetadata = {
  id: "f8209194-d943-43f0-a998-8129a3923f78",
  userId: defaultUser.id,
  pageId: usWikipedia.id,
  displayTitle: "WikiPedia United States",
  bookmarked: true,
};

export const indiaWikipedia = {
  id: "ce134dd0-7241-4fc5-9120-02029cd5cd98",
  userId: defaultUser.id,
  title: "India - Wikipedia",
  description: "",
  url: "https://en.wikipedia.org/wiki/India",
  content: readFileSync(
    join(__dirname, "./files/india_wikipedia_content.txt"),
    "utf-8",
  ),
};

export const indiaWikipediaRaw = {
  id: "bc3229d7-7857-43bf-a827-c78ffceb2c8e",
  raw: readFileSync(
    join(__dirname, "./files/india_wikipedia_raw.html"),
    "utf-8",
  ),
  userId: defaultUser.id,
  pageId: indiaWikipedia.id,
};

export const indiaWikipediaTags = [
  {
    id: "aee3375d-aece-477a-bd05-7f52864a70d9",
    pageId: indiaWikipedia.id,
    tagId: knowledge.id,
    userId: defaultUser.id,
  },
  {
    id: "ec0f21b2-9609-4773-9ae0-8e1a114c72e9",
    pageId: indiaWikipedia.id,
    tagId: country.id,
    userId: defaultUser.id,
  },
];

export const indiaWikipediaPageMetadata = {
  id: "2b603de3-174c-4526-9a30-a9af740e6ef0",
  userId: defaultUser.id,
  pageId: indiaWikipedia.id,
  displayTitle: "WikiPedia India",
  bookmarked: true,
};

export const pages = [usWikipedia, indiaWikipedia];
export const pageRaws = [usWikipediaRaw, indiaWikipediaRaw];
export const pageTags = [usWikipediaTags, indiaWikipediaTags];
export const pageMetadata = [
  usWikipediaPageMetadata,
  indiaWikipediaPageMetadata,
];
