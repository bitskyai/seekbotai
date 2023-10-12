/*
  Warnings:

  - A unique constraint covering the columns `[bk_user_id,pattern,regular_expression]` on the table `bk_ignore_url` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "bk_ignore_url_bk_user_id_pattern_regular_expression_key" ON "bk_ignore_url"("bk_user_id", "pattern", "regular_expression");
