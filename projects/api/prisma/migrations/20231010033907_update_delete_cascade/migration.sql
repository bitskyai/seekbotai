-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_bk_page_tag" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "bk_user_id" TEXT NOT NULL,
    "bk_tag_id" TEXT NOT NULL,
    "bk_page_id" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "bk_page_tag_bk_user_id_fkey" FOREIGN KEY ("bk_user_id") REFERENCES "bk_user" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "bk_page_tag_bk_tag_id_fkey" FOREIGN KEY ("bk_tag_id") REFERENCES "bk_tag" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "bk_page_tag_bk_page_id_fkey" FOREIGN KEY ("bk_page_id") REFERENCES "bk_page" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_bk_page_tag" ("bk_page_id", "bk_tag_id", "bk_user_id", "created_at", "id", "updated_at", "version") SELECT "bk_page_id", "bk_tag_id", "bk_user_id", "created_at", "id", "updated_at", "version" FROM "bk_page_tag";
DROP TABLE "bk_page_tag";
ALTER TABLE "new_bk_page_tag" RENAME TO "bk_page_tag";
CREATE UNIQUE INDEX "bk_page_tag_bk_user_id_bk_tag_id_bk_page_id_key" ON "bk_page_tag"("bk_user_id", "bk_tag_id", "bk_page_id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
