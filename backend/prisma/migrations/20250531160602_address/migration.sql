/*
  Warnings:

  - You are about to drop the column `phoneNumber` on the `buyer_addresses` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "buyer_addresses" DROP COLUMN "phoneNumber",
ADD COLUMN     "phone" TEXT;
