import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getArtistById = async (id: string) => {
  const artist = await prisma.artist.findUnique({
    where: { id },
    select: {
      id: true,
      fullName: true,
      profileProgress: true,
      storeName: true,
      email: true,
      mobile: true,
      password: true,
      confirmPassword: true,
      businessType: true,
      businessRegistrationNumber: true,
      productCategories: true,
      businessLogo: true,
      googleId: true,
      provider: true,
      isOAuthUser: true,
      bankAccountName: true,
      bankName: true,
      accountNumber: true,
      ifscCode: true,
      upiId: true,
      gstNumber: true,
      panNumber: true,
      shippingType: true,
      serviceAreas: true,
      inventoryVolume: true,
      supportContact: true,
      returnPolicy: true,
      workingHours: true,
      termsAgreed: true,
      digitalSignature: true,
      createdAt: true,
      updatedAt: true,
      isAuthenticated: true,
      forgotPasswordToken: true,
      forgotPasswordExpires: true,
      verifyToken: true,
      verifyExpires: true,
      isVerified: true,

      businessAddress: {
        select: {
          id: true,
          street: true,
          city: true,
          state: true,
          country: true,
          pinCode: true,
        },
      },
      warehouseAddress: {
        select: {
          id: true,
          street: true,
          sameAsBusiness: true,
          city: true,
          state: true,
          country: true,
          pinCode: true,
        },
      },
      documents: {
        select: {
          id: true,
          gstCertificate: true,
          panCard: true,
          businessLicense: true,
          canceledCheque: true,
        },
      },
      socialLinks: {
        select: {
          id: true,
          website: true,
          instagram: true,
          facebook: true,
          twitter: true,
        },
      },
      products: true,
      orderItems: {
        include: {
          product: true,
        },
      },
      Review: {
        include: {
          product: true,
          buyer: true,
        },
      },
    },
  });
  if (!artist) throw new Error("Artist not found");
  return artist;
};
