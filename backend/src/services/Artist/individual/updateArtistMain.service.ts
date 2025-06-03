import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export interface ArtistUpdateData {
  warehouseAddress: any;
  businessAddress: any;
  id: string;
  fullName: string;
  avatar?: string;
  profileProgress?: number;
  storeName?: string;
  email?: string;
  mobile?: string;
  password?: string;
  confirmPassword?: string;
  businessType?: string;
  businessRegistrationNumber?: string;
  productCategories?: string[];
  businessLogo?: string;
  businessAddressId?: string | null;
  warehouseAddressId?: string | null;
  bankAccountName?: string;
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
  upiId?: string;
  gstNumber?: string;
  panNumber?: string;
  documentsId?: string | null;
  shippingType?: string;
  serviceAreas?: string[];
  inventoryVolume?: string;
  supportContact?: string;
  returnPolicy?: string;
  workingHours?: string;
  socialLinksId?: string | null;
  termsAgreed?: boolean;
  digitalSignature?: string;
  isAuthenticated?: boolean;
  isVerified?: boolean;
}

export const updateArtistMain = async (id: string, data: any) => {
  const updateData: any = {
    ...data,
    inventoryVolume:
      data.inventoryVolume !== undefined && data.inventoryVolume !== null
        ? String(data.inventoryVolume)
        : undefined,
  };

  const artist = await prisma.artist.update({
    where: { id },
    data: updateData,
    select: {
      password: false,
      id: true,
      email: true,
      fullName: true,
      mobile: true,
      storeName: true,
      businessType: true,
      businessRegistrationNumber: true,
      productCategories: true,
      gstNumber: true,
      panNumber: true,
      bankAccountName: true,
      bankName: true,
      accountNumber: true,
      ifscCode: true,
      upiId: true,
      shippingType: true,
      serviceAreas: true,
      inventoryVolume: true,
      returnPolicy: true,
      supportContact: true,
      workingHours: true,
      businessLogo: true,
      digitalSignature: true,
      termsAgreed: true,
      createdAt: true,
      updatedAt: true,
      avatar: true,
      profileProgress: true,
    },
  });

  return artist;
};
