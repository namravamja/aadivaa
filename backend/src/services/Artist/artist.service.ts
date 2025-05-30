import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../../utils/jwt";

const prisma = new PrismaClient();

export interface ArtistUpdateData {
  fullName?: string;
  mobile?: string;
  storeName?: string;
  businessType?: string;
  businessRegistrationNumber?: string;
  gstNumber?: string;
  panNumber?: string;
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
  upiId?: string;
  shippingType?: string;
  inventoryVolume?: number;
  returnPolicy?: string;
  supportContact?: string;
  workingHours?: string;
  businessLogo?: string;
  digitalSignature?: string;
  termsAgreed?: boolean;
  // Add more optional fields as per your schema
}

export const createArtist = async (data: {
  email: string;
  password: string;
  fullName?: string;
  mobile?: string;
  storeName?: string;
  businessType?: string;
  businessRegistrationNumber?: string;
  gstNumber?: string;
  panNumber?: string;
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
  upiId?: string;
  shippingType?: string;
  inventoryVolume?: number;
  returnPolicy?: string;
  supportContact?: string;
  workingHours?: string;
  businessLogo?: string;
  digitalSignature?: string;
  termsAgreed?: boolean;
}) => {
  const existing = await prisma.artist.findUnique({
    where: { email: data.email },
  });
  if (existing) throw new Error("Email already registered");

  const hashedPassword = await hashPassword(data.password);

  const artist = await prisma.artist.create({
    data: {
      ...data,
      inventoryVolume:
        data.inventoryVolume !== undefined && data.inventoryVolume !== null
          ? String(data.inventoryVolume)
          : undefined,
      password: hashedPassword,
    },
  });

  return artist;
};

export const getArtistById = async (id: string) => {
  const artist = await prisma.artist.findUnique({
    where: { id },
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
  if (!artist) throw new Error("Artist not found");
  return artist;
};

export const updateArtist = async (id: string, data: ArtistUpdateData) => {
  const artist = await prisma.artist.update({
    where: { id },
    data: {
      ...data,
      inventoryVolume:
        data.inventoryVolume !== undefined && data.inventoryVolume !== null
          ? String(data.inventoryVolume)
          : undefined,
    },
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
  return artist;
};

export const deleteArtist = async (id: string) => {
  await prisma.artist.delete({ where: { id } });
  return { message: "Artist deleted" };
};

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
