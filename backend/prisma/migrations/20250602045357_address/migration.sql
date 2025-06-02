/*
  Warnings:

  - Made the column `street` on table `BusinessAddress` required. This step will fail if there are existing NULL values in that column.
  - Made the column `street` on table `WarehouseAddress` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "BusinessAddress" ALTER COLUMN "street" SET NOT NULL;

-- AlterTable
ALTER TABLE "WarehouseAddress" ALTER COLUMN "street" SET NOT NULL;
