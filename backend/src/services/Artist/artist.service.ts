import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../../utils/jwt";

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
      // Include the related data in the response
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
          city: true,
          state: true,
          country: true,
          pinCode: true,
          sameAsBusiness: true,
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
    },
  });
  if (!artist) throw new Error("Artist not found");
  return artist;
};

interface BusinessAddressData {
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  pinCode?: string;
}

interface WarehouseAddressData {
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  pinCode?: string;
  sameAsBusiness?: boolean;
}

interface DocumentsData {
  gstCertificate?: string;
  panCard?: string;
  businessLicense?: string;
  canceledCheque?: string;
}

interface SocialLinksData {
  website?: string;
  instagram?: string;
  facebook?: string;
  twitter?: string;
}

// Update main artist fields only
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

// Update Business Address Service
export const updateBusinessAddress = async (
  artistId: string,
  addressData: BusinessAddressData
) => {
  // First, get the artist to check if they have a business address
  const artist = await prisma.artist.findUnique({
    where: { id: artistId },
    select: { businessAddressId: true },
  });

  if (!artist) {
    throw new Error("Artist not found");
  }

  let updatedAddress;

  if (artist.businessAddressId) {
    // Update existing address
    updatedAddress = await prisma.businessAddress.update({
      where: { id: artist.businessAddressId },
      data: {
        street: addressData.street || "",
        city: addressData.city,
        state: addressData.state,
        country: addressData.country,
        pinCode: addressData.pinCode,
      },
    });
  } else {
    // Create new address and link to artist
    updatedAddress = await prisma.businessAddress.create({
      data: {
        street: addressData.street || "",
        city: addressData.city || "",
        state: addressData.state,
        country: addressData.country,
        pinCode: addressData.pinCode,
      },
    });

    // Link the new address to the artist
    await prisma.artist.update({
      where: { id: artistId },
      data: { businessAddressId: updatedAddress.id },
    });
  }

  return updatedAddress;
};

// Update Warehouse Address Service
export const updateWarehouseAddress = async (
  artistId: string,
  addressData: WarehouseAddressData
) => {
  const artist = await prisma.artist.findUnique({
    where: { id: artistId },
    select: {
      warehouseAddressId: true,
      businessAddress: true,
    },
  });

  if (!artist) {
    throw new Error("Artist not found");
  }

  // If sameAsBusiness is true, copy from business address
  let finalAddressData = { ...addressData };
  if (addressData.sameAsBusiness && artist.businessAddress) {
    finalAddressData = {
      ...finalAddressData,
      street: artist.businessAddress.street ?? undefined,
      city: artist.businessAddress.city ?? undefined,
      state: artist.businessAddress.state ?? undefined,
      country: artist.businessAddress.country ?? undefined,
      pinCode: artist.businessAddress.pinCode ?? undefined,
    };
  }

  let updatedAddress;

  if (artist.warehouseAddressId) {
    // Update existing address
    updatedAddress = await prisma.warehouseAddress.update({
      where: { id: artist.warehouseAddressId },
      data: {
        street: finalAddressData.street || "",
        city: finalAddressData.city,
        state: finalAddressData.state,
        country: finalAddressData.country,
        pinCode: finalAddressData.pinCode,
        sameAsBusiness: finalAddressData.sameAsBusiness || false,
      },
    });
  } else {
    // Create new address and link to artist
    updatedAddress = await prisma.warehouseAddress.create({
      data: {
        street: finalAddressData.street || "",
        city: finalAddressData.city || "",
        state: finalAddressData.state,
        country: finalAddressData.country,
        pinCode: finalAddressData.pinCode,
        sameAsBusiness: finalAddressData.sameAsBusiness || false,
      },
    });

    // Link the new address to the artist
    await prisma.artist.update({
      where: { id: artistId },
      data: { warehouseAddressId: updatedAddress.id },
    });
  }

  return updatedAddress;
};

// Update Documents Service
export const updateDocuments = async (
  artistId: string,
  documentsData: DocumentsData
) => {
  try {
    // First, check if artist exists
    const artist = await prisma.artist.findUnique({
      where: { id: artistId },
      select: {
        id: true,
        documentsId: true,
      },
    });

    if (!artist) {
      throw new Error("Artist not found");
    }

    console.log("Artist found:", artist);
    console.log("Documents data:", documentsData);

    let updatedDocuments;

    if (artist.documentsId) {
      // Update existing documents
      console.log("Updating existing documents with ID:", artist.documentsId);

      updatedDocuments = await prisma.documents.update({
        where: { id: artist.documentsId },
        data: {
          ...documentsData,
        },
      });
    } else {
      // Create new documents and link to artist
      console.log("Creating new documents for artist:", artistId);

      updatedDocuments = await prisma.documents.create({
        data: {
          ...documentsData,
        },
      });

      console.log("Created documents:", updatedDocuments);

      // Link the new documents to the artist
      await prisma.artist.update({
        where: { id: artistId },
        data: { documentsId: updatedDocuments.id },
      });

      console.log("Linked documents to artist");
    }

    return updatedDocuments;
  } catch (error) {
    console.error("Service error in updateDocuments:", error);
    throw error; // Re-throw to be handled by controller
  }
};
// Update Social Links Service
export const updateSocialLinks = async (
  artistId: string,
  socialLinksData: SocialLinksData
) => {
  const artist = await prisma.artist.findUnique({
    where: { id: artistId },
    select: { socialLinksId: true },
  });

  if (!artist) {
    throw new Error("Artist not found");
  }

  let updatedSocialLinks;

  if (artist.socialLinksId) {
    // Update existing social links
    updatedSocialLinks = await prisma.socialLinks.update({
      where: { id: artist.socialLinksId },
      data: {
        ...socialLinksData,
      },
    });
  } else {
    // Create new social links and link to artist
    updatedSocialLinks = await prisma.socialLinks.create({
      data: {
        ...socialLinksData,
      },
    });

    // Link the new social links to the artist
    await prisma.artist.update({
      where: { id: artistId },
      data: { socialLinksId: updatedSocialLinks.id },
    });
  }

  return updatedSocialLinks;
};

// This block appears to be a duplicate and should be removed to avoid the 'id' not defined error.
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
