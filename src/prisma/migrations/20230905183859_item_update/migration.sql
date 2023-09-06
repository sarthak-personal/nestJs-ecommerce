/*
  Warnings:

  - A unique constraint covering the columns `[productId]` on the table `Item` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Item_productId_key" ON "Item"("productId");
