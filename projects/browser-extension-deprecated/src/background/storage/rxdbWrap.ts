import { v4 as uuidv4 } from "uuid";

import DB from "./index";
import type { Document } from "./types";

export async function insert(schema: string, data: Document) {
  const db = await DB();
  const insertData = data;
  if (!data.id) {
    insertData.id = uuidv4();
  }
  insertData.created_at = new Date().toISOString();
  insertData.updated_at = data.created_at;
  return db[schema].insert(insertData);
}

export async function remove(schema: string, selector: Object) {
  const db = await DB();
  const query = db[schema].find(selector);
  return query.remove();
}
