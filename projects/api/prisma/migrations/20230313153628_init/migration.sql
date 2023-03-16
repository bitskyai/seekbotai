-- CreateTable
CREATE TABLE "bk_user" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "bk_preference" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "bk_user_id" INTEGER NOT NULL,
    "log_level" TEXT NOT NULL DEFAULT 'info',
    "log_size" INTEGER NOT NULL DEFAULT 52428800,
    CONSTRAINT "bk_preference_bk_user_id_fkey" FOREIGN KEY ("bk_user_id") REFERENCES "bk_user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "bk_system" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "bk_user_id" INTEGER NOT NULL,
    CONSTRAINT "bk_system_bk_user_id_fkey" FOREIGN KEY ("bk_user_id") REFERENCES "bk_user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "bk_backup" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "bk_user_id" INTEGER NOT NULL,
    CONSTRAINT "bk_backup_bk_user_id_fkey" FOREIGN KEY ("bk_user_id") REFERENCES "bk_user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "bk_tag" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "bk_user_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    CONSTRAINT "bk_tag_bk_user_id_fkey" FOREIGN KEY ("bk_user_id") REFERENCES "bk_user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "bk_filter" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "bk_user_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT,
    CONSTRAINT "bk_filter_bk_user_id_fkey" FOREIGN KEY ("bk_user_id") REFERENCES "bk_user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "bk_folder" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "bk_user_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT,
    CONSTRAINT "bk_folder_bk_user_id_fkey" FOREIGN KEY ("bk_user_id") REFERENCES "bk_user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "bk_bookmark" (
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
    CONSTRAINT "bk_bookmark_bk_user_id_fkey" FOREIGN KEY ("bk_user_id") REFERENCES "bk_user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "bk_bookmark_bk_folder_id_fkey" FOREIGN KEY ("bk_folder_id") REFERENCES "bk_folder" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "bk_bookmark_content" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "bk_user_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT,
    CONSTRAINT "bk_bookmark_content_bk_user_id_fkey" FOREIGN KEY ("bk_user_id") REFERENCES "bk_user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "bk_bookmark_tag" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "bk_user_id" INTEGER NOT NULL,
    "bk_tag_id" INTEGER NOT NULL,
    "bk_bookmark_id" INTEGER NOT NULL,
    CONSTRAINT "bk_bookmark_tag_bk_user_id_fkey" FOREIGN KEY ("bk_user_id") REFERENCES "bk_user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
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
    "count" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "bk_browser_history_bk_user_id_fkey" FOREIGN KEY ("bk_user_id") REFERENCES "bk_user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "bk_browser_history_content" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "bk_user_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT,
    CONSTRAINT "bk_browser_history_content_bk_user_id_fkey" FOREIGN KEY ("bk_user_id") REFERENCES "bk_user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "bk_preference_bk_user_id_key" ON "bk_preference"("bk_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "bk_system_bk_user_id_key" ON "bk_system"("bk_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "bk_backup_bk_user_id_key" ON "bk_backup"("bk_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "bk_tag_bk_user_id_key" ON "bk_tag"("bk_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "bk_tag_name_key" ON "bk_tag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "bk_filter_bk_user_id_key" ON "bk_filter"("bk_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "bk_filter_name_key" ON "bk_filter"("name");

-- CreateIndex
CREATE UNIQUE INDEX "bk_folder_bk_user_id_key" ON "bk_folder"("bk_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "bk_bookmark_bk_user_id_key" ON "bk_bookmark"("bk_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "bk_bookmark_bk_folder_id_key" ON "bk_bookmark"("bk_folder_id");

-- CreateIndex
CREATE UNIQUE INDEX "bk_bookmark_content_bk_user_id_key" ON "bk_bookmark_content"("bk_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "bk_bookmark_tag_bk_user_id_key" ON "bk_bookmark_tag"("bk_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "bk_bookmark_tag_bk_tag_id_key" ON "bk_bookmark_tag"("bk_tag_id");

-- CreateIndex
CREATE UNIQUE INDEX "bk_bookmark_tag_bk_bookmark_id_key" ON "bk_bookmark_tag"("bk_bookmark_id");

-- CreateIndex
CREATE UNIQUE INDEX "bk_browser_history_bk_user_id_key" ON "bk_browser_history"("bk_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "bk_browser_history_content_bk_user_id_key" ON "bk_browser_history_content"("bk_user_id");
