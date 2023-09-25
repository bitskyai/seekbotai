-- CreateTable
CREATE TABLE "bk_user" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT,
    "password" TEXT,
    "first_name" TEXT,
    "last_name" TEXT
);

-- CreateTable
CREATE TABLE "bk_preference" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "bk_user_id" TEXT NOT NULL,
    "api_key" TEXT NOT NULL,
    "log_level" TEXT NOT NULL DEFAULT 'info',
    "log_size" INTEGER NOT NULL DEFAULT 52428800,
    "index_frequency" INTEGER NOT NULL DEFAULT 60,
    CONSTRAINT "bk_preference_bk_user_id_fkey" FOREIGN KEY ("bk_user_id") REFERENCES "bk_user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

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
CREATE TABLE "bk_system" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "bk_user_id" TEXT NOT NULL,
    CONSTRAINT "bk_system_bk_user_id_fkey" FOREIGN KEY ("bk_user_id") REFERENCES "bk_user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "bk_seed" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "bk_user_id" TEXT NOT NULL,
    "seed_name" TEXT NOT NULL,
    "logs" TEXT,
    CONSTRAINT "bk_seed_bk_user_id_fkey" FOREIGN KEY ("bk_user_id") REFERENCES "bk_user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "bk_backup" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "bk_user_id" TEXT NOT NULL,
    CONSTRAINT "bk_backup_bk_user_id_fkey" FOREIGN KEY ("bk_user_id") REFERENCES "bk_user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "bk_tag" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "bk_user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "bk_tag_bk_user_id_fkey" FOREIGN KEY ("bk_user_id") REFERENCES "bk_user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "bk_filter" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "bk_user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT,
    "version" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "bk_filter_bk_user_id_fkey" FOREIGN KEY ("bk_user_id") REFERENCES "bk_user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "bk_folder" (
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

-- CreateTable
CREATE TABLE "bk_page" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "bk_user_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "url" TEXT NOT NULL,
    "content" TEXT,
    "version" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "bk_page_bk_user_id_fkey" FOREIGN KEY ("bk_user_id") REFERENCES "bk_user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "bk_page_meta_data" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "last_visit_time" DATETIME,
    "bk_user_id" TEXT NOT NULL,
    "bk_folder_id" TEXT,
    "bk_page_id" TEXT NOT NULL,
    "display_title" TEXT,
    "display_description" TEXT,
    "local_mode" BOOLEAN NOT NULL DEFAULT false,
    "favorite" BOOLEAN NOT NULL DEFAULT false,
    "bookmarked" BOOLEAN NOT NULL DEFAULT false,
    "incognito" BOOLEAN NOT NULL DEFAULT false,
    "tab_id" INTEGER,
    "visit_count" INTEGER NOT NULL DEFAULT 0,
    "typed_count" INTEGER NOT NULL DEFAULT 0,
    "host_name" TEXT,
    "version" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "bk_page_meta_data_bk_user_id_fkey" FOREIGN KEY ("bk_user_id") REFERENCES "bk_user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "bk_page_meta_data_bk_folder_id_fkey" FOREIGN KEY ("bk_folder_id") REFERENCES "bk_folder" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
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

-- CreateTable
CREATE TABLE "bk_search_engine_index" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "index_name" TEXT NOT NULL,
    "last_index_at" DATETIME NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "bk_trash" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "bk_user_id" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 0,
    "table_name" TEXT NOT NULL,
    "table_row_id" TEXT NOT NULL,
    CONSTRAINT "bk_trash_bk_user_id_fkey" FOREIGN KEY ("bk_user_id") REFERENCES "bk_user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "bk_preference_bk_user_id_key" ON "bk_preference"("bk_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "bk_preference_api_key_key" ON "bk_preference"("api_key");

-- CreateIndex
CREATE UNIQUE INDEX "bk_ignore_url_bk_user_id_key" ON "bk_ignore_url"("bk_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "bk_ignore_url_pattern_key" ON "bk_ignore_url"("pattern");

-- CreateIndex
CREATE UNIQUE INDEX "bk_system_bk_user_id_key" ON "bk_system"("bk_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "bk_seed_seed_name_key" ON "bk_seed"("seed_name");

-- CreateIndex
CREATE UNIQUE INDEX "bk_tag_bk_user_id_name_key" ON "bk_tag"("bk_user_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "bk_filter_name_key" ON "bk_filter"("name");

-- CreateIndex
CREATE UNIQUE INDEX "bk_page_bk_user_id_url_version_key" ON "bk_page"("bk_user_id", "url", "version");

-- CreateIndex
CREATE UNIQUE INDEX "bk_page_meta_data_bk_folder_id_key" ON "bk_page_meta_data"("bk_folder_id");

-- CreateIndex
CREATE UNIQUE INDEX "bk_page_meta_data_bk_page_id_key" ON "bk_page_meta_data"("bk_page_id");

-- CreateIndex
CREATE UNIQUE INDEX "bk_page_meta_data_bk_user_id_bk_page_id_version_key" ON "bk_page_meta_data"("bk_user_id", "bk_page_id", "version");

-- CreateIndex
CREATE UNIQUE INDEX "bk_page_raw_bk_user_id_file_name_version_key" ON "bk_page_raw"("bk_user_id", "file_name", "version");

-- CreateIndex
CREATE UNIQUE INDEX "bk_page_screenshot_bk_page_raw_id_key" ON "bk_page_screenshot"("bk_page_raw_id");

-- CreateIndex
CREATE UNIQUE INDEX "bk_page_tag_bk_user_id_bk_tag_id_bk_page_id_key" ON "bk_page_tag"("bk_user_id", "bk_tag_id", "bk_page_id");

-- CreateIndex
CREATE UNIQUE INDEX "bk_search_engine_index_index_name_key" ON "bk_search_engine_index"("index_name");
