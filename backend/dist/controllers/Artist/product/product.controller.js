"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.getProductsByArtistId = exports.getProductsByArtist = exports.getProductById = exports.getAllProducts = exports.updateProduct = exports.createProduct = void 0;
const productService = __importStar(require("../../../services/Artist/artist.service"));
// Create product
const createProduct = async (req, res) => {
    try {
        const artistId = req.user?.id;
        if (!artistId)
            throw new Error("Unauthorized");
        const files = req.files;
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
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.createProduct = createProduct;
const updateProduct = async (req, res) => {
    try {
        const artistId = req.user?.id;
        if (!artistId)
            throw new Error("Unauthorized");
        // console.log(artistId)
        const { productId } = req.params;
        const files = req.files;
        // 1. Verify product exists and belongs to this artist
        const existingProduct = await productService.getProductById(productId);
        if (!existingProduct)
            throw new Error("Product not found");
        if (existingProduct.artistId !== artistId)
            throw new Error("Not authorized to update this product");
        // 2. Map uploaded files to image URLs (paths)
        const imageUrls = files?.map((file) => file.path);
        // 3. Merge body with productImages if any
        const updatedData = {
            ...req.body,
            ...(imageUrls?.length ? { productImages: imageUrls } : {}),
        };
        // 4. Update product with updatedData
        const updatedProduct = await productService.updateProduct(productId, artistId, updatedData);
        res.status(200).json(updatedProduct);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.updateProduct = updateProduct;
// Get all products
const getAllProducts = async (req, res) => {
    try {
        const products = await productService.getAllProducts();
        res.status(200).json(products);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getAllProducts = getAllProducts;
// Get product by ID
const getProductById = async (req, res) => {
    try {
        const { productId } = req.params;
        const product = await productService.getProductById(productId);
        res.status(200).json(product);
    }
    catch (error) {
        res.status(404).json({ error: error.message });
    }
};
exports.getProductById = getProductById;
// by artist
const getProductsByArtist = async (req, res) => {
    try {
        const artistId = req.user?.id;
        if (!artistId)
            throw new Error("Unauthorized");
        const products = await productService.getProductsByArtist(artistId);
        res.status(200).json(products);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.getProductsByArtist = getProductsByArtist;
const getProductsByArtistId = async (req, res) => {
    try {
        const { artistId } = req.params;
        if (!artistId)
            throw new Error("Unauthorized");
        const products = await productService.getProductsByArtist(artistId);
        res.status(200).json(products);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.getProductsByArtistId = getProductsByArtistId;
// Delete product
const deleteProduct = async (req, res) => {
    try {
        const artistId = req.user?.id;
        if (!artistId)
            throw new Error("Unauthorized");
        const { productId } = req.params;
        const existingProduct = await productService.getProductById(productId);
        if (!existingProduct)
            throw new Error("Product not found");
        if (existingProduct.artistId !== artistId)
            throw new Error("Not authorized to delete this product");
        await productService.deleteProduct(productId, artistId);
        res.status(200).json({ message: "Product deleted successfully" });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.deleteProduct = deleteProduct;
//# sourceMappingURL=product.controller.js.map