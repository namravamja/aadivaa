import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type UpdateProductInput = {
  productName?: string;
  category?: string;
  shortDescription?: string;
  sellingPrice?: string;
  mrp?: string;
  availableStock?: string;
  skuCode?: string;
  productImages?: string[];
  weight?: string;
  length?: string;
  width?: string;
  height?: string;
  shippingCost?: string;
  deliveryTimeEstimate?: string;
};

export const updateProduct = async (
  productId: string,
  artistId: string,
  inputData: UpdateProductInput
) => {
  // 1. Check if product exists
  const existingProduct = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!existingProduct) throw new Error("Product not found");

  // 2. Check if artist owns the product
  if (existingProduct.artistId !== artistId) {
    throw new Error("Not authorized to update this product");
  }

  // 3. Filter and apply only updatable fields
  const allowedFields: (keyof UpdateProductInput)[] = [
    "productName",
    "category",
    "shortDescription",
    "sellingPrice",
    "mrp",
    "availableStock",
    "skuCode",
    "productImages",
    "weight",
    "length",
    "width",
    "height",
    "shippingCost",
    "deliveryTimeEstimate",
  ];

  const dataToUpdate: UpdateProductInput = {};

  for (const key of allowedFields) {
    if (key in inputData) {
      dataToUpdate[key] = inputData[key] as any;
    }
  }

  // 4. Perform the update
  const updatedProduct = await prisma.product.update({
    where: { id: productId },
    data: dataToUpdate,
  });

  return updatedProduct;
};
