/*
  Warnings:

  - Added the required column `file_name` to the `bk_bookmark_raw` table without a default value. This is not possible if the table is not empty.
  - Added the required column `api_key` to the `bk_preference` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_bk_bookmark_raw" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "bk_user_id" INTEGER NOT NULL,
    "bk_bookmark_id" INTEGER NOT NULL,
    "file_name" TEXT NOT NULL,
    "raw" TEXT NOT NULL,
    CONSTRAINT "bk_bookmark_raw_bk_user_id_fkey" FOREIGN KEY ("bk_user_id") REFERENCES "bk_user" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "bk_bookmark_raw_bk_bookmark_id_fkey" FOREIGN KEY ("bk_bookmark_id") REFERENCES "bk_bookmark" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_bk_bookmark_raw" ("bk_bookmark_id", "bk_user_id", "created_at", "id", "raw", "updated_at") SELECT "bk_bookmark_id", "bk_user_id", "created_at", "id", "raw", "updated_at" FROM "bk_bookmark_raw";
DROP TABLE "bk_bookmark_raw";
ALTER TABLE "new_bk_bookmark_raw" RENAME TO "bk_bookmark_raw";
CREATE TABLE "new_bk_preference" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "bk_user_id" INTEGER NOT NULL,
    "api_key" TEXT NOT NULL,
    "log_level" TEXT NOT NULL DEFAULT 'info',
    "log_size" INTEGER NOT NULL DEFAULT 52428800,
    CONSTRAINT "bk_preference_bk_user_id_fkey" FOREIGN KEY ("bk_user_id") REFERENCES "bk_user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_bk_preference" ("bk_user_id", "created_at", "id", "log_level", "log_size", "updated_at") SELECT "bk_user_id", "created_at", "id", "log_level", "log_size", "updated_at" FROM "bk_preference";
DROP TABLE "bk_preference";
ALTER TABLE "new_bk_preference" RENAME TO "bk_preference";
CREATE UNIQUE INDEX "bk_preference_bk_user_id_key" ON "bk_preference"("bk_user_id");
CREATE UNIQUE INDEX "bk_preference_api_key_key" ON "bk_preference"("api_key");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
