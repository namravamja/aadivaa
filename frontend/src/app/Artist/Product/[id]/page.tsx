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
  useDeleteProductMutation,
} from "@/services/api/productApi";
import { useRouter } from "next/navigation";

interface Params {
  params: Promise<{
    id: string;
  }>;
}

function isObjectURL(url: string): boolean {
  return url.startsWith("blob:");
}

function ProductPreview({ params }: Params) {
  const { id } = use(params);

  const {
    data: product,
    isLoading,
    error,
    refetch,
  } = useGetProductByIdQuery(id, {
    refetchOnMountOrArgChange: true,
  });

  const [deleteProduct] = useDeleteProductMutation();

  const router = useRouter();

  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedProduct, setEditedProduct] = useState<ProductData | null>(null);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);

  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (product) {
      setEditedProduct(product);
      setPreviewImages(product.productImages || []);
      setNewFiles([]);
    }
  }, [product]);

  useEffect(() => {
    if (error) {
      toast.error("Failed to load product data");
    }
  }, [error]);

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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      setNewFiles((prev) => [...prev, ...filesArray]);

      const newImageUrls = filesArray.map((file) => URL.createObjectURL(file));
      setPreviewImages((prev) => [...prev, ...newImageUrls]);

      handleInputChange("productImages", [...previewImages, ...newImageUrls]);

      toast.success(`${filesArray.length} image(s) added successfully`);

      refetch();
    }
  };

  const removeImage = (index: number): void => {
    const updatedPreviews = [...previewImages];
    const removedUrl = updatedPreviews[index];
    updatedPreviews.splice(index, 1);

    setPreviewImages(updatedPreviews);

    if (isObjectURL(removedUrl)) {
      const newFileIndex = newFiles.findIndex((file) => {
        const fileUrl = URL.createObjectURL(file);
        const isMatch = fileUrl === removedUrl;
        URL.revokeObjectURL(fileUrl);
        return isMatch;
      });

      if (newFileIndex !== -1) {
        const updatedNewFiles = [...newFiles];
        updatedNewFiles.splice(newFileIndex, 1);
        setNewFiles(updatedNewFiles);
      }

      URL.revokeObjectURL(removedUrl);
    }

    refetch();

    handleInputChange("productImages", updatedPreviews);
    toast.success("Image removed successfully");
  };

  // Convert a file to Base64 string
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result && typeof reader.result === "string") {
          resolve(reader.result);
        } else {
          reject("Failed to convert file to base64");
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Convert image URL to base64 (fetch and read as blob)
  const urlToBase64 = async (url: string): Promise<string> => {
    const response = await fetch(url);
    const blob = await response.blob();
    return await fileToBase64(
      new File([blob], "image.jpg", { type: blob.type })
    );
  };

  // Prepare final data with Base64 images
  const prepareUpdatedData = async (): Promise<ProductData | null> => {
    if (!editedProduct) return null;

    const base64Images: string[] = [];

    // Convert new files to Base64
    for (const file of newFiles) {
      const base64 = await fileToBase64(file);
      base64Images.push(base64);
    }

    // Convert existing URLs to Base64 (excluding object URLs)
    for (const url of previewImages) {
      if (!isObjectURL(url)) {
        const base64 = await urlToBase64(url);
        base64Images.push(base64);
      }
    }

    return {
      ...editedProduct,
      productImages: base64Images,
    };
  };

  const handleSaveChanges = async (): Promise<void> => {
    if (!editedProduct) {
      toast.error("No product data to save");
      return;
    }

    const loadingToast = toast.loading("Updating product...");

    try {
      const updatedData = await prepareUpdatedData();
      if (!updatedData) {
        toast.dismiss(loadingToast);
        toast.error("Failed to prepare update data");
        return;
      }

      await updateProduct({ productId: id, updatedData }).unwrap();

      toast.dismiss(loadingToast);
      toast.success("Product updated successfully!");

      setIsEditing(false);
      setNewFiles([]);

      previewImages.forEach((url) => {
        if (isObjectURL(url)) {
          URL.revokeObjectURL(url);
        }
      });

      await refetch(); // ✅ Properly refetch after update completes
    } catch (err: any) {
      toast.dismiss(loadingToast);
      const errorMessage =
        err?.data?.message || err?.message || "Failed to update product";
      toast.error(errorMessage);
      console.error("Update error:", err);
    }
  };

  const handleDeleteProduct = async () => {
    const loadingToast = toast.loading("Deleting product...");

    try {
      await deleteProduct(id).unwrap();

      toast.dismiss(loadingToast);
      toast.success("Product deleted successfully!");

      setShowDeleteModal(false);

      refetch();

      // Redirect to product list or dashboard
      router.push("/Artist/Product"); // 👈 change the path as per your app structure
    } catch (err: any) {
      toast.dismiss(loadingToast);
      const errorMessage =
        err?.data?.message || err?.error || "Failed to delete product";
      toast.error(errorMessage);
      console.error("Delete error:", err);
    }
  };
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
          <button className="inline-flex cursor-pointer items-center px-6 py-3 bg-terracotta-600 text-white hover:bg-terracotta-700 transition-colors">
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
        <ProductHeader
          product={product}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          editedProduct={editedProduct}
          setEditedProduct={setEditedProduct}
          setShowDeleteModal={setShowDeleteModal}
          handleSaveChanges={handleSaveChanges}
        />

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
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
