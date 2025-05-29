"use client";

import type React from "react";

import { useState } from "react";
import { Upload, X } from "lucide-react";
import Image from "next/image";
import type { ProductData } from "../page";

interface Step3Props {
  productData: ProductData;
  handleInputChange: (field: string, value: any) => void;
  handleNestedInputChange: (
    parent: keyof ProductData,
    field: string,
    value: any
  ) => void;
}

export default function Step3ImagesShipping({
  productData,
  handleInputChange,
  handleNestedInputChange,
}: Step3Props) {
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newImages: string[] = [];

      Array.from(e.target.files).forEach((file) => {
        const imageUrl = URL.createObjectURL(file);
        newImages.push(imageUrl);
      });

      setPreviewImages([...previewImages, ...newImages]);
      // In a real app, you would upload these to a server and get back URLs
      handleInputChange("productImages", [
        ...productData.productImages,
        ...newImages,
      ]);
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = [...previewImages];
    updatedImages.splice(index, 1);
    setPreviewImages(updatedImages);

    const updatedProductImages = [...productData.productImages];
    updatedProductImages.splice(index, 1);
    handleInputChange("productImages", updatedProductImages);
  };

  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-light text-stone-900 mb-4 sm:mb-6">
        Images & Shipping
      </h2>

      <div className="space-y-8">
        {/* Product Images */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Product Images <span className="text-red-500">*</span>
          </label>
          <p className="text-xs text-stone-500 mb-4">
            Upload at least one image of your product. First image will be used
            as the featured image.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
            {previewImages.map((image, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square w-full overflow-hidden rounded-md border border-stone-200">
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`Product image ${index + 1}`}
                    width={200}
                    height={200}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
                {index === 0 && (
                  <span className="absolute top-2 left-2 bg-sage-600 text-white text-xs px-2 py-1 rounded">
                    Featured
                  </span>
                )}
              </div>
            ))}

            <div className="aspect-square w-full border-2 border-dashed border-stone-300 rounded-md flex items-center justify-center">
              <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center">
                <Upload className="w-8 h-8 text-stone-400 mb-2" />
                <span className="text-sm text-stone-600">Add Image</span>
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

        {/* Shipping Details */}
        <div>
          <h3 className="text-lg font-medium text-stone-900 mb-4">
            Shipping Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Product Weight <span className="text-red-500">*</span>
              </label>
              <div className="flex">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={productData.weight}
                  onChange={(e) => handleInputChange("weight", e.target.value)}
                  className="w-full px-4 py-3 border border-stone-300 rounded-l-md focus:border-sage-500 focus:outline-none focus:ring-1 focus:ring-sage-500"
                  required
                />
                <span className="inline-flex items-center px-3 py-3 border border-l-0 border-stone-300 bg-stone-50 text-stone-500 text-sm rounded-r-md">
                  kg
                </span>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Dimensions (L × W × H) <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                <div className="flex">
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={productData.dimensions.length}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "dimensions",
                        "length",
                        e.target.value
                      )
                    }
                    className="w-full px-4 py-3 border border-stone-300 rounded-l-md focus:border-sage-500 focus:outline-none focus:ring-1 focus:ring-sage-500"
                    placeholder="Length"
                    required
                  />
                  <span className="inline-flex items-center px-3 py-3 border border-l-0 border-stone-300 bg-stone-50 text-stone-500 text-sm rounded-r-md">
                    cm
                  </span>
                </div>
                <div className="flex">
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={productData.dimensions.width}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "dimensions",
                        "width",
                        e.target.value
                      )
                    }
                    className="w-full px-4 py-3 border border-stone-300 rounded-l-md focus:border-sage-500 focus:outline-none focus:ring-1 focus:ring-sage-500"
                    placeholder="Width"
                    required
                  />
                  <span className="inline-flex items-center px-3 py-3 border border-l-0 border-stone-300 bg-stone-50 text-stone-500 text-sm rounded-r-md">
                    cm
                  </span>
                </div>
                <div className="flex">
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={productData.dimensions.height}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "dimensions",
                        "height",
                        e.target.value
                      )
                    }
                    className="w-full px-4 py-3 border border-stone-300 rounded-l-md focus:border-sage-500 focus:outline-none focus:ring-1 focus:ring-sage-500"
                    placeholder="Height"
                    required
                  />
                  <span className="inline-flex items-center px-3 py-3 border border-l-0 border-stone-300 bg-stone-50 text-stone-500 text-sm rounded-r-md">
                    cm
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-stone-700">
                  Shipping Cost
                </label>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="freeShipping"
                    checked={productData.freeShipping}
                    onChange={(e) =>
                      handleInputChange("freeShipping", e.target.checked)
                    }
                    className="h-4 w-4 text-sage-600 focus:ring-sage-500 border-stone-300 rounded"
                  />
                  <label
                    htmlFor="freeShipping"
                    className="ml-2 text-sm text-stone-700"
                  >
                    Free Shipping
                  </label>
                </div>
              </div>

              {!productData.freeShipping && (
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-stone-500 sm:text-sm">₹</span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={productData.shippingCost}
                    onChange={(e) =>
                      handleInputChange("shippingCost", e.target.value)
                    }
                    className="w-full pl-7 pr-4 py-3 border border-stone-300 rounded-md focus:border-sage-500 focus:outline-none focus:ring-1 focus:ring-sage-500"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Delivery Time Estimate <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={productData.deliveryTimeEstimate}
                onChange={(e) =>
                  handleInputChange("deliveryTimeEstimate", e.target.value)
                }
                className="w-full px-4 py-3 border border-stone-300 rounded-md focus:border-sage-500 focus:outline-none focus:ring-1 focus:ring-sage-500"
                placeholder="e.g., 3-5 business days"
                required
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
