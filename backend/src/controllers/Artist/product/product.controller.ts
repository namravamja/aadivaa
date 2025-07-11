import { Request, Response } from "express";
import * as productService from "../../../services/Artist/artist.service";
import { getCache, setCache, deleteCache } from "../../../helpers/cache";

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

    // Clear related caches
    await deleteCache(`products:all`);
    await deleteCache(`products:artist:${artistId}`);

    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const updateProduct = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const artistId = req.user?.id;
    if (!artistId) throw new Error("Unauthorized");

    const { productId } = req.params;
    const files = req.files as Express.Multer.File[];

    // 1. Verify product exists and belongs to this artist
    const existingProduct = await productService.getProductById(productId);

    if (!existingProduct) throw new Error("Product not found");
    if (existingProduct.artistId !== artistId)
      throw new Error("Not authorized to update this product");

    // 2. Handle image updates
    let updatedData = { ...req.body };

    // If files are uploaded, replace the productImages array
    if (files && files.length > 0) {
      const imageUrls = files.map((file) => file.path);
      updatedData.productImages = imageUrls;
    } else {
      // If no new files, keep existing images
      // This handles the case where user didn't change images
      delete updatedData.productImages;
    }

    // 3. Update product with updatedData
    const updatedProduct = await productService.updateProduct(
      productId,
      artistId,
      updatedData
    );

    // Clear related caches
    await deleteCache(`product:${productId}`);
    await deleteCache(`products:all`);
    await deleteCache(`products:artist:${artistId}`);

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Update product error:", error);
    res.status(400).json({ error: (error as Error).message });
  }
};

// Get all products
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const cacheKey = `products:all`;
    const cachedProducts = await getCache(cacheKey);

    if (cachedProducts) {
      return res.status(200).json({ source: "cache", data: cachedProducts });
    }

    const products = await productService.getAllProducts();
    await setCache(cacheKey, products);

    res.status(200).json({ source: "db", data: products });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Get product by ID
export const getProductById = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const cacheKey = `product:${productId}`;
    const cachedProduct = await getCache(cacheKey);

    if (cachedProduct) {
      return res.status(200).json({ source: "cache", data: cachedProduct });
    }

    const product = await productService.getProductById(productId);
    await setCache(cacheKey, product);

    res.status(200).json({ source: "db", data: product });
  } catch (error) {
    res.status(404).json({ error: (error as Error).message });
  }
};

// by artist
export const getProductsByArtist = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const artistId = req.user?.id;
    if (!artistId) throw new Error("Unauthorized");

    const cacheKey = `products:artist:${artistId}`;
    const cachedProducts = await getCache(cacheKey);

    if (cachedProducts) {
      return res.status(200).json({ source: "cache", data: cachedProducts });
    }

    const products = await productService.getProductsByArtist(artistId);
    await setCache(cacheKey, products);

    res.status(200).json({ source: "db", data: products });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const getProductsByArtistId = async (req: Request, res: Response) => {
  try {
    const { artistId } = req.params;
    if (!artistId) throw new Error("Unauthorized");

    const cacheKey = `products:artist:${artistId}`;
    const cachedProducts = await getCache(cacheKey);

    if (cachedProducts) {
      return res.status(200).json({ source: "cache", data: cachedProducts });
    }

    const products = await productService.getProductsByArtist(artistId);
    await setCache(cacheKey, products);

    res.status(200).json({ source: "db", data: products });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

// Delete product
export const deleteProduct = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const artistId = req.user?.id;
    if (!artistId) throw new Error("Unauthorized");

    const { productId } = req.params;

    const existingProduct = await productService.getProductById(productId);
    if (!existingProduct) throw new Error("Product not found");

    if (existingProduct.artistId !== artistId)
      throw new Error("Not authorized to delete this product");

    await productService.deleteProduct(productId, artistId);

    // Clear related caches
    await deleteCache(`product:${productId}`);
    await deleteCache(`products:all`);
    await deleteCache(`products:artist:${artistId}`);

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const updateStockOnly = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const artistId = req.user?.id;
    if (!artistId) throw new Error("Unauthorized");

    const { productId, availableStock } = req.body;

    if (!productId || !availableStock) {
      throw new Error("productId and availableStock are required");
    }

    const updatedProduct = await productService.updateProductStockOnly(
      productId,
      artistId,
      availableStock
    );

    // Clear related caches
    await deleteCache(`product:${productId}`);
    await deleteCache(`products:all`);
    await deleteCache(`products:artist:${artistId}`);

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};
