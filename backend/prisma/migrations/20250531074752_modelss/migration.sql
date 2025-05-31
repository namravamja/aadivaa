/*
  Warnings:

  - A unique constraint covering the columns `[forgotPasswordToken]` on the table `Artist` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[verifyToken]` on the table `Artist` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[forgotPasswordToken]` on the table `Buyer` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[verifyToken]` on the table `Buyer` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Artist" ADD COLUMN     "forgotPasswordExpires" TIMESTAMP(3),
ADD COLUMN     "forgotPasswordToken" TEXT,
ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "verifyExpires" TIMESTAMP(3),
ADD COLUMN     "verifyToken" TEXT;

-- AlterTable
ALTER TABLE "Buyer" ADD COLUMN     "forgotPasswordExpires" TIMESTAMP(3),
ADD COLUMN     "forgotPasswordToken" TEXT,
ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "verifyExpires" TIMESTAMP(3),
ADD COLUMN     "verifyToken" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Artist_forgotPasswordToken_key" ON "Artist"("forgotPasswordToken");

-- CreateIndex
CREATE UNIQUE INDEX "Artist_verifyToken_key" ON "Artist"("verifyToken");

-- CreateIndex
CREATE UNIQUE INDEX "Buyer_forgotPasswordToken_key" ON "Buyer"("forgotPasswordToken");

-- CreateIndex
CREATE UNIQUE INDEX "Buyer_verifyToken_key" ON "Buyer"("verifyToken");
