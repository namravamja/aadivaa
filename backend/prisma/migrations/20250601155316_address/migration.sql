/*
  Warnings:

  - You are about to drop the column `street` on the `BusinessAddress` table. All the data in the column will be lost.
  - You are about to drop the column `street` on the `WarehouseAddress` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BusinessAddress" DROP COLUMN "street";

-- AlterTable
ALTER TABLE "WarehouseAddress" DROP COLUMN "street";
