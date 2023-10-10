/*
  Warnings:

  - You are about to drop the column `preferenceId` on the `bk_ignore_url` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_bk_ignore_url" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "bk_user_id" TEXT NOT NULL,
    "pattern" TEXT NOT NULL,
    "regular_expression" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "bk_ignore_url_bk_user_id_fkey" FOREIGN KEY ("bk_user_id") REFERENCES "bk_user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_bk_ignore_url" ("bk_user_id", "created_at", "id", "pattern", "regular_expression", "updated_at") SELECT "bk_user_id", "created_at", "id", "pattern", "regular_expression", "updated_at" FROM "bk_ignore_url";
DROP TABLE "bk_ignore_url";
ALTER TABLE "new_bk_ignore_url" RENAME TO "bk_ignore_url";
CREATE UNIQUE INDEX "bk_ignore_url_bk_user_id_key" ON "bk_ignore_url"("bk_user_id");
CREATE UNIQUE INDEX "bk_ignore_url_pattern_key" ON "bk_ignore_url"("pattern");
CREATE UNIQUE INDEX "bk_ignore_url_bk_user_id_pattern_regular_expression_key" ON "bk_ignore_url"("bk_user_id", "pattern", "regular_expression");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
