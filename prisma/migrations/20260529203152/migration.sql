/*
  Warnings:

  - You are about to drop the column `userEmail` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `userName` on the `Review` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[productId,userId]` on the table `Review` will be added. If there are existing duplicate values, this will fail.
  - Made the column `userId` on table `Review` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_userId_fkey";

-- DropIndex
DROP INDEX "Review_productId_userEmail_key";

-- AlterTable
ALTER TABLE "Review" DROP COLUMN "userEmail",
DROP COLUMN "userName",
ALTER COLUMN "userId" SET NOT NULL;

-- CreateIndex
CREATE INDEX "Review_userId_idx" ON "Review"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Review_productId_userId_key" ON "Review"("productId", "userId");

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
