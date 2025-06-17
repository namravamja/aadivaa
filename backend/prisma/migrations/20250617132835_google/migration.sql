/*
  Warnings:

  - A unique constraint covering the columns `[googleId]` on the table `Artist` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[googleId]` on the table `Buyer` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Artist" ADD COLUMN     "googleId" TEXT,
ADD COLUMN     "isOAuthUser" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "provider" TEXT DEFAULT 'local';

-- AlterTable
ALTER TABLE "Buyer" ADD COLUMN     "googleId" TEXT,
ADD COLUMN     "isOAuthUser" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "provider" TEXT DEFAULT 'local';

-- CreateIndex
CREATE UNIQUE INDEX "Artist_googleId_key" ON "Artist"("googleId");

-- CreateIndex
CREATE UNIQUE INDEX "Buyer_googleId_key" ON "Buyer"("googleId");
