import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const listArtists = async () => {
  return prisma.artist.findMany({
    include: {
      socialLinks: true,
      warehouseAddress: true,
      businessAddress: true,
    },
  });
};
