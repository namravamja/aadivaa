/*
  Warnings:

  - Added the required column `updatedAt` to the `Buyer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Artist" ADD COLUMN     "isAuthenticated" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Buyer" ADD COLUMN     "isAuthenticated" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
