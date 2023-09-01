/*
  Warnings:

  - You are about to drop the column `bk_folder_id` on the `bk_page` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "bk_search_engine_index" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "bk_user_id" TEXT NOT NULL,
    "index_name" TEXT NOT NULL,
    "last_index_time" DATETIME,
    "version" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "bk_search_engine_index_bk_user_id_fkey" FOREIGN KEY ("bk_user_id") REFERENCES "bk_user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "bk_trash" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "bk_user_id" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 0,
    "table_name" TEXT NOT NULL,
    "table_row_id" TEXT NOT NULL,
    CONSTRAINT "bk_trash_bk_user_id_fkey" FOREIGN KEY ("bk_user_id") REFERENCES "bk_user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_bk_page_meta_data" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "bk_user_id" TEXT NOT NULL,
    "bk_folder_id" TEXT,
    "bk_page_id" TEXT NOT NULL,
    "display_title" TEXT,
    "display_description" TEXT,
    "localMode" BOOLEAN NOT NULL DEFAULT false,
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
INSERT INTO "new_bk_page_meta_data" ("bk_page_id", "bk_user_id", "bookmarked", "created_at", "display_description", "display_title", "favorite", "id", "incognito", "localMode", "tab_id", "typed_count", "updated_at", "version", "visit_count") SELECT "bk_page_id", "bk_user_id", "bookmarked", "created_at", "display_description", "display_title", "favorite", "id", "incognito", "localMode", "tab_id", "typed_count", "updated_at", "version", "visit_count" FROM "bk_page_meta_data";
DROP TABLE "bk_page_meta_data";
ALTER TABLE "new_bk_page_meta_data" RENAME TO "bk_page_meta_data";
CREATE UNIQUE INDEX "bk_page_meta_data_bk_folder_id_key" ON "bk_page_meta_data"("bk_folder_id");
CREATE UNIQUE INDEX "bk_page_meta_data_bk_page_id_key" ON "bk_page_meta_data"("bk_page_id");
CREATE UNIQUE INDEX "bk_page_meta_data_bk_user_id_bk_page_id_version_key" ON "bk_page_meta_data"("bk_user_id", "bk_page_id", "version");
CREATE TABLE "new_bk_preference" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "bk_user_id" TEXT NOT NULL,
    "api_key" TEXT NOT NULL,
    "log_level" TEXT NOT NULL DEFAULT 'info',
    "log_size" INTEGER NOT NULL DEFAULT 52428800,
    "index_frequency" INTEGER NOT NULL DEFAULT 60,
    CONSTRAINT "bk_preference_bk_user_id_fkey" FOREIGN KEY ("bk_user_id") REFERENCES "bk_user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_bk_preference" ("api_key", "bk_user_id", "created_at", "id", "log_level", "log_size", "updated_at") SELECT "api_key", "bk_user_id", "created_at", "id", "log_level", "log_size", "updated_at" FROM "bk_preference";
DROP TABLE "bk_preference";
ALTER TABLE "new_bk_preference" RENAME TO "bk_preference";
CREATE UNIQUE INDEX "bk_preference_bk_user_id_key" ON "bk_preference"("bk_user_id");
CREATE UNIQUE INDEX "bk_preference_api_key_key" ON "bk_preference"("api_key");
CREATE TABLE "new_bk_page" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "bk_user_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "url" TEXT NOT NULL,
    "content" TEXT,
    "version" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "bk_page_bk_user_id_fkey" FOREIGN KEY ("bk_user_id") REFERENCES "bk_user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_bk_page" ("bk_user_id", "content", "created_at", "description", "icon", "id", "title", "updated_at", "url", "version") SELECT "bk_user_id", "content", "created_at", "description", "icon", "id", "title", "updated_at", "url", "version" FROM "bk_page";
DROP TABLE "bk_page";
ALTER TABLE "new_bk_page" RENAME TO "bk_page";
CREATE UNIQUE INDEX "bk_page_bk_user_id_url_version_key" ON "bk_page"("bk_user_id", "url", "version");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "bk_search_engine_index_bk_user_id_index_name_key" ON "bk_search_engine_index"("bk_user_id", "index_name");
