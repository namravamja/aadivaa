"use client";

import type { ProductData } from "../page";

interface Step1Props {
  productData: ProductData;
  handleInputChange: (field: string, value: any) => void;
}

export default function Step1ProductBasics({
  productData,
  handleInputChange,
}: Step1Props) {
  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-light text-stone-900 mb-4 sm:mb-6">
        Product Basics
      </h2>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Product Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={productData.productName}
            onChange={(e) => handleInputChange("productName", e.target.value)}
            className="w-full px-4 py-3 border border-stone-300 rounded-md focus:border-sage-500 focus:outline-none focus:ring-1 focus:ring-sage-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            value={productData.category}
            onChange={(e) => handleInputChange("category", e.target.value)}
            className="w-full px-4 py-3 border border-stone-300 rounded-md focus:border-sage-500 focus:outline-none focus:ring-1 focus:ring-sage-500"
            required
          >
            <option value="">Select Category</option>
            <option value="Electronics">Electronics</option>
            <option value="Clothing">Clothing</option>
            <option value="Home & Kitchen">Home & Kitchen</option>
            <option value="Beauty & Personal Care">
              Beauty & Personal Care
            </option>
            <option value="Books">Books</option>
            <option value="Toys & Games">Toys & Games</option>
            <option value="Sports & Outdoors">Sports & Outdoors</option>
            <option value="Health & Wellness">Health & Wellness</option>
            <option value="Jewelry">Jewelry</option>
            <option value="Handmade">Handmade</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Short Description <span className="text-red-500">*</span>
          </label>
          <textarea
            value={productData.shortDescription}
            onChange={(e) =>
              handleInputChange("shortDescription", e.target.value)
            }
            rows={4}
            className="w-full px-4 py-3 border border-stone-300 rounded-md focus:border-sage-500 focus:outline-none focus:ring-1 focus:ring-sage-500"
            required
          />
          <p className="mt-1 text-xs text-stone-500">
            Brief description of your product (100-150 characters recommended)
          </p>
        </div>
      </div>
    </div>
  );
}
