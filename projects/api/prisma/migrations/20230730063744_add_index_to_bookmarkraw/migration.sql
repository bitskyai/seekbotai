/*
  Warnings:

  - A unique constraint covering the columns `[bk_user_id,file_name,version]` on the table `bk_bookmark_raw` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "bk_bookmark_raw_bk_user_id_file_name_version_key" ON "bk_bookmark_raw"("bk_user_id", "file_name", "version");
