import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const deleteArtist = async (id: string) => {
  await prisma.artist.delete({ where: { id } });
  return { message: "Artist deleted" };
};
