import DB from "../index";
import { insert, remove } from "../rxdbWrap";
import { createAPage, deletePagesOfURL } from "./pages";

export async function createABookmark(
  url: string,
  name: string,
  content: string,
  description?: string
) {
  // TODO; need to think about case: page cannot create, rollback or other solution
  const bookmark = await insert("bookmarks", {
    url,
    tags: [],
    name,
    description: description ?? "",
    favorite: false
  });

  await createAPage(bookmark.id, url, content);

  return {
    id: bookmark.id,
    name,
    description
  };
}

export async function deleteABookmark(url: string) {
  await deletePagesOfURL(url);
  await remove("bookmarks", {
    selctor: {
      url: {
        $eq: url
      }
    }
  });
  return true;
}

export async function checkWhetherBookmarked(url: string) {
  const db = await DB();
  const bookmark = await db.bookmarks
    .findOne({
      selector: {
        url
      }
    })
    .exec();

  if (bookmark) {
    return true;
  }
  return false;
}
