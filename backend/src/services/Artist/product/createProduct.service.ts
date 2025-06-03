import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createProduct = async (data: {
  productName: string;
  category: string;
  shortDescription: string;

  sellingPrice: string;
  mrp: string;
  availableStock: string;
  skuCode: string;

  productImages: string[];

  weight: string;
  dimensions: {
    length: string;
    width: string;
    height: string;
  };
  shippingCost: string;
  deliveryTimeEstimate: string;

  artistId: string; // Required to relate product to an artist
}) => {
  const artist = await prisma.artist.findUnique({
    where: { id: data.artistId },
  });

  if (!artist) throw new Error("Artist not found");

  const product = await prisma.product.create({
    data: {
      productName: data.productName,
      category: data.category,
      shortDescription: data.shortDescription,

      sellingPrice: data.sellingPrice,
      mrp: data.mrp,
      availableStock: data.availableStock,
      skuCode: data.skuCode,

      productImages: data.productImages,

      weight: data.weight,
      length: data.dimensions.length,
      width: data.dimensions.width,
      height: data.dimensions.height,

      shippingCost: data.shippingCost,
      deliveryTimeEstimate: data.deliveryTimeEstimate,

      artist: { connect: { id: data.artistId } },
    },
  });

  return product;
};
