import { readFileSync } from "fs";
import { join } from "path";
import { country, knowledge } from "./defaultTags";
import { defaultUser } from "./defaultUsers";

let bookmarkId = 0;
let bookmarkRawId = 0;
let bookmarkTagId = 0;
export const usWikipedia = {
  id: bookmarkId++,
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
  id: bookmarkRawId++,
  raw: readFileSync(join(__dirname, "./files/us_wikipedia_raw.html"), "utf-8"),
  userId: defaultUser.id,
  bookmarkId: usWikipedia.id,
};

export const usWikipediaTags = [
  {
    id: bookmarkTagId++,
    bookmarkId: usWikipedia.id,
    tagId: knowledge.id,
    userId: defaultUser.id,
  },
  {
    id: bookmarkTagId++,
    bookmarkId: usWikipedia.id,
    tagId: country.id,
    userId: defaultUser.id,
  },
];

export const indiaWikipedia = {
  id: bookmarkId++,
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
  id: bookmarkRawId++,
  raw: readFileSync(
    join(__dirname, "./files/india_wikipedia_raw.html"),
    "utf-8",
  ),
  userId: defaultUser.id,
  bookmarkId: indiaWikipedia.id,
};

export const indiaWikipediaTags = [
  {
    id: bookmarkTagId++,
    bookmarkId: indiaWikipedia.id,
    tagId: knowledge.id,
    userId: defaultUser.id,
  },
  {
    id: bookmarkTagId++,
    bookmarkId: indiaWikipedia.id,
    tagId: country.id,
    userId: defaultUser.id,
  },
];

export const bookmarks = [usWikipedia, indiaWikipedia];
export const bookmarkRaws = [usWikipediaRaw, indiaWikipediaRaw];
export const bookmarkTags = [usWikipediaTags, indiaWikipediaTags];
