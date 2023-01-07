import DB from "../index";

export async function createAPage() {
  const db = await DB();
  db.pages.insert({});
}
