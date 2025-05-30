/*
  Warnings:

  - You are about to drop the column `avatar` on the `Artist` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `Artist` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `Artist` table. All the data in the column will be lost.
  - You are about to drop the `Address` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[businessAddressId]` on the table `Artist` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[warehouseAddressId]` on the table `Artist` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[documentsId]` on the table `Artist` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[socialLinksId]` on the table `Artist` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Address" DROP CONSTRAINT "Address_userId_fkey";

-- AlterTable
ALTER TABLE "Artist" DROP COLUMN "avatar",
DROP COLUMN "firstName",
DROP COLUMN "lastName",
ADD COLUMN     "accountNumber" TEXT,
ADD COLUMN     "bankAccountName" TEXT,
ADD COLUMN     "bankName" TEXT,
ADD COLUMN     "businessAddressId" TEXT,
ADD COLUMN     "businessLogo" TEXT,
ADD COLUMN     "businessRegistrationNumber" TEXT,
ADD COLUMN     "businessType" TEXT,
ADD COLUMN     "confirmPassword" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "digitalSignature" TEXT,
ADD COLUMN     "documentsId" TEXT,
ADD COLUMN     "fullName" TEXT,
ADD COLUMN     "gstNumber" TEXT,
ADD COLUMN     "ifscCode" TEXT,
ADD COLUMN     "inventoryVolume" TEXT,
ADD COLUMN     "mobile" TEXT,
ADD COLUMN     "panNumber" TEXT,
ADD COLUMN     "productCategories" TEXT[],
ADD COLUMN     "returnPolicy" TEXT,
ADD COLUMN     "serviceAreas" TEXT[],
ADD COLUMN     "shippingType" TEXT,
ADD COLUMN     "socialLinksId" TEXT,
ADD COLUMN     "storeName" TEXT,
ADD COLUMN     "supportContact" TEXT,
ADD COLUMN     "termsAgreed" BOOLEAN,
ADD COLUMN     "updatedAt" TIMESTAMP(3),
ADD COLUMN     "upiId" TEXT,
ADD COLUMN     "warehouseAddressId" TEXT,
ADD COLUMN     "workingHours" TEXT;

-- DropTable
DROP TABLE "Address";

-- CreateTable
CREATE TABLE "buyer_addresses" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "company" TEXT,
    "street" TEXT NOT NULL,
    "apartment" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "buyer_addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BusinessAddress" (
    "id" TEXT NOT NULL,
    "street" TEXT,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT,
    "pinCode" TEXT,

    CONSTRAINT "BusinessAddress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WarehouseAddress" (
    "id" TEXT NOT NULL,
    "sameAsBusiness" BOOLEAN,
    "street" TEXT,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT,
    "pinCode" TEXT,

    CONSTRAINT "WarehouseAddress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Documents" (
    "id" TEXT NOT NULL,
    "gstCertificate" TEXT,
    "panCard" TEXT,
    "businessLicense" TEXT,
    "canceledCheque" TEXT,

    CONSTRAINT "Documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SocialLinks" (
    "id" TEXT NOT NULL,
    "website" TEXT,
    "instagram" TEXT,
    "facebook" TEXT,
    "twitter" TEXT,

    CONSTRAINT "SocialLinks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Artist_businessAddressId_key" ON "Artist"("businessAddressId");

-- CreateIndex
CREATE UNIQUE INDEX "Artist_warehouseAddressId_key" ON "Artist"("warehouseAddressId");

-- CreateIndex
CREATE UNIQUE INDEX "Artist_documentsId_key" ON "Artist"("documentsId");

-- CreateIndex
CREATE UNIQUE INDEX "Artist_socialLinksId_key" ON "Artist"("socialLinksId");

-- AddForeignKey
ALTER TABLE "buyer_addresses" ADD CONSTRAINT "buyer_addresses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Buyer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Artist" ADD CONSTRAINT "Artist_businessAddressId_fkey" FOREIGN KEY ("businessAddressId") REFERENCES "BusinessAddress"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Artist" ADD CONSTRAINT "Artist_warehouseAddressId_fkey" FOREIGN KEY ("warehouseAddressId") REFERENCES "WarehouseAddress"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Artist" ADD CONSTRAINT "Artist_documentsId_fkey" FOREIGN KEY ("documentsId") REFERENCES "Documents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Artist" ADD CONSTRAINT "Artist_socialLinksId_fkey" FOREIGN KEY ("socialLinksId") REFERENCES "SocialLinks"("id") ON DELETE SET NULL ON UPDATE CASCADE;
