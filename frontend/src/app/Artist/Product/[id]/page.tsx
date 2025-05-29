"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Package,
  DollarSign,
  Truck,
  Eye,
  Calendar,
  Tag,
  Globe,
  Star,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  X,
  Save,
  Plus,
  Upload,
} from "lucide-react";

// Define the product data type
export interface ProductData {
  id: string;
  // Basic Info
  productName: string;
  category: string;
  brand: string;
  shortDescription: string;
  productType: "Physical" | "Digital";

  // Pricing & Inventory
  sellingPrice: string;
  mrp: string;
  availableStock: string;
  skuCode: string;

  // Images & Media
  productImages: string[];

  // Shipping Details
  weight: string;
  dimensions: {
    length: string;
    width: string;
    height: string;
  };
  shippingCost: string;
  freeShipping: boolean;
  deliveryTimeEstimate: string;

  // Additional Details
  status: "active" | "draft" | "archived";
  sales: number;
  views: number;
  rating: number;
  reviews: number;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  seoTitle?: string;
  seoDescription?: string;
}

// Mock product data
const mockProductDetails: ProductData = {
  id: "1",
  productName: "Handcrafted Beaded Necklace with Turquoise Stones",
  category: "Jewelry",
  brand: "Artisan Crafts",
  shortDescription:
    "Beautiful handcrafted necklace featuring genuine turquoise stones and silver beads. Perfect for both casual and formal occasions.",
  productType: "Physical",
  sellingPrice: "45.99",
  mrp: "65.99",
  availableStock: "12",
  skuCode: "JWL-TRQ-001",
  productImages: [
    "/placeholder.svg?height=400&width=400",
    "/placeholder.svg?height=400&width=400",
    "/placeholder.svg?height=400&width=400",
    "/placeholder.svg?height=400&width=400",
  ],
  weight: "0.15",
  dimensions: {
    length: "45",
    width: "2",
    height: "1",
  },
  shippingCost: "5.99",
  freeShipping: false,
  deliveryTimeEstimate: "3-5 business days",
  status: "active",
  sales: 45,
  views: 1250,
  rating: 4.8,
  reviews: 23,
  createdAt: "2023-04-15",
  updatedAt: "2023-12-10",
  tags: ["handmade", "jewelry", "turquoise", "silver", "artisan"],
  seoTitle: "Handcrafted Turquoise Beaded Necklace - Artisan Jewelry",
  seoDescription:
    "Shop our beautiful handcrafted turquoise beaded necklace. Made with genuine stones and silver beads. Free shipping on orders over $50.",
};

// Available categories and statuses
const categories = [
  "Jewelry",
  "Pottery",
  "Home Decor",
  "Textiles",
  "Accessories",
  "Other",
];
const statuses = ["active", "draft", "archived"];
const productTypes = ["Physical", "Digital"];

export default function ProductViewPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<ProductData | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState<ProductData | null>(null);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");

  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simulate API call
    const fetchProduct = async () => {
      setLoading(true);
      // In real app, fetch product by params.id
      setTimeout(() => {
        setProduct(mockProductDetails);
        setEditedProduct(mockProductDetails);
        setPreviewImages(mockProductDetails.productImages);
        setLoading(false);
      }, 500);
    };

    fetchProduct();
  }, [params.id]);

  const handleDeleteProduct = () => {
    // In real app, make API call to delete product
    console.log("Deleting product:", product?.id);
    router.push("/Artist/Product");
  };

  const handleInputChange = (field: string, value: any) => {
    if (!editedProduct) return;
    setEditedProduct((prev) => ({
      ...prev!,
      [field]: value,
    }));
  };

  const handleNestedInputChange = (
    parent: keyof ProductData,
    field: string,
    value: any
  ) => {
    if (!editedProduct) return;
    setEditedProduct((prev) => ({
      ...prev!,
      [parent]: {
        ...(typeof prev?.[parent] === "object" && prev[parent] !== null
          ? prev[parent]
          : {}),
        [field]: value,
      } as any,
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newImages: string[] = [];

      Array.from(e.target.files).forEach((file) => {
        const imageUrl = URL.createObjectURL(file);
        newImages.push(imageUrl);
      });

      setPreviewImages([...previewImages, ...newImages]);
      // In a real app, you would upload these to a server and get back URLs
      handleInputChange("productImages", [...previewImages, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = [...previewImages];
    updatedImages.splice(index, 1);
    setPreviewImages(updatedImages);
    handleInputChange("productImages", updatedImages);
  };

  const addTag = () => {
    if (newTag.trim() && editedProduct) {
      const updatedTags = [...editedProduct.tags, newTag.trim()];
      handleInputChange("tags", updatedTags);
      setNewTag("");
    }
  };

  const removeTag = (index: number) => {
    if (editedProduct) {
      const updatedTags = [...editedProduct.tags];
      updatedTags.splice(index, 1);
      handleInputChange("tags", updatedTags);
    }
  };

  const handleSaveChanges = () => {
    // In a real app, make API call to update product
    console.log("Saving product changes:", editedProduct);
    setProduct(editedProduct);
    setIsEditing(false);
    // Show success message
    alert("Product updated successfully!");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-sage-100 text-sage-800";
      case "draft":
        return "bg-clay-100 text-clay-800";
      case "archived":
        return "bg-stone-100 text-stone-800";
      default:
        return "bg-stone-100 text-stone-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-4 h-4" />;
      case "draft":
        return <Clock className="w-4 h-4" />;
      case "archived":
        return <X className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl">
          <div className="animate-pulse">
            <div className="h-8 bg-stone-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="aspect-square bg-stone-200 rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-6 bg-stone-200 rounded w-3/4"></div>
                <div className="h-4 bg-stone-200 rounded w-1/2"></div>
                <div className="h-8 bg-stone-200 rounded w-1/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product || !editedProduct) {
    return (
      <div className="min-h-screen bg-stone-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl">
          <div className="text-center py-16">
            <Package className="w-16 h-16 text-stone-300 mx-auto mb-4" />
            <h2 className="text-xl font-medium text-stone-900 mb-2">
              Product not found
            </h2>
            <p className="text-stone-600 mb-6">
              The product you're looking for doesn't exist.
            </p>
            <Link
              href="/Artist/Product"
              className="inline-flex items-center px-6 py-3 bg-terracotta-600 text-white rounded-lg hover:bg-terracotta-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={formRef} className="min-h-screen bg-stone-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl">
        {/* Header */}

        <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link
                href="/Artist/Product"
                className="inline-flex items-center justify-center text-terracotta-600 hover:text-terracotta-700 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                <span className="hidden sm:inline">Back to Products</span>
                <span className="sm:hidden">Back</span>
              </Link>
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-light text-stone-900 mb-1">
                  {isEditing ? "Edit Product" : "Product Details"}
                </h1>
                <p className="text-sm text-stone-600">ID: {product.id}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:justify-end">
              {isEditing ? (
                <>
                  <button
                    onClick={() => {
                      setEditedProduct(product);
                      setPreviewImages(product.productImages);
                      setIsEditing(false);
                    }}
                    className="flex-1 sm:flex-initial px-4 py-2 border border-stone-300 text-stone-700 rounded-lg hover:bg-stone-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveChanges}
                    className="flex-1 sm:flex-initial px-4 py-2 bg-terracotta-600 text-white rounded-lg hover:bg-terracotta-700 transition-colors flex items-center justify-center"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex-1 sm:flex-initial px-4 py-2 bg-terracotta-600 text-white rounded-lg hover:bg-terracotta-700 transition-colors flex items-center justify-center"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Product
                  </button>
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Delete</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column - Images and Basic Info */}
          <div className="xl:col-span-2 space-y-6">
            {/* Product Images */}
            <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-4 sm:p-6">
              <h3 className="text-lg font-medium text-stone-900 mb-4 flex items-center">
                <Package className="w-5 h-5 mr-2 text-terracotta-600" />
                Product Images
              </h3>

              {isEditing ? (
                <div className="space-y-4">
                  <div className="aspect-square relative bg-stone-100 rounded-lg overflow-hidden">
                    {previewImages.length > 0 ? (
                      <Image
                        src={
                          previewImages[selectedImageIndex] ||
                          "/placeholder.svg"
                        }
                        alt={editedProduct.productName}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-stone-400">
                        <div className="text-center">
                          <Package className="w-16 h-16 mx-auto mb-2" />
                          <p>No image</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                    {previewImages.map((image, index) => (
                      <div key={index} className="relative group">
                        <button
                          onClick={() => setSelectedImageIndex(index)}
                          className={`aspect-square relative bg-stone-100 rounded-lg overflow-hidden border-2 transition-colors w-full ${
                            selectedImageIndex === index
                              ? "border-terracotta-500"
                              : "border-transparent hover:border-stone-300"
                          }`}
                        >
                          <Image
                            src={image || "/placeholder.svg"}
                            alt={`Product image ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </button>
                        <button
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}

                    <div className="aspect-square w-full border-2 border-dashed border-stone-300 rounded-lg flex items-center justify-center hover:border-terracotta-400 transition-colors">
                      <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center">
                        <Upload className="w-6 h-6 text-stone-400 mb-1" />
                        <span className="text-xs text-stone-600 text-center">
                          Add Image
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={handleImageUpload}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="aspect-square relative bg-stone-100 rounded-lg overflow-hidden">
                    <Image
                      src={
                        product.productImages[selectedImageIndex] ||
                        "/placeholder.svg"
                      }
                      alt={product.productName}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {product.productImages.length > 1 && (
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                      {product.productImages.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImageIndex(index)}
                          className={`aspect-square relative bg-stone-100 rounded-lg overflow-hidden border-2 transition-colors ${
                            selectedImageIndex === index
                              ? "border-terracotta-500"
                              : "border-transparent hover:border-stone-300"
                          }`}
                        >
                          <Image
                            src={image || "/placeholder.svg"}
                            alt={`Product image ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Product Information */}
            <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-4 sm:p-6">
              <h3 className="text-lg font-medium text-stone-900 mb-4 flex items-center">
                <Tag className="w-5 h-5 mr-2 text-terracotta-600" />
                Product Information
              </h3>

              <div className="space-y-6">
                {/* Product Name and Status */}
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  {isEditing ? (
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-stone-700 mb-2">
                        Product Name
                      </label>
                      <input
                        type="text"
                        value={editedProduct.productName}
                        onChange={(e) =>
                          handleInputChange("productName", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:border-terracotta-500 focus:outline-none focus:ring-1 focus:ring-terracotta-500"
                      />
                    </div>
                  ) : (
                    <div className="flex-1">
                      <h2 className="text-xl sm:text-2xl font-medium text-stone-900 mb-2">
                        {product.productName}
                      </h2>
                    </div>
                  )}

                  {isEditing ? (
                    <div className="lg:w-48">
                      <label className="block text-sm font-medium text-stone-700 mb-2">
                        Status
                      </label>
                      <select
                        value={editedProduct.status}
                        onChange={(e) =>
                          handleInputChange("status", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:border-terracotta-500 focus:outline-none focus:ring-1 focus:ring-terracotta-500"
                      >
                        {statuses.map((status) => (
                          <option key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div
                      className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium ${getStatusColor(
                        product.status
                      )}`}
                    >
                      {getStatusIcon(product.status)}
                      <span className="ml-2 capitalize">{product.status}</span>
                    </div>
                  )}
                </div>

                {/* Category, Brand, Type */}
                {isEditing ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-2">
                        Category
                      </label>
                      <select
                        value={editedProduct.category}
                        onChange={(e) =>
                          handleInputChange("category", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:border-terracotta-500 focus:outline-none focus:ring-1 focus:ring-terracotta-500"
                      >
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-2">
                        Brand
                      </label>
                      <input
                        type="text"
                        value={editedProduct.brand}
                        onChange={(e) =>
                          handleInputChange("brand", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:border-terracotta-500 focus:outline-none focus:ring-1 focus:ring-terracotta-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-2">
                        Product Type
                      </label>
                      <div className="flex space-x-4 pt-3">
                        {productTypes.map((type) => (
                          <label
                            key={type}
                            className="inline-flex items-center"
                          >
                            <input
                              type="radio"
                              name="productType"
                              value={type}
                              checked={editedProduct.productType === type}
                              onChange={(e) =>
                                handleInputChange("productType", e.target.value)
                              }
                              className="h-4 w-4 text-terracotta-600 focus:ring-terracotta-500 border-stone-300"
                            />
                            <span className="ml-2 text-sm text-stone-700">
                              {type}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap items-center gap-6 text-sm text-stone-600">
                    <span className="flex items-center">
                      <Tag className="w-4 h-4 mr-2" />
                      {product.category}
                    </span>
                    {product.brand && (
                      <span className="flex items-center">
                        <Package className="w-4 h-4 mr-2" />
                        {product.brand}
                      </span>
                    )}
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      Created {new Date(product.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                )}

                {/* Description */}
                <div>
                  {isEditing ? (
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-2">
                        Description
                      </label>
                      <textarea
                        value={editedProduct.shortDescription}
                        onChange={(e) =>
                          handleInputChange("shortDescription", e.target.value)
                        }
                        rows={4}
                        className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:border-terracotta-500 focus:outline-none focus:ring-1 focus:ring-terracotta-500"
                      />
                    </div>
                  ) : (
                    <div>
                      <h4 className="text-sm font-medium text-stone-700 mb-2">
                        Description
                      </h4>
                      <p className="text-stone-700 leading-relaxed">
                        {product.shortDescription}
                      </p>
                    </div>
                  )}
                </div>

                {/* Tags */}
                <div>
                  {isEditing ? (
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-2">
                        Tags
                      </label>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {editedProduct.tags.map((tag, index) => (
                          <div
                            key={index}
                            className="px-3 py-1 bg-stone-100 text-stone-700 rounded-full text-sm flex items-center"
                          >
                            #{tag}
                            <button
                              type="button"
                              onClick={() => removeTag(index)}
                              className="ml-2 text-stone-500 hover:text-stone-700"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="flex">
                        <input
                          type="text"
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          placeholder="Add a tag"
                          className="flex-1 px-4 py-3 border border-stone-300 rounded-l-lg focus:outline-none focus:ring-1 focus:ring-terracotta-500"
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addTag();
                            }
                          }}
                        />
                        <button
                          type="button"
                          onClick={addTag}
                          className="bg-terracotta-600 text-white px-4 py-3 rounded-r-lg hover:bg-terracotta-700 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    product.tags.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-stone-700 mb-2">
                          Tags
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {product.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-stone-100 text-stone-700 rounded-full text-sm"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Pricing, Metrics, and Details */}
          <div className="space-y-6">
            {/* Pricing */}
            <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-4 sm:p-6">
              <h3 className="text-lg font-medium text-stone-900 mb-4 flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-terracotta-600" />
                Pricing & Inventory
              </h3>
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      Selling Price
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-stone-500 text-sm">$</span>
                      </div>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={editedProduct.sellingPrice}
                        onChange={(e) =>
                          handleInputChange("sellingPrice", e.target.value)
                        }
                        className="w-full pl-8 pr-4 py-3 border border-stone-300 rounded-lg focus:border-terracotta-500 focus:outline-none focus:ring-1 focus:ring-terracotta-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      MRP / Original Price
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-stone-500 text-sm">$</span>
                      </div>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={editedProduct.mrp}
                        onChange={(e) =>
                          handleInputChange("mrp", e.target.value)
                        }
                        className="w-full pl-8 pr-4 py-3 border border-stone-300 rounded-lg focus:border-terracotta-500 focus:outline-none focus:ring-1 focus:ring-terracotta-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      SKU Code
                    </label>
                    <input
                      type="text"
                      value={editedProduct.skuCode}
                      onChange={(e) =>
                        handleInputChange("skuCode", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:border-terracotta-500 focus:outline-none focus:ring-1 focus:ring-terracotta-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      Available Stock
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={editedProduct.availableStock}
                      onChange={(e) =>
                        handleInputChange("availableStock", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:border-terracotta-500 focus:outline-none focus:ring-1 focus:ring-terracotta-500"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-center py-4 border-b border-stone-100">
                    <p className="text-3xl font-bold text-terracotta-700 mb-1">
                      ${Number.parseFloat(product.sellingPrice).toFixed(2)}
                    </p>
                    <p className="text-lg text-stone-500 line-through">
                      ${Number.parseFloat(product.mrp).toFixed(2)}
                    </p>
                    <p className="text-sm text-sage-700 font-medium">
                      {Math.round(
                        ((Number.parseFloat(product.mrp) -
                          Number.parseFloat(product.sellingPrice)) /
                          Number.parseFloat(product.mrp)) *
                          100
                      )}
                      % off
                    </p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-stone-600">SKU</span>
                      <span className="font-medium text-stone-900">
                        {product.skuCode}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-stone-600">Stock</span>
                      <span
                        className={`font-medium ${
                          Number.parseInt(product.availableStock) < 10
                            ? "text-red-600"
                            : "text-stone-900"
                        }`}
                      >
                        {product.availableStock} units
                      </span>
                    </div>
                  </div>
                  {Number.parseInt(product.availableStock) < 10 && (
                    <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg">
                      <AlertTriangle className="w-5 h-5 text-red-600 mr-2 flex-shrink-0" />
                      <span className="text-sm text-red-700">
                        Low stock alert
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Performance Metrics */}
            {!isEditing && (
              <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-4 sm:p-6">
                <h3 className="text-lg font-medium text-stone-900 mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-terracotta-600" />
                  Performance
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-stone-50 rounded-lg">
                    <div className="flex items-center justify-center mb-2">
                      <TrendingUp className="w-5 h-5 text-sage-600" />
                    </div>
                    <p className="text-2xl font-bold text-stone-900">
                      {product.sales}
                    </p>
                    <p className="text-sm text-stone-600">Sales</p>
                  </div>
                  <div className="text-center p-4 bg-stone-50 rounded-lg">
                    <div className="flex items-center justify-center mb-2">
                      <Eye className="w-5 h-5 text-terracotta-600" />
                    </div>
                    <p className="text-2xl font-bold text-stone-900">
                      {product.views}
                    </p>
                    <p className="text-sm text-stone-600">Views</p>
                  </div>
                  <div className="text-center p-4 bg-stone-50 rounded-lg">
                    <div className="flex items-center justify-center mb-2">
                      <Star className="w-5 h-5 text-clay-600" />
                    </div>
                    <p className="text-2xl font-bold text-stone-900">
                      {product.rating}
                    </p>
                    <p className="text-sm text-stone-600">Rating</p>
                  </div>
                  <div className="text-center p-4 bg-stone-50 rounded-lg">
                    <div className="flex items-center justify-center mb-2">
                      <Calendar className="w-5 h-5 text-stone-600" />
                    </div>
                    <p className="text-2xl font-bold text-stone-900">
                      {product.reviews}
                    </p>
                    <p className="text-sm text-stone-600">Reviews</p>
                  </div>
                </div>
              </div>
            )}

            {/* Shipping Information */}
            <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-4 sm:p-6">
              <h3 className="text-lg font-medium text-stone-900 mb-4 flex items-center">
                <Truck className="w-5 h-5 mr-2 text-terracotta-600" />
                Shipping
              </h3>
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={editedProduct.weight}
                      onChange={(e) =>
                        handleInputChange("weight", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:border-terracotta-500 focus:outline-none focus:ring-1 focus:ring-terracotta-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      Dimensions (cm)
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="number"
                        min="0"
                        step="0.1"
                        value={editedProduct.dimensions.length}
                        onChange={(e) =>
                          handleNestedInputChange(
                            "dimensions",
                            "length",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-3 border border-stone-300 rounded-lg focus:border-terracotta-500 focus:outline-none focus:ring-1 focus:ring-terracotta-500"
                        placeholder="L"
                      />
                      <input
                        type="number"
                        min="0"
                        step="0.1"
                        value={editedProduct.dimensions.width}
                        onChange={(e) =>
                          handleNestedInputChange(
                            "dimensions",
                            "width",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-3 border border-stone-300 rounded-lg focus:border-terracotta-500 focus:outline-none focus:ring-1 focus:ring-terracotta-500"
                        placeholder="W"
                      />
                      <input
                        type="number"
                        min="0"
                        step="0.1"
                        value={editedProduct.dimensions.height}
                        onChange={(e) =>
                          handleNestedInputChange(
                            "dimensions",
                            "height",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-3 border border-stone-300 rounded-lg focus:border-terracotta-500 focus:outline-none focus:ring-1 focus:ring-terracotta-500"
                        placeholder="H"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-stone-700">
                        Shipping Cost
                      </label>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="freeShipping"
                          checked={editedProduct.freeShipping}
                          onChange={(e) =>
                            handleInputChange("freeShipping", e.target.checked)
                          }
                          className="h-4 w-4 text-terracotta-600 focus:ring-terracotta-500 border-stone-300 rounded"
                        />
                        <label
                          htmlFor="freeShipping"
                          className="ml-2 text-sm text-stone-700"
                        >
                          Free Shipping
                        </label>
                      </div>
                    </div>

                    {!editedProduct.freeShipping && (
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-stone-500 text-sm">$</span>
                        </div>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={editedProduct.shippingCost}
                          onChange={(e) =>
                            handleInputChange("shippingCost", e.target.value)
                          }
                          className="w-full pl-8 pr-4 py-3 border border-stone-300 rounded-lg focus:border-terracotta-500 focus:outline-none focus:ring-1 focus:ring-terracotta-500"
                        />
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      Delivery Time
                    </label>
                    <input
                      type="text"
                      value={editedProduct.deliveryTimeEstimate}
                      onChange={(e) =>
                        handleInputChange(
                          "deliveryTimeEstimate",
                          e.target.value
                        )
                      }
                      className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:border-terracotta-500 focus:outline-none focus:ring-1 focus:ring-terracotta-500"
                      placeholder="e.g., 3-5 business days"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-stone-600">Weight</span>
                    <span className="font-medium text-stone-900">
                      {product.weight} kg
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-stone-600">Dimensions</span>
                    <span className="font-medium text-stone-900">
                      {product.dimensions.length} × {product.dimensions.width} ×{" "}
                      {product.dimensions.height} cm
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-stone-600">Shipping</span>
                    <span className="font-medium text-stone-900">
                      {product.freeShipping
                        ? "Free"
                        : `$${Number.parseFloat(product.shippingCost).toFixed(
                            2
                          )}`}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-stone-600">Delivery</span>
                    <span className="font-medium text-stone-900">
                      {product.deliveryTimeEstimate}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* SEO Information */}
            <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-4 sm:p-6">
              <h3 className="text-lg font-medium text-stone-900 mb-4 flex items-center">
                <Globe className="w-5 h-5 mr-2 text-terracotta-600" />
                SEO
              </h3>
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      SEO Title
                    </label>
                    <input
                      type="text"
                      value={editedProduct.seoTitle || ""}
                      onChange={(e) =>
                        handleInputChange("seoTitle", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:border-terracotta-500 focus:outline-none focus:ring-1 focus:ring-terracotta-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      SEO Description
                    </label>
                    <textarea
                      value={editedProduct.seoDescription || ""}
                      onChange={(e) =>
                        handleInputChange("seoDescription", e.target.value)
                      }
                      rows={3}
                      className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:border-terracotta-500 focus:outline-none focus:ring-1 focus:ring-terracotta-500"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {product.seoTitle ? (
                    <div>
                      <span className="text-sm font-medium text-stone-600 block mb-1">
                        Title
                      </span>
                      <p className="text-stone-900 text-sm">
                        {product.seoTitle}
                      </p>
                    </div>
                  ) : null}
                  {product.seoDescription ? (
                    <div>
                      <span className="text-sm font-medium text-stone-600 block mb-1">
                        Description
                      </span>
                      <p className="text-stone-900 text-sm">
                        {product.seoDescription}
                      </p>
                    </div>
                  ) : null}
                  {!product.seoTitle && !product.seoDescription && (
                    <p className="text-stone-500 italic text-sm">
                      No SEO information provided
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Activity Log */}
            {!isEditing && (
              <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-4 sm:p-6">
                <h3 className="text-lg font-medium text-stone-900 mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-terracotta-600" />
                  Activity
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-stone-600">Created</span>
                    <span className="font-medium text-stone-900 text-sm">
                      {new Date(product.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-stone-600">Updated</span>
                    <span className="font-medium text-stone-900 text-sm">
                      {new Date(product.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-stone-600">Reviews</span>
                    <span className="font-medium text-stone-900 text-sm">
                      {product.reviews}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-medium text-stone-900 mb-4">
                Delete Product
              </h3>
              <p className="text-stone-600 mb-6">
                Are you sure you want to delete "{product.productName}"? This
                action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2 border border-stone-300 text-stone-700 rounded-lg hover:bg-stone-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteProduct}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
