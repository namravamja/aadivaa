import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const deleteProduct = async (productId: string, artistId: string) => {
  const existingProduct = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!existingProduct) throw new Error("Product not found");
  if (existingProduct.artistId !== artistId)
    throw new Error("Not authorized to delete this product");

  await prisma.product.delete({
    where: { id: productId },
  });

  return { message: "Product deleted successfully" };
};
