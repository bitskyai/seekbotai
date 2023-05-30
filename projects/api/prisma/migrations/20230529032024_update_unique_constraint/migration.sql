/*
  Warnings:

  - A unique constraint covering the columns `[bk_user_id,url]` on the table `bk_bookmark` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[bk_user_id,name]` on the table `bk_tag` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "bk_tag_name_key";

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_bk_folder" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "bk_user_id" INTEGER NOT NULL,
    "bk_parent_id" INTEGER,
    "name" TEXT NOT NULL,
    "icon" TEXT,
    CONSTRAINT "bk_folder_bk_user_id_fkey" FOREIGN KEY ("bk_user_id") REFERENCES "bk_user" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "bk_folder_bk_parent_id_fkey" FOREIGN KEY ("bk_parent_id") REFERENCES "bk_folder" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_bk_folder" ("bk_user_id", "created_at", "icon", "id", "name", "updated_at") SELECT "bk_user_id", "created_at", "icon", "id", "name", "updated_at" FROM "bk_folder";
DROP TABLE "bk_folder";
ALTER TABLE "new_bk_folder" RENAME TO "bk_folder";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "bk_bookmark_bk_user_id_url_key" ON "bk_bookmark"("bk_user_id", "url");

-- CreateIndex
CREATE UNIQUE INDEX "bk_tag_bk_user_id_name_key" ON "bk_tag"("bk_user_id", "name");
