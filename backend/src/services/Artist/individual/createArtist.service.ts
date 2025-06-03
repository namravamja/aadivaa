import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../../../utils/jwt";

const prisma = new PrismaClient();

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
