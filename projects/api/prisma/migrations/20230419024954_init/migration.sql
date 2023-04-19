-- CreateTable
CREATE TABLE "bk_user" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
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
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "bk_user_id" INTEGER NOT NULL,
    "log_level" TEXT NOT NULL DEFAULT 'info',
    "log_size" INTEGER NOT NULL DEFAULT 52428800,
    CONSTRAINT "bk_preference_bk_user_id_fkey" FOREIGN KEY ("bk_user_id") REFERENCES "bk_user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "bk_system" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "bk_user_id" INTEGER NOT NULL,
    CONSTRAINT "bk_system_bk_user_id_fkey" FOREIGN KEY ("bk_user_id") REFERENCES "bk_user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "bk_seed" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "bk_user_id" INTEGER NOT NULL,
    "seed_name" TEXT NOT NULL,
    "logs" TEXT,
    CONSTRAINT "bk_seed_bk_user_id_fkey" FOREIGN KEY ("bk_user_id") REFERENCES "bk_user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "bk_backup" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "bk_user_id" INTEGER NOT NULL,
    CONSTRAINT "bk_backup_bk_user_id_fkey" FOREIGN KEY ("bk_user_id") REFERENCES "bk_user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "bk_tag" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "bk_user_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    CONSTRAINT "bk_tag_bk_user_id_fkey" FOREIGN KEY ("bk_user_id") REFERENCES "bk_user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "bk_filter" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "bk_user_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT,
    CONSTRAINT "bk_filter_bk_user_id_fkey" FOREIGN KEY ("bk_user_id") REFERENCES "bk_user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "bk_folder" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "bk_user_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT,
    CONSTRAINT "bk_folder_bk_user_id_fkey" FOREIGN KEY ("bk_user_id") REFERENCES "bk_user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "bk_bookmark" (
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
    CONSTRAINT "bk_bookmark_bk_user_id_fkey" FOREIGN KEY ("bk_user_id") REFERENCES "bk_user" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "bk_bookmark_bk_folder_id_fkey" FOREIGN KEY ("bk_folder_id") REFERENCES "bk_folder" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "bk_bookmark_raw" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "bk_user_id" INTEGER NOT NULL,
    "bk_bookmark_id" INTEGER NOT NULL,
    "raw" TEXT NOT NULL,
    CONSTRAINT "bk_bookmark_raw_bk_user_id_fkey" FOREIGN KEY ("bk_user_id") REFERENCES "bk_user" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "bk_bookmark_raw_bk_bookmark_id_fkey" FOREIGN KEY ("bk_bookmark_id") REFERENCES "bk_bookmark" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "bk_bookmark_screenshot" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "bk_user_id" INTEGER NOT NULL,
    "bk_bookmark_id" INTEGER NOT NULL,
    "bk_bookmark_raw_id" INTEGER NOT NULL,
    "screenshot" TEXT NOT NULL,
    CONSTRAINT "bk_bookmark_screenshot_bk_user_id_fkey" FOREIGN KEY ("bk_user_id") REFERENCES "bk_user" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "bk_bookmark_screenshot_bk_bookmark_id_fkey" FOREIGN KEY ("bk_bookmark_id") REFERENCES "bk_bookmark" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "bk_bookmark_screenshot_bk_bookmark_raw_id_fkey" FOREIGN KEY ("bk_bookmark_raw_id") REFERENCES "bk_bookmark_raw" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "bk_bookmark_tag" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "bk_user_id" INTEGER NOT NULL,
    "bk_tag_id" INTEGER NOT NULL,
    "bk_bookmark_id" INTEGER NOT NULL,
    CONSTRAINT "bk_bookmark_tag_bk_user_id_fkey" FOREIGN KEY ("bk_user_id") REFERENCES "bk_user" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "bk_bookmark_tag_bk_tag_id_fkey" FOREIGN KEY ("bk_tag_id") REFERENCES "bk_tag" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "bk_bookmark_tag_bk_bookmark_id_fkey" FOREIGN KEY ("bk_bookmark_id") REFERENCES "bk_bookmark" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "bk_browser_history" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "bk_user_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "url" TEXT NOT NULL,
    "icon" TEXT,
    "count" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "bk_browser_history_bk_user_id_fkey" FOREIGN KEY ("bk_user_id") REFERENCES "bk_user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "bk_browser_history_content" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "bk_user_id" INTEGER NOT NULL,
    "bk_browser_history_id" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    CONSTRAINT "bk_browser_history_content_bk_user_id_fkey" FOREIGN KEY ("bk_user_id") REFERENCES "bk_user" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "bk_browser_history_content_bk_browser_history_id_fkey" FOREIGN KEY ("bk_browser_history_id") REFERENCES "bk_browser_history" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "bk_preference_bk_user_id_key" ON "bk_preference"("bk_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "bk_system_bk_user_id_key" ON "bk_system"("bk_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "bk_seed_seed_name_key" ON "bk_seed"("seed_name");

-- CreateIndex
CREATE UNIQUE INDEX "bk_tag_name_key" ON "bk_tag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "bk_filter_name_key" ON "bk_filter"("name");

-- CreateIndex
CREATE UNIQUE INDEX "bk_bookmark_bk_folder_id_key" ON "bk_bookmark"("bk_folder_id");

-- CreateIndex
CREATE UNIQUE INDEX "bk_bookmark_screenshot_bk_bookmark_raw_id_key" ON "bk_bookmark_screenshot"("bk_bookmark_raw_id");

-- CreateIndex
CREATE UNIQUE INDEX "bk_bookmark_tag_bk_tag_id_key" ON "bk_bookmark_tag"("bk_tag_id");

-- CreateIndex
CREATE UNIQUE INDEX "bk_browser_history_content_bk_browser_history_id_key" ON "bk_browser_history_content"("bk_browser_history_id");
