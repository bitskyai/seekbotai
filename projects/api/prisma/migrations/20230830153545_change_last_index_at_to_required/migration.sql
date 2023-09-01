/*
  Warnings:

  - Made the column `last_index_at` on table `bk_search_engine_index` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_bk_search_engine_index" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "index_name" TEXT NOT NULL,
    "last_index_at" DATETIME NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_bk_search_engine_index" ("created_at", "id", "index_name", "last_index_at", "updated_at", "version") SELECT "created_at", "id", "index_name", "last_index_at", "updated_at", "version" FROM "bk_search_engine_index";
DROP TABLE "bk_search_engine_index";
ALTER TABLE "new_bk_search_engine_index" RENAME TO "bk_search_engine_index";
CREATE UNIQUE INDEX "bk_search_engine_index_index_name_key" ON "bk_search_engine_index"("index_name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
