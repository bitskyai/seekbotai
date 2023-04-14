-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_bk_bookmark" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "bk_user_id" INTEGER NOT NULL,
    "bk_folder_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "favorite" BOOLEAN NOT NULL DEFAULT false,
    "url" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "bk_bookmark_bk_user_id_fkey" FOREIGN KEY ("bk_user_id") REFERENCES "bk_user" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "bk_bookmark_bk_folder_id_fkey" FOREIGN KEY ("bk_folder_id") REFERENCES "bk_folder" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_bk_bookmark" ("bk_folder_id", "bk_user_id", "count", "created_at", "description", "favorite", "id", "name", "updated_at", "url") SELECT "bk_folder_id", "bk_user_id", "count", "created_at", "description", "favorite", "id", "name", "updated_at", "url" FROM "bk_bookmark";
DROP TABLE "bk_bookmark";
ALTER TABLE "new_bk_bookmark" RENAME TO "bk_bookmark";
CREATE UNIQUE INDEX "bk_bookmark_bk_user_id_key" ON "bk_bookmark"("bk_user_id");
CREATE UNIQUE INDEX "bk_bookmark_bk_folder_id_key" ON "bk_bookmark"("bk_folder_id");
CREATE TABLE "new_bk_bookmark_content" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "bk_user_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT,
    CONSTRAINT "bk_bookmark_content_bk_user_id_fkey" FOREIGN KEY ("bk_user_id") REFERENCES "bk_user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_bk_bookmark_content" ("bk_user_id", "created_at", "icon", "id", "name", "updated_at") SELECT "bk_user_id", "created_at", "icon", "id", "name", "updated_at" FROM "bk_bookmark_content";
DROP TABLE "bk_bookmark_content";
ALTER TABLE "new_bk_bookmark_content" RENAME TO "bk_bookmark_content";
CREATE UNIQUE INDEX "bk_bookmark_content_bk_user_id_key" ON "bk_bookmark_content"("bk_user_id");
CREATE TABLE "new_bk_system" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "bk_user_id" INTEGER NOT NULL,
    CONSTRAINT "bk_system_bk_user_id_fkey" FOREIGN KEY ("bk_user_id") REFERENCES "bk_user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_bk_system" ("bk_user_id", "created_at", "id", "updated_at") SELECT "bk_user_id", "created_at", "id", "updated_at" FROM "bk_system";
DROP TABLE "bk_system";
ALTER TABLE "new_bk_system" RENAME TO "bk_system";
CREATE UNIQUE INDEX "bk_system_bk_user_id_key" ON "bk_system"("bk_user_id");
CREATE TABLE "new_bk_browser_history_content" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "bk_user_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT,
    CONSTRAINT "bk_browser_history_content_bk_user_id_fkey" FOREIGN KEY ("bk_user_id") REFERENCES "bk_user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_bk_browser_history_content" ("bk_user_id", "created_at", "icon", "id", "name", "updated_at") SELECT "bk_user_id", "created_at", "icon", "id", "name", "updated_at" FROM "bk_browser_history_content";
DROP TABLE "bk_browser_history_content";
ALTER TABLE "new_bk_browser_history_content" RENAME TO "bk_browser_history_content";
CREATE UNIQUE INDEX "bk_browser_history_content_bk_user_id_key" ON "bk_browser_history_content"("bk_user_id");
CREATE TABLE "new_bk_browser_history" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "bk_user_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "url" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "bk_browser_history_bk_user_id_fkey" FOREIGN KEY ("bk_user_id") REFERENCES "bk_user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_bk_browser_history" ("bk_user_id", "count", "created_at", "description", "id", "name", "updated_at", "url") SELECT "bk_user_id", "count", "created_at", "description", "id", "name", "updated_at", "url" FROM "bk_browser_history";
DROP TABLE "bk_browser_history";
ALTER TABLE "new_bk_browser_history" RENAME TO "bk_browser_history";
CREATE UNIQUE INDEX "bk_browser_history_bk_user_id_key" ON "bk_browser_history"("bk_user_id");
CREATE TABLE "new_bk_backup" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "bk_user_id" INTEGER NOT NULL,
    CONSTRAINT "bk_backup_bk_user_id_fkey" FOREIGN KEY ("bk_user_id") REFERENCES "bk_user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_bk_backup" ("bk_user_id", "created_at", "id", "updated_at") SELECT "bk_user_id", "created_at", "id", "updated_at" FROM "bk_backup";
DROP TABLE "bk_backup";
ALTER TABLE "new_bk_backup" RENAME TO "bk_backup";
CREATE UNIQUE INDEX "bk_backup_bk_user_id_key" ON "bk_backup"("bk_user_id");
CREATE TABLE "new_bk_preference" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "bk_user_id" INTEGER NOT NULL,
    "log_level" TEXT NOT NULL DEFAULT 'info',
    "log_size" INTEGER NOT NULL DEFAULT 52428800,
    CONSTRAINT "bk_preference_bk_user_id_fkey" FOREIGN KEY ("bk_user_id") REFERENCES "bk_user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_bk_preference" ("bk_user_id", "created_at", "id", "log_level", "log_size", "updated_at") SELECT "bk_user_id", "created_at", "id", "log_level", "log_size", "updated_at" FROM "bk_preference";
DROP TABLE "bk_preference";
ALTER TABLE "new_bk_preference" RENAME TO "bk_preference";
CREATE UNIQUE INDEX "bk_preference_bk_user_id_key" ON "bk_preference"("bk_user_id");
CREATE TABLE "new_bk_filter" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "bk_user_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT,
    CONSTRAINT "bk_filter_bk_user_id_fkey" FOREIGN KEY ("bk_user_id") REFERENCES "bk_user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_bk_filter" ("bk_user_id", "created_at", "icon", "id", "name", "updated_at") SELECT "bk_user_id", "created_at", "icon", "id", "name", "updated_at" FROM "bk_filter";
DROP TABLE "bk_filter";
ALTER TABLE "new_bk_filter" RENAME TO "bk_filter";
CREATE UNIQUE INDEX "bk_filter_bk_user_id_key" ON "bk_filter"("bk_user_id");
CREATE UNIQUE INDEX "bk_filter_name_key" ON "bk_filter"("name");
CREATE TABLE "new_bk_tag" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "bk_user_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    CONSTRAINT "bk_tag_bk_user_id_fkey" FOREIGN KEY ("bk_user_id") REFERENCES "bk_user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_bk_tag" ("bk_user_id", "created_at", "id", "name", "updated_at") SELECT "bk_user_id", "created_at", "id", "name", "updated_at" FROM "bk_tag";
DROP TABLE "bk_tag";
ALTER TABLE "new_bk_tag" RENAME TO "bk_tag";
CREATE UNIQUE INDEX "bk_tag_bk_user_id_key" ON "bk_tag"("bk_user_id");
CREATE UNIQUE INDEX "bk_tag_name_key" ON "bk_tag"("name");
CREATE TABLE "new_bk_folder" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "bk_user_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT,
    CONSTRAINT "bk_folder_bk_user_id_fkey" FOREIGN KEY ("bk_user_id") REFERENCES "bk_user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_bk_folder" ("bk_user_id", "created_at", "icon", "id", "name", "updated_at") SELECT "bk_user_id", "created_at", "icon", "id", "name", "updated_at" FROM "bk_folder";
DROP TABLE "bk_folder";
ALTER TABLE "new_bk_folder" RENAME TO "bk_folder";
CREATE UNIQUE INDEX "bk_folder_bk_user_id_key" ON "bk_folder"("bk_user_id");
CREATE TABLE "new_bk_bookmark_tag" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "bk_user_id" INTEGER NOT NULL,
    "bk_tag_id" INTEGER NOT NULL,
    "bk_bookmark_id" INTEGER NOT NULL,
    CONSTRAINT "bk_bookmark_tag_bk_user_id_fkey" FOREIGN KEY ("bk_user_id") REFERENCES "bk_user" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "bk_bookmark_tag_bk_tag_id_fkey" FOREIGN KEY ("bk_tag_id") REFERENCES "bk_tag" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "bk_bookmark_tag_bk_bookmark_id_fkey" FOREIGN KEY ("bk_bookmark_id") REFERENCES "bk_bookmark" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_bk_bookmark_tag" ("bk_bookmark_id", "bk_tag_id", "bk_user_id", "created_at", "id", "updated_at") SELECT "bk_bookmark_id", "bk_tag_id", "bk_user_id", "created_at", "id", "updated_at" FROM "bk_bookmark_tag";
DROP TABLE "bk_bookmark_tag";
ALTER TABLE "new_bk_bookmark_tag" RENAME TO "bk_bookmark_tag";
CREATE UNIQUE INDEX "bk_bookmark_tag_bk_user_id_key" ON "bk_bookmark_tag"("bk_user_id");
CREATE UNIQUE INDEX "bk_bookmark_tag_bk_tag_id_key" ON "bk_bookmark_tag"("bk_tag_id");
CREATE UNIQUE INDEX "bk_bookmark_tag_bk_bookmark_id_key" ON "bk_bookmark_tag"("bk_bookmark_id");
CREATE TABLE "new_bk_seed" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "bk_user_id" INTEGER NOT NULL,
    "seed_name" TEXT NOT NULL,
    "logs" TEXT,
    CONSTRAINT "bk_seed_bk_user_id_fkey" FOREIGN KEY ("bk_user_id") REFERENCES "bk_user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_bk_seed" ("bk_user_id", "created_at", "id", "logs", "seed_name", "updated_at") SELECT "bk_user_id", "created_at", "id", "logs", "seed_name", "updated_at" FROM "bk_seed";
DROP TABLE "bk_seed";
ALTER TABLE "new_bk_seed" RENAME TO "bk_seed";
CREATE UNIQUE INDEX "bk_seed_bk_user_id_key" ON "bk_seed"("bk_user_id");
CREATE UNIQUE INDEX "bk_seed_seed_name_key" ON "bk_seed"("seed_name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
