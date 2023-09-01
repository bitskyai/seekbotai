/*
  Warnings:

  - You are about to drop the column `localMode` on the `bk_page_meta_data` table. All the data in the column will be lost.
  - You are about to drop the column `bk_user_id` on the `bk_search_engine_index` table. All the data in the column will be lost.
  - You are about to drop the column `last_index_time` on the `bk_search_engine_index` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_bk_page_meta_data" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "last_visit_time" DATETIME,
    "bk_user_id" TEXT NOT NULL,
    "bk_folder_id" TEXT,
    "bk_page_id" TEXT NOT NULL,
    "display_title" TEXT,
    "display_description" TEXT,
    "local_mode" BOOLEAN NOT NULL DEFAULT false,
    "favorite" BOOLEAN NOT NULL DEFAULT false,
    "bookmarked" BOOLEAN NOT NULL DEFAULT false,
    "incognito" BOOLEAN NOT NULL DEFAULT false,
    "tab_id" INTEGER,
    "visit_count" INTEGER NOT NULL DEFAULT 0,
    "typed_count" INTEGER NOT NULL DEFAULT 0,
    "version" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "bk_page_meta_data_bk_user_id_fkey" FOREIGN KEY ("bk_user_id") REFERENCES "bk_user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "bk_page_meta_data_bk_folder_id_fkey" FOREIGN KEY ("bk_folder_id") REFERENCES "bk_folder" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "bk_page_meta_data_bk_page_id_fkey" FOREIGN KEY ("bk_page_id") REFERENCES "bk_page" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_bk_page_meta_data" ("bk_folder_id", "bk_page_id", "bk_user_id", "bookmarked", "created_at", "display_description", "display_title", "favorite", "id", "incognito", "last_visit_time", "tab_id", "typed_count", "updated_at", "version", "visit_count") SELECT "bk_folder_id", "bk_page_id", "bk_user_id", "bookmarked", "created_at", "display_description", "display_title", "favorite", "id", "incognito", "last_visit_time", "tab_id", "typed_count", "updated_at", "version", "visit_count" FROM "bk_page_meta_data";
DROP TABLE "bk_page_meta_data";
ALTER TABLE "new_bk_page_meta_data" RENAME TO "bk_page_meta_data";
CREATE UNIQUE INDEX "bk_page_meta_data_bk_folder_id_key" ON "bk_page_meta_data"("bk_folder_id");
CREATE UNIQUE INDEX "bk_page_meta_data_bk_page_id_key" ON "bk_page_meta_data"("bk_page_id");
CREATE UNIQUE INDEX "bk_page_meta_data_bk_user_id_bk_page_id_version_key" ON "bk_page_meta_data"("bk_user_id", "bk_page_id", "version");
CREATE TABLE "new_bk_search_engine_index" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "index_name" TEXT NOT NULL,
    "last_index_at" DATETIME,
    "version" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_bk_search_engine_index" ("created_at", "id", "index_name", "updated_at", "version") SELECT "created_at", "id", "index_name", "updated_at", "version" FROM "bk_search_engine_index";
DROP TABLE "bk_search_engine_index";
ALTER TABLE "new_bk_search_engine_index" RENAME TO "bk_search_engine_index";
CREATE UNIQUE INDEX "bk_search_engine_index_index_name_key" ON "bk_search_engine_index"("index_name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
