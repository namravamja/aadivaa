import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../../../utils/jwt";

const prisma = new PrismaClient();

export const listArtists = async () => {
  return prisma.artist.findMany({
    select: {
      password: false,
      id: true,
      email: true,
      fullName: true,
      mobile: true,
      storeName: true,
      businessType: true,
      businessRegistrationNumber: true,
      gstNumber: true,
      panNumber: true,
      bankName: true,
      accountNumber: true,
      ifscCode: true,
      upiId: true,
      shippingType: true,
      inventoryVolume: true,
      returnPolicy: true,
      supportContact: true,
      workingHours: true,
      businessLogo: true,
      digitalSignature: true,
      termsAgreed: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};
