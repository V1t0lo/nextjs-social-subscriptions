/*
  Warnings:

  - A unique constraint covering the columns `[createdAt,id]` on the table `Post` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Post_createdAt_id_key" ON "Post"("createdAt", "id");
