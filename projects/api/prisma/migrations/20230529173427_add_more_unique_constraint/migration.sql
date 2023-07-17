/*
  Warnings:

  - A unique constraint covering the columns `[bk_user_id,bk_bookmark_id]` on the table `bk_bookmark_raw` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[bk_user_id,bk_tag_id,bk_bookmark_id]` on the table `bk_bookmark_tag` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[bk_user_id,url]` on the table `bk_browser_history` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "bk_bookmark_raw_bk_user_id_bk_bookmark_id_key" ON "bk_bookmark_raw"("bk_user_id", "bk_bookmark_id");

-- CreateIndex
CREATE UNIQUE INDEX "bk_bookmark_tag_bk_user_id_bk_tag_id_bk_bookmark_id_key" ON "bk_bookmark_tag"("bk_user_id", "bk_tag_id", "bk_bookmark_id");

-- CreateIndex
CREATE UNIQUE INDEX "bk_browser_history_bk_user_id_url_key" ON "bk_browser_history"("bk_user_id", "url");
