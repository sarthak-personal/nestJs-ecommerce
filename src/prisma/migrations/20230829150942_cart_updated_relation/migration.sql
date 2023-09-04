/*
  Warnings:

  - You are about to drop the column `cartCartId` on the `Item` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_cartCartId_fkey";

-- AlterTable
ALTER TABLE "Item" DROP COLUMN "cartCartId",
ADD COLUMN     "cartId" INTEGER;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart"("cartId") ON DELETE SET NULL ON UPDATE CASCADE;
