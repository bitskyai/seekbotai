import DB from "../index";

export async function createABookmark() {
  const db = await DB();
  db.bookmarks.insert({});
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
