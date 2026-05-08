/*
  Warnings:

  - You are about to drop the column `photos` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "photos";

-- CreateTable
CREATE TABLE "ProductPhoto" (
    "id" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "productId" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductPhoto_id_key" ON "ProductPhoto"("id");

-- AddForeignKey
ALTER TABLE "ProductPhoto" ADD CONSTRAINT "ProductPhoto_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;
