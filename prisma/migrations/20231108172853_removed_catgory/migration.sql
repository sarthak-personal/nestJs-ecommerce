/*
  Warnings:

  - You are about to drop the column `category` on the `orders` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[orderNumber]` on the table `orders` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "orders_userId_key";

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "category";

-- CreateIndex
CREATE UNIQUE INDEX "orders_orderNumber_key" ON "orders"("orderNumber");
