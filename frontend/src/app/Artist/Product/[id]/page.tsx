"use client";

import React, { useState, useEffect, useRef } from "react";
import { ProductData } from "./components/types";
import ProductHeader from "./components/ProductHeader";
import ProductInformation from "./components/ProductInformation";
import PricingInventory from "./components/PricingInventory";
import ShippingInformation from "./components/ShippingInformation";
import ProductImages from "./components/ProductImages";
import ActivityLog from "./components/ActivityLog";
import DeleteModal from "./components/DeleteModal";
import { ArrowLeft, Package } from "lucide-react";

interface Params {
  params: {
    id: string;
  };
}

// Mock product data
const mockProductDetails: ProductData = {
  id: "1",
  productName: "Handcrafted Beaded Necklace with Turquoise Stones",
  category: "Jewelry",
  shortDescription:
    "Beautiful handcrafted necklace featuring genuine turquoise stones and silver beads. Perfect for both casual and formal occasions.",
  sellingPrice: "45.99",
  mrp: "65.99",
  availableStock: "12",
  skuCode: "JWL-TRQ-001",
  productImages: [
    "/Profile.jpg",
    "/Profile.jpg",
    "/Profile.jpg",
    "/Profile.jpg",
  ],
  weight: "0.15",
  length: "45",
  width: "2",
  height: "1",
  shippingCost: "5.99",
  deliveryTimeEstimate: "3-5 business days",
  createdAt: "2023-04-15",
  updatedAt: "2023-12-10",
};

// Available categories
const categories = [
  "Electronics",
  "Clothing",
  "Home & Kitchen",
  "Beauty & Personal Care",
  "Books",
  "Toys & Games",
  "Sports & Outdoors",
  "Health & Wellness",
  "Jewelry",
  "Handmade",
  "other",
];

function ProductPreview({ params }: Params) {
  const [product, setProduct] = useState<ProductData | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState<ProductData | null>(null);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simulate API call
    const fetchProduct = async () => {
      setLoading(true);
      // In real app, fetch product by id
      setTimeout(() => {
        setProduct(mockProductDetails);
        setEditedProduct(mockProductDetails);
        setPreviewImages(mockProductDetails.productImages);
        setLoading(false);
      }, 500);
    };

    fetchProduct();
  }, []);

  const handleDeleteProduct = () => {
    // In real app, make API call to delete product
    console.log("Deleting product:", product?.id);
    alert("Product deleted successfully!");
    // In a real app, you would redirect to products page
  };

  const handleInputChange = (field: string, value: any) => {
    if (!editedProduct) return;
    setEditedProduct((prev) => ({
      ...prev!,
      [field]: value,
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

  const handleSaveChanges = () => {
    // In a real app, make API call to update product
    console.log("Saving product changes:", editedProduct);
    setProduct(editedProduct);
    setIsEditing(false);
    // Show success message
    alert("Product updated successfully!");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="aspect-square bg-gray-200 "></div>
              <div className="space-y-4">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product || !editedProduct) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl">
          <div className="text-center py-16">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-medium text-gray-900 mb-2">
              Product not found
            </h2>
            <p className="text-gray-600 mb-6">
              The product you're looking for doesn't exist.
            </p>
            <button className="inline-flex items-center px-6 py-3 bg-terracotta-600 text-white hover:bg-terracotta-700 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={formRef} className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl">
        {/* Header */}
        <ProductHeader
          product={product}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          editedProduct={editedProduct}
          setEditedProduct={setEditedProduct}
          setShowDeleteModal={setShowDeleteModal}
          handleSaveChanges={handleSaveChanges}
        />

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column - Product Information and other sections */}
          <div className="xl:col-span-2 space-y-6">
            {/* Product Information */}
            <ProductInformation
              product={product}
              editedProduct={editedProduct}
              isEditing={isEditing}
              handleInputChange={handleInputChange}
              categories={categories}
            />

            {/* Pricing & Inventory */}
            <PricingInventory
              product={product}
              editedProduct={editedProduct}
              isEditing={isEditing}
              handleInputChange={handleInputChange}
            />

            {/* Shipping Information */}
            <ShippingInformation
              product={product}
              editedProduct={editedProduct}
              isEditing={isEditing}
              handleInputChange={handleInputChange}
            />

            {/* Activity Log */}
            <ActivityLog product={product} />
          </div>

          {/* Right Column - Only Product Images */}
          <div className="xl:col-span-1">
            <ProductImages
              product={product}
              editedProduct={editedProduct}
              isEditing={isEditing}
              selectedImageIndex={selectedImageIndex}
              setSelectedImageIndex={setSelectedImageIndex}
              previewImages={previewImages}
              handleImageUpload={handleImageUpload}
              removeImage={removeImage}
            />
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        <DeleteModal
          product={product}
          showDeleteModal={showDeleteModal}
          setShowDeleteModal={setShowDeleteModal}
          handleDeleteProduct={handleDeleteProduct}
        />
      </div>
    </div>
  );
}

export default ProductPreview;
