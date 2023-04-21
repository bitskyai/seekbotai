import { country, knowledge } from "./defaultTags";
import { defaultUser } from "./defaultUsers";
import { readFileSync } from "fs";
import { join } from "path";

export const usWikipedia = {
  id: 1,
  userId: defaultUser.id,
  name: "United States - Wikipedia",
  description: "",
  favorite: true,
  url: "https://en.wikipedia.org/wiki/United_States",
  count: 0,
  content: readFileSync(
    join(__dirname, "./files/us_wikipedia_content.txt"),
    "utf-8",
  ),
};

export const usWikipediaRaw = {
  id: 1,
  raw: readFileSync(join(__dirname, "./files/us_wikipedia_raw.html"), "utf-8"),
  userId: defaultUser.id,
  bookmarkId: usWikipedia.id,
};

export const usWikipediaTags = [
  {
    id: 1,
    bookmarkId: usWikipedia.id,
    tagId: knowledge.id,
    userId: defaultUser.id,
  },
  {
    id: 2,
    bookmarkId: usWikipedia.id,
    tagId: country.id,
    userId: defaultUser.id,
  },
];

export const indiaWikipedia = {
  id: 2,
  userId: defaultUser.id,
  name: "India - Wikipedia",
  description: "",
  favorite: true,
  url: "https://en.wikipedia.org/wiki/India",
  count: 0,
  content: readFileSync(
    join(__dirname, "./files/india_wikipedia_content.txt"),
    "utf-8",
  ),
};

export const indiaWikipediaRaw = {
  id: 2,
  raw: readFileSync(
    join(__dirname, "./files/india_wikipedia_raw.html"),
    "utf-8",
  ),
  userId: defaultUser.id,
  bookmarkId: indiaWikipedia.id,
};

export const indiaWikipediaTags = [
  {
    id: 3,
    bookmarkId: indiaWikipedia.id,
    tagId: knowledge.id,
    userId: defaultUser.id,
  },
  {
    id: 4,
    bookmarkId: indiaWikipedia.id,
    tagId: country.id,
    userId: defaultUser.id,
  },
];

export const bookmarks = [usWikipedia, indiaWikipedia];
export const bookmarkRaws = [usWikipediaRaw, indiaWikipediaRaw];
export const bookmarkTags = [usWikipediaTags, indiaWikipediaTags];
