import { insert, remove } from "../rxdbWrap";

export async function createAPage(
  bookmarkId: string,
  url: string,
  content: string
) {
  return insert("pages", { content, url, bookmark_id: bookmarkId });
}

export async function deletePagesOfURL(url: string) {
  return remove("pages", {
    selctor: {
      url: {
        $eq: url
      }
    }
  });
}
