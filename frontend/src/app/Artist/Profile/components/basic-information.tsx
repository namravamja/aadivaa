"use client";

import { useState } from "react";
import Image from "next/image";
import { Camera, User, X, Plus } from "lucide-react";

interface BasicInfoData {
  fullName: string;
  storeName: string;
  email: string;
  mobile: string;
  businessType: string;
  businessRegistrationNumber: string;
  productCategories: string[];
}

interface BasicInformationProps {
  isEditing: boolean;
  onDataChange: (data: BasicInfoData) => void;
}

export default function BasicInformation({
  isEditing,
  onDataChange,
}: BasicInformationProps) {
  const [data, setData] = useState<BasicInfoData>({
    fullName: "John Smith",
    storeName: "Smith Crafts & Collectibles",
    email: "john.smith@example.com",
    mobile: "+1 (555) 123-4567",
    businessType: "Individual",
    businessRegistrationNumber: "BRN12345678",
    productCategories: ["Handmade Crafts", "Vintage Items", "Home Decor"],
  });

  const handleInputChange = <K extends keyof BasicInfoData>(
    field: K,
    value: BasicInfoData[K]
  ) => {
    const newData = { ...data, [field]: value };
    setData(newData);
    onDataChange(newData);
  };

  const handleArrayAdd = (value: string) => {
    if (value.trim()) {
      const newCategories = [...data.productCategories, value.trim()];
      const newData = { ...data, productCategories: newCategories };
      setData(newData);
      onDataChange(newData);
    }
  };

  const handleArrayRemove = (index: number) => {
    const newCategories = data.productCategories.filter((_, i) => i !== index);
    const newData = { ...data, productCategories: newCategories };
    setData(newData);
    onDataChange(newData);
  };

  return (
    <div className="bg-white border border-stone-200 shadow-sm">
      <div className="p-6 border-b border-stone-200">
        <h2 className="text-xl font-medium text-stone-900 flex items-center">
          <User className="w-5 h-5 mr-2" />
          Basic Information
        </h2>
      </div>

      <div className="p-6 space-y-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Profile Image */}
          <div className="flex flex-col items-center lg:items-start">
            <div className="relative w-20 h-20 bg-stone-200 rounded-full flex items-center justify-center overflow-hidden">
              <Image
                src="/placeholder.svg?height=80&width=80"
                alt={data.fullName}
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
              {isEditing && (
                <button
                  type="button"
                  aria-label="Change profile picture"
                  className="absolute bottom-0 right-0 bg-terracotta-500 hover:bg-terracotta-600 text-white p-2 rounded-full transition-colors"
                >
                  <Camera className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Basic Details */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Full Name *
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={data.fullName}
                  onChange={(e) =>
                    handleInputChange("fullName", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-stone-300 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent transition-colors"
                  placeholder="Enter your full name"
                />
              ) : (
                <p className="text-stone-600 py-2">{data.fullName}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Store Name *
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={data.storeName}
                  onChange={(e) =>
                    handleInputChange("storeName", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-stone-300 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent transition-colors"
                  placeholder="Enter your store name"
                />
              ) : (
                <p className="text-stone-600 py-2">{data.storeName}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Email Address *
              </label>
              {isEditing ? (
                <input
                  type="email"
                  value={data.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent transition-colors"
                  placeholder="Enter your email address"
                />
              ) : (
                <p className="text-stone-600 py-2">{data.email}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Mobile Number *
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  value={data.mobile}
                  onChange={(e) => handleInputChange("mobile", e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent transition-colors"
                  placeholder="Enter your mobile number"
                />
              ) : (
                <p className="text-stone-600 py-2">{data.mobile}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Business Type *
              </label>
              {isEditing ? (
                <select
                  value={data.businessType}
                  onChange={(e) =>
                    handleInputChange("businessType", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-stone-300 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent transition-colors"
                >
                  <option value="Individual">Individual</option>
                  <option value="Company">Company</option>
                  <option value="Partnership">Partnership</option>
                  <option value="LLP">LLP</option>
                  <option value="Other">Other</option>
                </select>
              ) : (
                <p className="text-stone-600 py-2">{data.businessType}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Registration Number
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={data.businessRegistrationNumber}
                  onChange={(e) =>
                    handleInputChange(
                      "businessRegistrationNumber",
                      e.target.value
                    )
                  }
                  className="w-full px-3 py-2 border border-stone-300 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent transition-colors"
                  placeholder="Enter registration number"
                />
              ) : (
                <p className="text-stone-600 py-2">
                  {data.businessRegistrationNumber}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Product Categories */}
        <div className="pt-6 border-t border-stone-200">
          <label className="block text-sm font-medium text-stone-700 mb-3">
            Product Categories
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            {data.productCategories.map((category, index) => (
              <span
                key={index}
                className="bg-terracotta-100 text-terracotta-700 px-3 py-1 rounded-full text-sm flex items-center"
              >
                {category}
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => handleArrayRemove(index)}
                    className="ml-2 text-terracotta-500 hover:text-terracotta-700 transition-colors"
                    aria-label={`Remove ${category}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </span>
            ))}
          </div>
          {isEditing && (
            <div className="flex">
              <input
                type="text"
                placeholder="Add a category"
                className="flex-1 px-3 py-2 border border-stone-300 rounded-l focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent transition-colors"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleArrayAdd((e.target as HTMLInputElement).value);
                    (e.target as HTMLInputElement).value = "";
                  }
                }}
              />
              <button
                type="button"
                onClick={(e) => {
                  const input = e.currentTarget
                    .previousElementSibling as HTMLInputElement;
                  handleArrayAdd(input.value);
                  input.value = "";
                }}
                className="bg-terracotta-500 hover:bg-terracotta-600 text-white px-4 py-2 rounded-r transition-colors"
                aria-label="Add category"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
