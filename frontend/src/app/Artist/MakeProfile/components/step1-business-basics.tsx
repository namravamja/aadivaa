"use client";

import type React from "react";

import { Upload, X, Plus } from "lucide-react";
import { useState, useRef } from "react";
import toast from "react-hot-toast";

interface ProfileData {
  fullName: string;
  storeName: string;
  email: string;
  mobile: string;
  businessType: string;
  businessRegistrationNumber: string;
  productCategories: string[];
  businessLogo: string;
}

interface Step1Props {
  data: ProfileData;
  updateData: (updates: Partial<ProfileData>) => void;
  addToArray: (field: keyof ProfileData, value: string) => void;
  removeFromArray: (field: keyof ProfileData, index: number) => void;
}

export default function Step1BusinessBasics({
  data,
  updateData,
  addToArray,
  removeFromArray,
}: Step1Props) {
  const [categoryInput, setCategoryInput] = useState("");
  const [uploadedLogo, setUploadedLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    console.log(`Updating ${field} with value:`, value); // Debug log
    updateData({ [field]: value });
  };

  const handleAddCategory = () => {
    if (categoryInput.trim()) {
      addToArray("productCategories", categoryInput.trim());
      setCategoryInput("");
    }
  };

  const handleRemoveCategory = (index: number) => {
    removeFromArray("productCategories", index);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddCategory();
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }

      // Validate file size (2MB limit)
      if (file.size > 2 * 1024 * 1024) {
        toast.error("File size must be less than 2MB");
        return;
      }

      setUploadedLogo(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setLogoPreview(result);
        updateData({ businessLogo: result });
      };
      reader.readAsDataURL(file);

      toast.success(`Logo uploaded: ${file.name}`);
    }
  };

  const removeLogo = () => {
    setUploadedLogo(null);
    setLogoPreview(null);
    updateData({ businessLogo: "" });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    toast.success("Logo removed");
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-light text-stone-900 mb-4 sm:mb-6">
        Seller Account & Business Basics
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Full Name / Business Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={data?.fullName || ""}
            onChange={(e) => handleInputChange("fullName", e.target.value)}
            className="w-full px-4 py-3 border border-stone-300 rounded-md focus:border-terracotta-500 focus:outline-none focus:ring-1 focus:ring-terracotta-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Store Name / Display Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={data?.storeName || ""}
            onChange={(e) => handleInputChange("storeName", e.target.value)}
            className="w-full px-4 py-3 border border-stone-300 rounded-md focus:border-terracotta-500 focus:outline-none focus:ring-1 focus:ring-terracotta-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={data?.email || ""}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className="w-full px-4 py-3 border border-stone-300 rounded-md focus:border-terracotta-500 focus:outline-none focus:ring-1 focus:ring-terracotta-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Mobile Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            value={data?.mobile || ""}
            onChange={(e) => handleInputChange("mobile", e.target.value)}
            className="w-full px-4 py-3 border border-stone-300 rounded-md focus:border-terracotta-500 focus:outline-none focus:ring-1 focus:ring-terracotta-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Business Type <span className="text-red-500">*</span>
          </label>
          <select
            value={data?.businessType || ""}
            onChange={(e) => {
              console.log("Business type selected:", e.target.value); // Debug log
              handleInputChange("businessType", e.target.value);
            }}
            className="w-full px-4 py-3 border border-stone-300 rounded-md focus:border-terracotta-500 focus:outline-none focus:ring-1 focus:ring-terracotta-500"
            required
          >
            <option value="">Select Business Type</option>
            <option value="Individual">Individual</option>
            <option value="Company">Company</option>
            <option value="Partnership">Partnership</option>
            <option value="LLP">LLP</option>
            <option value="Other">Other</option>
          </select>
          {/* Debug display */}
          <div className="text-xs text-gray-500 mt-1">
            Current value: {data?.businessType || "None selected"}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Business Registration Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={data?.businessRegistrationNumber || ""}
            onChange={(e) =>
              handleInputChange("businessRegistrationNumber", e.target.value)
            }
            className="w-full px-4 py-3 border border-stone-300 rounded-md focus:border-terracotta-500 focus:outline-none focus:ring-1 focus:ring-terracotta-500"
            required
          />
        </div>
      </div>

      <div className="mt-4 sm:mt-6">
        <label className="block text-sm font-medium text-stone-700 mb-2">
          Product Categories You Will Sell{" "}
          <span className="text-red-500">*</span>
        </label>
        <div className="flex flex-wrap gap-2 mb-3">
          {Array.isArray(data?.productCategories) &&
            data.productCategories.map((category, index) => (
              <span
                key={index}
                className="bg-terracotta-100 text-terracotta-700 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm flex items-center"
              >
                {category}
                <button
                  onClick={() => handleRemoveCategory(index)}
                  className="ml-1 sm:ml-2 text-terracotta-500 hover:text-terracotta-700"
                  type="button"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-0">
          <input
            type="text"
            placeholder="Add a category"
            value={categoryInput}
            onChange={(e) => setCategoryInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border border-stone-300 rounded-md focus:border-terracotta-500 focus:outline-none focus:ring-1 focus:ring-terracotta-500"
          />
          <button
            onClick={handleAddCategory}
            type="button"
            className="sm:ml-2 bg-terracotta-600 text-white px-4 py-2 sm:py-3 rounded-md hover:bg-terracotta-700 transition-colors"
          >
            <Plus className="w-4 h-4 mx-auto" />
          </button>
        </div>
      </div>

      <div className="mt-4 sm:mt-6">
        <label className="block text-sm font-medium text-stone-700 mb-2">
          Upload Business Logo (optional)
        </label>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleLogoUpload}
          className="hidden"
        />

        {logoPreview ? (
          <div className="mt-2 p-4 border-2 border-dashed border-stone-300 rounded-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <img
                  src={logoPreview || "/placeholder.svg"}
                  alt="Logo preview"
                  className="w-16 h-16 object-cover rounded-md border"
                />
                <div>
                  <p className="text-sm font-medium text-stone-700">
                    {uploadedLogo?.name || "Business Logo"}
                  </p>
                  <p className="text-xs text-stone-500">
                    {uploadedLogo
                      ? `${(uploadedLogo.size / 1024).toFixed(1)} KB`
                      : ""}
                  </p>
                </div>
              </div>
              <button
                onClick={removeLogo}
                className="text-red-500 hover:text-red-700 p-1"
                type="button"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        ) : (
          <div
            onClick={triggerFileUpload}
            className="mt-2 flex justify-center px-4 sm:px-6 pt-4 sm:pt-5 pb-4 sm:pb-6 border-2 border-dashed border-stone-300 rounded-md hover:border-terracotta-400 transition-colors cursor-pointer"
          >
            <div className="space-y-1 sm:space-y-2 text-center">
              <div className="mx-auto h-16 sm:h-20 w-16 sm:w-20 text-stone-400">
                <Upload className="mx-auto h-8 sm:h-12 w-8 sm:w-12" />
              </div>
              <div className="flex flex-col sm:flex-row text-sm text-stone-600 justify-center">
                <span className="font-medium text-terracotta-600 hover:text-terracotta-500">
                  Upload a photo
                </span>
                <p className="sm:pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-stone-500">PNG, JPG, GIF up to 2MB</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
