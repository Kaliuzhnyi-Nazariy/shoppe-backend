/*
  Warnings:

  - You are about to drop the column `billingAddressId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `shippingAddressId` on the `Order` table. All the data in the column will be lost.
  - Added the required column `billingCity` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `billingCountry` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `billingEmail` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `billingFirstName` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `billingLastName` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `billingPhone` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `billingPostcode` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `billingStreet` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shippingCity` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shippingCountry` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shippingEmail` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shippingFirstName` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shippingLastName` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shippingPhone` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shippingPostcode` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shippingStreet` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_billingAddressId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_buyerId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_shippingAddressId_fkey";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "billingAddressId",
DROP COLUMN "shippingAddressId",
ADD COLUMN     "billingCity" TEXT NOT NULL,
ADD COLUMN     "billingCountry" TEXT NOT NULL,
ADD COLUMN     "billingEmail" TEXT NOT NULL,
ADD COLUMN     "billingFirstName" TEXT NOT NULL,
ADD COLUMN     "billingLastName" TEXT NOT NULL,
ADD COLUMN     "billingPhone" TEXT NOT NULL,
ADD COLUMN     "billingPostcode" TEXT NOT NULL,
ADD COLUMN     "billingStreet" TEXT NOT NULL,
ADD COLUMN     "shippingCity" TEXT NOT NULL,
ADD COLUMN     "shippingCountry" TEXT NOT NULL,
ADD COLUMN     "shippingEmail" TEXT NOT NULL,
ADD COLUMN     "shippingFirstName" TEXT NOT NULL,
ADD COLUMN     "shippingLastName" TEXT NOT NULL,
ADD COLUMN     "shippingPhone" TEXT NOT NULL,
ADD COLUMN     "shippingPostcode" TEXT NOT NULL,
ADD COLUMN     "shippingStreet" TEXT NOT NULL,
ALTER COLUMN "buyerId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
