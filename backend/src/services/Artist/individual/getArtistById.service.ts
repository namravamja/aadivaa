import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getArtistById = async (id: string) => {
  const artist = await prisma.artist.findUnique({
    where: { id },
  });
  if (!artist) throw new Error("Artist not found");
  return artist;
};
