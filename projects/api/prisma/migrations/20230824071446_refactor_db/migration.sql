/*
  Warnings:

  - You are about to drop the `bk_bookmark` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `bk_bookmark_raw` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `bk_bookmark_screenshot` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `bk_bookmark_tag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `bk_browser_history` table. If the table is not empty, all the data it contains will be lost.
  - The primary key for the `bk_user` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `bk_system` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `bk_filter` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `bk_preference` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `bk_folder` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `bk_backup` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `bk_tag` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `bk_seed` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropIndex
DROP INDEX "bk_bookmark_bk_user_id_url_key";

-- DropIndex
DROP INDEX "bk_bookmark_bk_folder_id_key";

-- DropIndex
DROP INDEX "bk_bookmark_raw_bk_user_id_file_name_version_key";

-- DropIndex
DROP INDEX "bk_bookmark_screenshot_bk_bookmark_raw_id_key";

-- DropIndex
DROP INDEX "bk_bookmark_tag_bk_user_id_bk_tag_id_bk_bookmark_id_key";

-- DropIndex
DROP INDEX "bk_browser_history_bk_user_id_url_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "bk_bookmark";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "bk_bookmark_raw";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "bk_bookmark_screenshot";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "bk_bookmark_tag";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "bk_browser_history";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "bk_ignore_url" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "bk_user_id" TEXT NOT NULL,
    "pattern" TEXT NOT NULL,
    "regular_expression" BOOLEAN NOT NULL DEFAULT false,
    "preferenceId" TEXT,
    CONSTRAINT "bk_ignore_url_bk_user_id_fkey" FOREIGN KEY ("bk_user_id") REFERENCES "bk_user" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "bk_ignore_url_preferenceId_fkey" FOREIGN KEY ("preferenceId") REFERENCES "bk_preference" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "bk_page" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "bk_user_id" TEXT NOT NULL,
    "bk_folder_id" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "url" TEXT NOT NULL,
    "content" TEXT,
    "version" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "bk_page_bk_user_id_fkey" FOREIGN KEY ("bk_user_id") REFERENCES "bk_user" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "bk_page_bk_folder_id_fkey" FOREIGN KEY ("bk_folder_id") REFERENCES "bk_folder" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "bk_page_meta_data" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "bk_user_id" TEXT NOT NULL,
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
    CONSTRAINT "bk_page_meta_data_bk_page_id_fkey" FOREIGN KEY ("bk_page_id") REFERENCES "bk_page" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "bk_page_raw" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "bk_user_id" TEXT NOT NULL,
    "bk_page_id" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 0,
    "raw" TEXT,
    CONSTRAINT "bk_page_raw_bk_user_id_fkey" FOREIGN KEY ("bk_user_id") REFERENCES "bk_user" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "bk_page_raw_bk_page_id_fkey" FOREIGN KEY ("bk_page_id") REFERENCES "bk_page" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "bk_page_screenshot" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "bk_user_id" TEXT NOT NULL,
    "bk_page_id" TEXT NOT NULL,
    "bk_page_raw_id" TEXT NOT NULL,
    "screenshot" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "bk_page_screenshot_bk_user_id_fkey" FOREIGN KEY ("bk_user_id") REFERENCES "bk_user" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "bk_page_screenshot_bk_page_id_fkey" FOREIGN KEY ("bk_page_id") REFERENCES "bk_page" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "bk_page_screenshot_bk_page_raw_id_fkey" FOREIGN KEY ("bk_page_raw_id") REFERENCES "bk_page_raw" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "bk_page_tag" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "bk_user_id" TEXT NOT NULL,
    "bk_tag_id" TEXT NOT NULL,
    "bk_page_id" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "bk_page_tag_bk_user_id_fkey" FOREIGN KEY ("bk_user_id") REFERENCES "bk_user" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "bk_page_tag_bk_tag_id_fkey" FOREIGN KEY ("bk_tag_id") REFERENCES "bk_tag" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "bk_page_tag_bk_page_id_fkey" FOREIGN KEY ("bk_page_id") REFERENCES "bk_page" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_bk_user" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT,
    "password" TEXT,
    "first_name" TEXT,
    "last_name" TEXT
);
INSERT INTO "new_bk_user" ("created_at", "email", "first_name", "id", "last_name", "password", "updated_at", "username") SELECT "created_at", "email", "first_name", "id", "last_name", "password", "updated_at", "username" FROM "bk_user";
DROP TABLE "bk_user";
ALTER TABLE "new_bk_user" RENAME TO "bk_user";
CREATE TABLE "new_bk_system" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "bk_user_id" TEXT NOT NULL,
    CONSTRAINT "bk_system_bk_user_id_fkey" FOREIGN KEY ("bk_user_id") REFERENCES "bk_user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_bk_system" ("bk_user_id", "created_at", "id", "updated_at") SELECT "bk_user_id", "created_at", "id", "updated_at" FROM "bk_system";
DROP TABLE "bk_system";
ALTER TABLE "new_bk_system" RENAME TO "bk_system";
CREATE UNIQUE INDEX "bk_system_bk_user_id_key" ON "bk_system"("bk_user_id");
CREATE TABLE "new_bk_filter" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "bk_user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT,
    "version" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "bk_filter_bk_user_id_fkey" FOREIGN KEY ("bk_user_id") REFERENCES "bk_user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_bk_filter" ("bk_user_id", "created_at", "icon", "id", "name", "updated_at", "version") SELECT "bk_user_id", "created_at", "icon", "id", "name", "updated_at", "version" FROM "bk_filter";
DROP TABLE "bk_filter";
ALTER TABLE "new_bk_filter" RENAME TO "bk_filter";
CREATE UNIQUE INDEX "bk_filter_name_key" ON "bk_filter"("name");
CREATE TABLE "new_bk_preference" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "bk_user_id" TEXT NOT NULL,
    "api_key" TEXT NOT NULL,
    "log_level" TEXT NOT NULL DEFAULT 'info',
    "log_size" INTEGER NOT NULL DEFAULT 52428800,
    CONSTRAINT "bk_preference_bk_user_id_fkey" FOREIGN KEY ("bk_user_id") REFERENCES "bk_user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_bk_preference" ("api_key", "bk_user_id", "created_at", "id", "log_level", "log_size", "updated_at") SELECT "api_key", "bk_user_id", "created_at", "id", "log_level", "log_size", "updated_at" FROM "bk_preference";
DROP TABLE "bk_preference";
ALTER TABLE "new_bk_preference" RENAME TO "bk_preference";
CREATE UNIQUE INDEX "bk_preference_bk_user_id_key" ON "bk_preference"("bk_user_id");
CREATE UNIQUE INDEX "bk_preference_api_key_key" ON "bk_preference"("api_key");
CREATE TABLE "new_bk_folder" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "bk_user_id" TEXT NOT NULL,
    "bk_parent_id" TEXT,
    "name" TEXT NOT NULL,
    "icon" TEXT,
    "version" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "bk_folder_bk_user_id_fkey" FOREIGN KEY ("bk_user_id") REFERENCES "bk_user" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "bk_folder_bk_parent_id_fkey" FOREIGN KEY ("bk_parent_id") REFERENCES "bk_folder" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_bk_folder" ("bk_parent_id", "bk_user_id", "created_at", "icon", "id", "name", "updated_at", "version") SELECT "bk_parent_id", "bk_user_id", "created_at", "icon", "id", "name", "updated_at", "version" FROM "bk_folder";
DROP TABLE "bk_folder";
ALTER TABLE "new_bk_folder" RENAME TO "bk_folder";
CREATE TABLE "new_bk_backup" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "bk_user_id" TEXT NOT NULL,
    CONSTRAINT "bk_backup_bk_user_id_fkey" FOREIGN KEY ("bk_user_id") REFERENCES "bk_user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_bk_backup" ("bk_user_id", "created_at", "id", "updated_at") SELECT "bk_user_id", "created_at", "id", "updated_at" FROM "bk_backup";
DROP TABLE "bk_backup";
ALTER TABLE "new_bk_backup" RENAME TO "bk_backup";
CREATE TABLE "new_bk_tag" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "bk_user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "bk_tag_bk_user_id_fkey" FOREIGN KEY ("bk_user_id") REFERENCES "bk_user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_bk_tag" ("bk_user_id", "created_at", "id", "name", "updated_at", "version") SELECT "bk_user_id", "created_at", "id", "name", "updated_at", "version" FROM "bk_tag";
DROP TABLE "bk_tag";
ALTER TABLE "new_bk_tag" RENAME TO "bk_tag";
CREATE UNIQUE INDEX "bk_tag_bk_user_id_name_key" ON "bk_tag"("bk_user_id", "name");
CREATE TABLE "new_bk_seed" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "bk_user_id" TEXT NOT NULL,
    "seed_name" TEXT NOT NULL,
    "logs" TEXT,
    CONSTRAINT "bk_seed_bk_user_id_fkey" FOREIGN KEY ("bk_user_id") REFERENCES "bk_user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_bk_seed" ("bk_user_id", "created_at", "id", "logs", "seed_name", "updated_at") SELECT "bk_user_id", "created_at", "id", "logs", "seed_name", "updated_at" FROM "bk_seed";
DROP TABLE "bk_seed";
ALTER TABLE "new_bk_seed" RENAME TO "bk_seed";
CREATE UNIQUE INDEX "bk_seed_seed_name_key" ON "bk_seed"("seed_name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "bk_ignore_url_bk_user_id_key" ON "bk_ignore_url"("bk_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "bk_ignore_url_pattern_key" ON "bk_ignore_url"("pattern");

-- CreateIndex
CREATE UNIQUE INDEX "bk_page_bk_folder_id_key" ON "bk_page"("bk_folder_id");

-- CreateIndex
CREATE UNIQUE INDEX "bk_page_bk_user_id_url_version_key" ON "bk_page"("bk_user_id", "url", "version");

-- CreateIndex
CREATE UNIQUE INDEX "bk_page_meta_data_bk_page_id_key" ON "bk_page_meta_data"("bk_page_id");

-- CreateIndex
CREATE UNIQUE INDEX "bk_page_raw_bk_user_id_file_name_version_key" ON "bk_page_raw"("bk_user_id", "file_name", "version");

-- CreateIndex
CREATE UNIQUE INDEX "bk_page_screenshot_bk_page_raw_id_key" ON "bk_page_screenshot"("bk_page_raw_id");

-- CreateIndex
CREATE UNIQUE INDEX "bk_page_tag_bk_user_id_bk_tag_id_bk_page_id_key" ON "bk_page_tag"("bk_user_id", "bk_tag_id", "bk_page_id");
