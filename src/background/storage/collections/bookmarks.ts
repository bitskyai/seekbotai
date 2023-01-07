import DB from "../index";

export async function createABookmark() {
  const db = await DB();
  db.bookmarks.insert({});
}
