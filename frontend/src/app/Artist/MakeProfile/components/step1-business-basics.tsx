"use client";

import { Upload, X, Plus } from "lucide-react";
import type { ProfileData } from "../page";

interface Step1Props {
  profileData: ProfileData;
  handleInputChange: (field: string, value: any) => void;
  handleArrayAdd: (field: keyof ProfileData, value: string) => void;
  handleArrayRemove: (field: keyof ProfileData, index: number) => void;
}

export default function Step1BusinessBasics({
  profileData,
  handleInputChange,
  handleArrayAdd,
  handleArrayRemove,
}: Step1Props) {
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
            value={profileData.fullName}
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
            value={profileData.storeName}
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
            value={profileData.email}
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
            value={profileData.mobile}
            onChange={(e) => handleInputChange("mobile", e.target.value)}
            className="w-full px-4 py-3 border border-stone-300 rounded-md focus:border-terracotta-500 focus:outline-none focus:ring-1 focus:ring-terracotta-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Create Password <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            value={profileData.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
            className="w-full px-4 py-3 border border-stone-300 rounded-md focus:border-terracotta-500 focus:outline-none focus:ring-1 focus:ring-terracotta-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Confirm Password <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            value={profileData.confirmPassword}
            onChange={(e) =>
              handleInputChange("confirmPassword", e.target.value)
            }
            className="w-full px-4 py-3 border border-stone-300 rounded-md focus:border-terracotta-500 focus:outline-none focus:ring-1 focus:ring-terracotta-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Business Type <span className="text-red-500">*</span>
          </label>
          <select
            value={profileData.businessType}
            onChange={(e) => handleInputChange("businessType", e.target.value)}
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
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Business Registration Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={profileData.businessRegistrationNumber}
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
          {profileData.productCategories.map((category, index) => (
            <span
              key={index}
              className="bg-terracotta-100 text-terracotta-700 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm flex items-center"
            >
              {category}
              <button
                onClick={() => handleArrayRemove("productCategories", index)}
                className="ml-1 sm:ml-2 text-terracotta-500 hover:text-terracotta-700"
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
            className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border border-stone-300 rounded-md focus:border-terracotta-500 focus:outline-none focus:ring-1 focus:ring-terracotta-500"
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleArrayAdd(
                  "productCategories",
                  (e.target as HTMLInputElement).value
                );
                (e.target as HTMLInputElement).value = "";
              }
            }}
          />
          <button
            onClick={(e) => {
              const input = e.currentTarget
                .previousElementSibling as HTMLInputElement;
              handleArrayAdd("productCategories", input.value);
              input.value = "";
            }}
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
        <div className="mt-2 flex justify-center px-4 sm:px-6 pt-4 sm:pt-5 pb-4 sm:pb-6 border-2 border-dashed border-stone-300 rounded-md">
          <div className="space-y-1 sm:space-y-2 text-center">
            <div className="mx-auto h-16 sm:h-20 w-16 sm:w-20 text-stone-400">
              <Upload className="mx-auto h-8 sm:h-12 w-8 sm:w-12" />
            </div>
            <div className="flex flex-col sm:flex-row text-sm text-stone-600 justify-center">
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer rounded-md font-medium text-terracotta-600 hover:text-terracotta-500"
              >
                <span>Upload a file</span>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                />
              </label>
              <p className="sm:pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-stone-500">PNG, JPG, GIF up to 2MB</p>
          </div>
        </div>
      </div>
    </div>
  );
}
