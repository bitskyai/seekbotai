import { RxDatabase, createRxDatabase } from "rxdb";
import { getRxStorageDexie } from "rxdb/plugins/dexie";

import BookmarkSchema from "./schemas/bookmark.schema";
import FilterSchema from "./schemas/filter.schema";
import PageAssetSchema from "./schemas/page-asset.schema";
import PageSchema from "./schemas/page.schema";
import TagSchema from "./schemas/tag.schema";

let _db: RxDatabase = null;
let _initedSchema = false;
async function getDBInstance() {
  if (!_db) {
    _db = await createRxDatabase({
      name: "exampledb",
      storage: getRxStorageDexie()
    });
  }
  if (!_initedSchema) {
    _db.addCollections({
      bookmarks: {
        schema: BookmarkSchema
      },
      filters: {
        schema: FilterSchema
      },
      pageAssets: {
        schema: PageAssetSchema
      },
      pages: {
        schema: PageSchema
      },
      tags: {
        schema: TagSchema
      }
    });

    _initedSchema = true;
  }

  return _db;
}

export default getDBInstance;
