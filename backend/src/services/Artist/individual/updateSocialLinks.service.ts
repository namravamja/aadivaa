import { PrismaClient } from "@prisma/client";

interface SocialLinksData {
  website?: string;
  instagram?: string;
  facebook?: string;
  twitter?: string;
}

const prisma = new PrismaClient();

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
