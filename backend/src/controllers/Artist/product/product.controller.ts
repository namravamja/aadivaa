import { Request, Response } from "express";
import * as productService from "../../../services/Artist/artist.service";

export interface AuthenticatedRequest extends Request {
  user?: { id: string; role: string };
}

// Create product
export const createProduct = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const artistId = req.user?.id;
    if (!artistId) throw new Error("Unauthorized");

    const files = req.files as Express.Multer.File[];
    const imageUrls = files?.map((file) => file.path) || [];

    const productData = {
      ...req.body,
      productImages: imageUrls,
    };

    const product = await productService.createProduct(artistId, productData);

    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const files = req.files as Express.Multer.File[];

    const imageUrls = files?.map((file) => file.path);
    const updatedData = {
      ...req.body,
      ...(imageUrls?.length ? { productImages: imageUrls } : {}),
    };

    const updatedProduct = await productService.updateProduct(
      productId,
      updatedData
    );
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

// Get all products
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await productService.getAllProducts();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Get product by ID
export const getProductById = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const product = await productService.getProductById(productId);
    res.status(200).json(product);
  } catch (error) {
    res.status(404).json({ error: (error as Error).message });
  }
};
