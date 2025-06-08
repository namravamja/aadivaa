import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getProductsByArtist = async (artistId: string) => {
  const artist = await prisma.artist.findUnique({
    where: { id: artistId },
  });

  if (!artist) throw new Error("Artist not found");

  const products = await prisma.product.findMany({
    where: { artistId: artistId },
    include: {
      artist: {
        select: {
          id: true,
          fullName: true,
          storeName: true,
          email: true,
        },
      },
    },
  });

  return products;
};
