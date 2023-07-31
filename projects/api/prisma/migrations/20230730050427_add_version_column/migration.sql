-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_bk_filter" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "bk_user_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT,
    "version" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "bk_filter_bk_user_id_fkey" FOREIGN KEY ("bk_user_id") REFERENCES "bk_user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_bk_filter" ("bk_user_id", "created_at", "icon", "id", "name", "updated_at") SELECT "bk_user_id", "created_at", "icon", "id", "name", "updated_at" FROM "bk_filter";
DROP TABLE "bk_filter";
ALTER TABLE "new_bk_filter" RENAME TO "bk_filter";
CREATE UNIQUE INDEX "bk_filter_name_key" ON "bk_filter"("name");
CREATE TABLE "new_bk_tag" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "bk_user_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "bk_tag_bk_user_id_fkey" FOREIGN KEY ("bk_user_id") REFERENCES "bk_user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_bk_tag" ("bk_user_id", "created_at", "id", "name", "updated_at") SELECT "bk_user_id", "created_at", "id", "name", "updated_at" FROM "bk_tag";
DROP TABLE "bk_tag";
ALTER TABLE "new_bk_tag" RENAME TO "bk_tag";
CREATE UNIQUE INDEX "bk_tag_bk_user_id_name_key" ON "bk_tag"("bk_user_id", "name");
CREATE TABLE "new_bk_browser_history" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "bk_user_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "url" TEXT NOT NULL,
    "icon" TEXT,
    "count" INTEGER NOT NULL DEFAULT 0,
    "content" TEXT,
    "version" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "bk_browser_history_bk_user_id_fkey" FOREIGN KEY ("bk_user_id") REFERENCES "bk_user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_bk_browser_history" ("bk_user_id", "content", "count", "created_at", "description", "icon", "id", "name", "updated_at", "url") SELECT "bk_user_id", "content", "count", "created_at", "description", "icon", "id", "name", "updated_at", "url" FROM "bk_browser_history";
DROP TABLE "bk_browser_history";
ALTER TABLE "new_bk_browser_history" RENAME TO "bk_browser_history";
CREATE UNIQUE INDEX "bk_browser_history_bk_user_id_url_key" ON "bk_browser_history"("bk_user_id", "url");
CREATE TABLE "new_bk_bookmark" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "bk_user_id" INTEGER NOT NULL,
    "bk_folder_id" INTEGER,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "favorite" BOOLEAN NOT NULL DEFAULT false,
    "url" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "content" TEXT,
    "version" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "bk_bookmark_bk_user_id_fkey" FOREIGN KEY ("bk_user_id") REFERENCES "bk_user" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "bk_bookmark_bk_folder_id_fkey" FOREIGN KEY ("bk_folder_id") REFERENCES "bk_folder" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_bk_bookmark" ("bk_folder_id", "bk_user_id", "content", "count", "created_at", "description", "favorite", "icon", "id", "name", "updated_at", "url") SELECT "bk_folder_id", "bk_user_id", "content", "count", "created_at", "description", "favorite", "icon", "id", "name", "updated_at", "url" FROM "bk_bookmark";
DROP TABLE "bk_bookmark";
ALTER TABLE "new_bk_bookmark" RENAME TO "bk_bookmark";
CREATE UNIQUE INDEX "bk_bookmark_bk_folder_id_key" ON "bk_bookmark"("bk_folder_id");
CREATE UNIQUE INDEX "bk_bookmark_bk_user_id_url_key" ON "bk_bookmark"("bk_user_id", "url");
CREATE TABLE "new_bk_bookmark_screenshot" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "bk_user_id" INTEGER NOT NULL,
    "bk_bookmark_id" INTEGER NOT NULL,
    "bk_bookmark_raw_id" INTEGER NOT NULL,
    "screenshot" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "bk_bookmark_screenshot_bk_user_id_fkey" FOREIGN KEY ("bk_user_id") REFERENCES "bk_user" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "bk_bookmark_screenshot_bk_bookmark_id_fkey" FOREIGN KEY ("bk_bookmark_id") REFERENCES "bk_bookmark" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "bk_bookmark_screenshot_bk_bookmark_raw_id_fkey" FOREIGN KEY ("bk_bookmark_raw_id") REFERENCES "bk_bookmark_raw" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_bk_bookmark_screenshot" ("bk_bookmark_id", "bk_bookmark_raw_id", "bk_user_id", "created_at", "id", "screenshot", "updated_at") SELECT "bk_bookmark_id", "bk_bookmark_raw_id", "bk_user_id", "created_at", "id", "screenshot", "updated_at" FROM "bk_bookmark_screenshot";
DROP TABLE "bk_bookmark_screenshot";
ALTER TABLE "new_bk_bookmark_screenshot" RENAME TO "bk_bookmark_screenshot";
CREATE UNIQUE INDEX "bk_bookmark_screenshot_bk_bookmark_raw_id_key" ON "bk_bookmark_screenshot"("bk_bookmark_raw_id");
CREATE TABLE "new_bk_bookmark_raw" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "bk_user_id" INTEGER NOT NULL,
    "bk_bookmark_id" INTEGER NOT NULL,
    "file_name" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 0,
    "raw" TEXT,
    CONSTRAINT "bk_bookmark_raw_bk_user_id_fkey" FOREIGN KEY ("bk_user_id") REFERENCES "bk_user" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "bk_bookmark_raw_bk_bookmark_id_fkey" FOREIGN KEY ("bk_bookmark_id") REFERENCES "bk_bookmark" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_bk_bookmark_raw" ("bk_bookmark_id", "bk_user_id", "created_at", "file_name", "id", "raw", "updated_at") SELECT "bk_bookmark_id", "bk_user_id", "created_at", "file_name", "id", "raw", "updated_at" FROM "bk_bookmark_raw";
DROP TABLE "bk_bookmark_raw";
ALTER TABLE "new_bk_bookmark_raw" RENAME TO "bk_bookmark_raw";
CREATE TABLE "new_bk_bookmark_tag" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "bk_user_id" INTEGER NOT NULL,
    "bk_tag_id" INTEGER NOT NULL,
    "bk_bookmark_id" INTEGER NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "bk_bookmark_tag_bk_user_id_fkey" FOREIGN KEY ("bk_user_id") REFERENCES "bk_user" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "bk_bookmark_tag_bk_tag_id_fkey" FOREIGN KEY ("bk_tag_id") REFERENCES "bk_tag" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "bk_bookmark_tag_bk_bookmark_id_fkey" FOREIGN KEY ("bk_bookmark_id") REFERENCES "bk_bookmark" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_bk_bookmark_tag" ("bk_bookmark_id", "bk_tag_id", "bk_user_id", "created_at", "id", "updated_at") SELECT "bk_bookmark_id", "bk_tag_id", "bk_user_id", "created_at", "id", "updated_at" FROM "bk_bookmark_tag";
DROP TABLE "bk_bookmark_tag";
ALTER TABLE "new_bk_bookmark_tag" RENAME TO "bk_bookmark_tag";
CREATE UNIQUE INDEX "bk_bookmark_tag_bk_user_id_bk_tag_id_bk_bookmark_id_key" ON "bk_bookmark_tag"("bk_user_id", "bk_tag_id", "bk_bookmark_id");
CREATE TABLE "new_bk_folder" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "bk_user_id" INTEGER NOT NULL,
    "bk_parent_id" INTEGER,
    "name" TEXT NOT NULL,
    "icon" TEXT,
    "version" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "bk_folder_bk_user_id_fkey" FOREIGN KEY ("bk_user_id") REFERENCES "bk_user" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "bk_folder_bk_parent_id_fkey" FOREIGN KEY ("bk_parent_id") REFERENCES "bk_folder" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_bk_folder" ("bk_parent_id", "bk_user_id", "created_at", "icon", "id", "name", "updated_at") SELECT "bk_parent_id", "bk_user_id", "created_at", "icon", "id", "name", "updated_at" FROM "bk_folder";
DROP TABLE "bk_folder";
ALTER TABLE "new_bk_folder" RENAME TO "bk_folder";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
