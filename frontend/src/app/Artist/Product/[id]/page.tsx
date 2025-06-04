"use client";

import React, { use, useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { ProductData } from "./components/types";
import ProductHeader from "./components/ProductHeader";
import ProductInformation from "./components/ProductInformation";
import PricingInventory from "./components/PricingInventory";
import ShippingInformation from "./components/ShippingInformation";
import ProductImages from "./components/ProductImages";
import ActivityLog from "./components/ActivityLog";
import DeleteModal from "./components/DeleteModal";
import { ArrowLeft, Package } from "lucide-react";
import {
  useGetProductByIdQuery,
  useUpdateProductMutation,
} from "@/services/api/productApi";

interface Params {
  params: Promise<{
    id: string;
  }>;
}

// Utility to detect if a string is an Object URL (created by URL.createObjectURL)
function isObjectURL(url: string): boolean {
  return url.startsWith("blob:");
}

function ProductPreview({ params }: Params) {
  const { id } = use(params);

  // Fetch product from API
  const { data: product, isLoading, error } = useGetProductByIdQuery(id);

  // Mutation to update product
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  // Local states
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedProduct, setEditedProduct] = useState<ProductData | null>(null);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  // New files selected by user but not yet uploaded
  const [newFiles, setNewFiles] = useState<File[]>([]);

  const formRef = useRef<HTMLDivElement>(null);

  // Initialize edited product & preview images when product loads
  useEffect(() => {
    if (product) {
      setEditedProduct(product);
      setPreviewImages(product.productImages || []);
      setNewFiles([]);
    }
  }, [product]);

  // Show error toast if API fetch fails
  useEffect(() => {
    if (error) {
      toast.error("Failed to load product data");
    }
  }, [error]);

  // Handle input change for edited product fields
  const handleInputChange = (field: string, value: any): void => {
    if (!editedProduct) return;
    setEditedProduct((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        [field]: value,
      };
    });
  };

  // Handle new image upload (file input)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      setNewFiles((prev) => [...prev, ...filesArray]);

      // Create preview URLs for new images and add to previewImages
      const newImageUrls = filesArray.map((file) => URL.createObjectURL(file));
      setPreviewImages((prev) => [...prev, ...newImageUrls]);

      // Also update productImages field with previews for UI consistency
      handleInputChange("productImages", [...previewImages, ...newImageUrls]);

      toast.success(`${filesArray.length} image(s) added successfully`);
    }
  };

  // Remove image from preview and newFiles if applicable
  const removeImage = (index: number): void => {
    const updatedPreviews = [...previewImages];
    const removedUrl = updatedPreviews[index];
    updatedPreviews.splice(index, 1);

    setPreviewImages(updatedPreviews);

    // If the removed image is a new file (object URL), remove corresponding file
    if (isObjectURL(removedUrl)) {
      // Find index in newFiles corresponding to removedUrl
      const newFileIndex = newFiles.findIndex((file) => {
        const fileUrl = URL.createObjectURL(file);
        const isMatch = fileUrl === removedUrl;
        // Clean up the temporary URL
        URL.revokeObjectURL(fileUrl);
        return isMatch;
      });

      if (newFileIndex !== -1) {
        const updatedNewFiles = [...newFiles];
        updatedNewFiles.splice(newFileIndex, 1);
        setNewFiles(updatedNewFiles);
      }

      // Revoke the object URL to free memory
      URL.revokeObjectURL(removedUrl);
    }

    // Update productImages field
    handleInputChange("productImages", updatedPreviews);
    toast.success("Image removed successfully");
  };

  // Prepare data for update mutation, FormData if new files exist else JSON
  const prepareUpdatedData = (): FormData | ProductData | null => {
    if (!editedProduct) return null;

    if (newFiles.length > 0) {
      const formData = new FormData();

      // Append text fields
      formData.append("productName", editedProduct.productName || "");
      formData.append("category", editedProduct.category || "");
      formData.append("shortDescription", editedProduct.shortDescription || "");
      formData.append("sellingPrice", String(editedProduct.sellingPrice || ""));
      formData.append("mrp", String(editedProduct.mrp || ""));
      formData.append(
        "availableStock",
        String(editedProduct.availableStock || "")
      );
      formData.append("skuCode", editedProduct.skuCode || "");
      formData.append("weight", String(editedProduct.weight || ""));
      formData.append("length", String(editedProduct.length || ""));
      formData.append("width", String(editedProduct.width || ""));
      formData.append("height", String(editedProduct.height || ""));
      formData.append("shippingCost", String(editedProduct.shippingCost || ""));
      formData.append(
        "deliveryTimeEstimate",
        editedProduct.deliveryTimeEstimate || ""
      );

      // Append new image files
      newFiles.forEach((file) => {
        formData.append("productImages", file);
      });

      // Append existing images (URLs) as JSON string - those that are NOT object URLs
      const existingImageUrls = previewImages.filter(
        (url) => !isObjectURL(url)
      );
      formData.append("existingImages", JSON.stringify(existingImageUrls));

      return formData;
    } else {
      // No new files, send full JSON update
      return {
        ...editedProduct,
        productImages: previewImages, // updated preview images (all URLs)
      };
    }
  };

  const handleSaveChanges = async (): Promise<void> => {
    if (!editedProduct) {
      toast.error("No product data to save");
      return;
    }

    const updatedData = prepareUpdatedData();
    if (!updatedData) {
      toast.error("Failed to prepare update data");
      return;
    }

    const loadingToast = toast.loading("Updating product...");

    try {
      await updateProduct({ productId: id, updatedData }).unwrap();
      toast.dismiss(loadingToast);
      toast.success("Product updated successfully!");
      setIsEditing(false);
      setNewFiles([]);

      // Clean up any remaining object URLs
      previewImages.forEach((url) => {
        if (isObjectURL(url)) {
          URL.revokeObjectURL(url);
        }
      });
    } catch (err: any) {
      toast.dismiss(loadingToast);
      const errorMessage =
        err?.data?.message || err?.message || "Failed to update product";
      toast.error(errorMessage);
      console.error("Update error:", err);
    }
  };

  const handleDeleteProduct = (): void => {
    const loadingToast = toast.loading("Deleting product...");

    // Simulate deletion - replace with actual API call
    setTimeout(() => {
      toast.dismiss(loadingToast);
      toast.success("Product deleted successfully!");
      setShowDeleteModal(false);
      // Navigate back to products list or handle as needed
    }, 1500);
  };

  // Cleanup object URLs on component unmount
  useEffect(() => {
    return () => {
      previewImages.forEach((url) => {
        if (isObjectURL(url)) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [previewImages]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="aspect-square bg-gray-200"></div>
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
        <div className="container mx-auto px-4 py-6 max-w-7xl text-center">
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
    );
  }

  return (
    <div ref={formRef} className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
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
            <ProductInformation
              product={product}
              editedProduct={editedProduct}
              isEditing={isEditing}
              handleInputChange={handleInputChange}
              categories={[
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
              ]}
            />

            <PricingInventory
              product={product}
              editedProduct={editedProduct}
              isEditing={isEditing}
              handleInputChange={handleInputChange}
            />

            <ShippingInformation
              product={product}
              editedProduct={editedProduct}
              isEditing={isEditing}
              handleInputChange={handleInputChange}
            />

            <ActivityLog product={product} />
          </div>

          {/* Right Column - Product Images */}
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
