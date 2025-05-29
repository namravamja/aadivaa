"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import {
  Camera,
  Save,
  Edit,
  X,
  Plus,
  User,
  Mail,
  MapPin,
  CreditCard,
  Truck,
  Globe,
  Instagram,
  Facebook,
  Twitter,
  Building,
  Hash,
  Clock,
  Package,
  Shield,
  FileText,
} from "lucide-react";

// Define types for our profile data
interface SocialLinks {
  website: string;
  instagram: string;
  facebook: string;
  twitter: string;
}

interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  pinCode: string;
}

interface ProfileData {
  fullName: string;
  storeName: string;
  email: string;
  mobile: string;
  businessType: string;
  businessRegistrationNumber: string;
  productCategories: string[];
  businessAddress: Address;
  warehouseAddress: {
    sameAsBusiness: boolean;
  } & Address;
  bankAccountName: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  upiId: string;
  gstNumber: string;
  panNumber: string;
  shippingType: string;
  serviceAreas: string[];
  inventoryVolume: string;
  supportContact: string;
  returnPolicy: string;
  workingHours: string;
  socialLinks: SocialLinks;
  termsAgreed: boolean;
}

export default function SellerProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    // Step 1: Seller Account & Business Basics
    fullName: "John Smith",
    storeName: "Smith Crafts & Collectibles",
    email: "john.smith@example.com",
    mobile: "+1 (555) 123-4567",
    businessType: "Individual",
    businessRegistrationNumber: "BRN12345678",
    productCategories: ["Handmade Crafts", "Vintage Items", "Home Decor"],

    // Step 2: Address, Banking & Tax Details
    businessAddress: {
      street: "123 Main Street",
      city: "Craftsville",
      state: "Artisan State",
      country: "United States",
      pinCode: "12345",
    },
    warehouseAddress: {
      sameAsBusiness: true,
      street: "",
      city: "",
      state: "",
      country: "",
      pinCode: "",
    },
    bankAccountName: "John Smith",
    bankName: "Craft Credit Union",
    accountNumber: "XXXX4567",
    ifscCode: "CCU12345",
    upiId: "johnsmith@upi",
    gstNumber: "GST9876543210",
    panNumber: "ABCDE1234F",

    // Step 3: Preferences, Logistics & Agreement
    shippingType: "Self Fulfilled",
    serviceAreas: ["National", "International"],
    inventoryVolume: "51-100",
    supportContact: "support@smithcrafts.com",
    returnPolicy:
      "30-day returns accepted for unused items in original packaging. Customer pays return shipping.",
    workingHours: "Mon-Fri: 9AM-5PM EST",
    socialLinks: {
      website: "www.smithcrafts.com",
      instagram: "@smithcrafts",
      facebook: "Smith Crafts & Collectibles",
      twitter: "@smithcrafts",
    },
    termsAgreed: true,
  });

  const profileRef = useRef<HTMLDivElement>(null);

  const handleInputChange = <K extends keyof ProfileData>(
    field: K,
    value: ProfileData[K]
  ) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNestedInputChange = <
    K extends keyof ProfileData,
    NK extends keyof ProfileData[K]
  >(
    parent: K,
    field: NK,
    value: ProfileData[K][NK]
  ) => {
    setProfileData((prev) => ({
      ...prev,
      [parent]: {
        ...(typeof prev[parent] === "object" && prev[parent] !== null
          ? prev[parent]
          : {}),
        [field]: value,
      },
    }));
  };

  const handleArrayAdd = <K extends keyof ProfileData>(
    field: K,
    value: string
  ) => {
    if (value.trim() && Array.isArray(profileData[field])) {
      setProfileData((prev) => ({
        ...prev,
        [field]: [...(prev[field] as string[]), value.trim()],
      }));
    }
  };

  const handleArrayRemove = <K extends keyof ProfileData>(
    field: K,
    index: number
  ) => {
    if (Array.isArray(profileData[field])) {
      setProfileData((prev) => ({
        ...prev,
        [field]: (prev[field] as string[]).filter((_, i) => i !== index),
      }));
    }
  };

  const handleSave = () => {
    console.log("Saving profile data:", profileData);
    setIsEditing(false);
    profileRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div
      ref={profileRef}
      className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-6xl"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-light text-stone-900 mb-1 sm:mb-2">
            Seller Profile
          </h1>
          <p className="text-sm sm:text-base text-stone-600">
            Manage your seller profile and business information
          </p>
        </div>
        <div className="flex space-x-3 w-full sm:w-auto">
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="px-3 sm:px-4 py-2 border border-stone-300 text-stone-700 rounded-md hover:bg-stone-50 transition-colors flex-1 sm:flex-none text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-3 sm:px-4 py-2 bg-terracotta-600 text-white rounded-md hover:bg-terracotta-700 transition-colors flex items-center justify-center flex-1 sm:flex-none text-sm"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-3 sm:px-4 py-2 bg-terracotta-600 text-white rounded-md hover:bg-terracotta-700 transition-colors flex items-center justify-center w-full sm:w-auto text-sm"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Profile Content */}
      <div className="space-y-4 sm:space-y-6">
        {/* Basic Information */}
        <div className="bg-white border border-stone-200 p-4 sm:p-6 rounded-md shadow-sm">
          <div className="flex items-center mb-4 sm:mb-6">
            <User className="w-5 h-5 text-terracotta-600 mr-2 sm:mr-3 flex-shrink-0" />
            <h2 className="text-base sm:text-lg font-medium text-stone-900">
              Basic Information
            </h2>
          </div>

          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
            {/* Profile Image */}
            <div className="flex flex-col items-center lg:items-start">
              <div className="relative w-24 h-24 sm:w-32 sm:h-32 mb-4">
                <Image
                  src="/placeholder.svg?height=128&width=128"
                  alt={profileData.fullName}
                  width={128}
                  height={128}
                  className="object-cover rounded-full bg-stone-100"
                />
                {isEditing && (
                  <button
                    type="button"
                    aria-label="Change profile picture"
                    className="absolute bottom-0 right-0 bg-terracotta-600 text-white p-2 rounded-full hover:bg-terracotta-700 transition-colors"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Basic Details */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1 sm:mb-2">
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.fullName}
                    onChange={(e) =>
                      handleInputChange("fullName", e.target.value)
                    }
                    className="w-full border border-stone-300 rounded-md px-3 py-2 text-sm"
                  />
                ) : (
                  <p className="text-stone-600 text-sm">
                    {profileData.fullName}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1 sm:mb-2">
                  Store Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.storeName}
                    onChange={(e) =>
                      handleInputChange("storeName", e.target.value)
                    }
                    className="w-full border border-stone-300 rounded-md px-3 py-2 text-sm"
                  />
                ) : (
                  <p className="text-stone-600 text-sm">
                    {profileData.storeName}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1 sm:mb-2">
                  Email
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="w-full border border-stone-300 rounded-md px-3 py-2 text-sm"
                  />
                ) : (
                  <p className="text-stone-600 text-sm">{profileData.email}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1 sm:mb-2">
                  Mobile
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={profileData.mobile}
                    onChange={(e) =>
                      handleInputChange("mobile", e.target.value)
                    }
                    className="w-full border border-stone-300 rounded-md px-3 py-2 text-sm"
                  />
                ) : (
                  <p className="text-stone-600 text-sm">{profileData.mobile}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1 sm:mb-2">
                  Business Type
                </label>
                {isEditing ? (
                  <select
                    value={profileData.businessType}
                    onChange={(e) =>
                      handleInputChange("businessType", e.target.value)
                    }
                    className="w-full border border-stone-300 rounded-md px-3 py-2 text-sm"
                  >
                    <option value="Individual">Individual</option>
                    <option value="Company">Company</option>
                    <option value="Partnership">Partnership</option>
                    <option value="LLP">LLP</option>
                    <option value="Other">Other</option>
                  </select>
                ) : (
                  <p className="text-stone-600 text-sm">
                    {profileData.businessType}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1 sm:mb-2">
                  Registration Number
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.businessRegistrationNumber}
                    onChange={(e) =>
                      handleInputChange(
                        "businessRegistrationNumber",
                        e.target.value
                      )
                    }
                    className="w-full border border-stone-300 rounded-md px-3 py-2 text-sm"
                  />
                ) : (
                  <p className="text-stone-600 text-sm">
                    {profileData.businessRegistrationNumber}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Product Categories */}
          <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-stone-200">
            <label className="block text-sm font-medium text-stone-700 mb-2 sm:mb-3">
              Product Categories
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {profileData.productCategories.map((category, index) => (
                <span
                  key={index}
                  className="bg-terracotta-100 text-terracotta-700 px-2 sm:px-3 py-1 rounded-full text-xs flex items-center"
                >
                  {category}
                  {isEditing && (
                    <button
                      type="button"
                      onClick={() =>
                        handleArrayRemove("productCategories", index)
                      }
                      className="ml-1 sm:ml-2 text-terracotta-500 hover:text-terracotta-700"
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
                  className="flex-1 px-3 py-2 text-sm border border-stone-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-terracotta-500"
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
                  type="button"
                  onClick={(e) => {
                    const input = e.currentTarget
                      .previousElementSibling as HTMLInputElement;
                    handleArrayAdd("productCategories", input.value);
                    input.value = "";
                  }}
                  className="bg-terracotta-600 text-white px-3 sm:px-4 py-2 rounded-r-md hover:bg-terracotta-700 transition-colors"
                  aria-label="Add category"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Address Information */}
        <div className="bg-white border border-stone-200 p-4 sm:p-6 rounded-md shadow-sm">
          <div className="flex items-center mb-4 sm:mb-6">
            <MapPin className="w-5 h-5 text-terracotta-600 mr-2 sm:mr-3 flex-shrink-0" />
            <h2 className="text-base sm:text-lg font-medium text-stone-900">
              Address Information
            </h2>
          </div>

          <div className="space-y-6">
            {/* Business Address */}
            <div>
              <h3 className="text-sm font-medium text-stone-700 mb-2 sm:mb-3">
                Business Address
              </h3>
              {isEditing ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      placeholder="Street Address"
                      value={profileData.businessAddress.street}
                      onChange={(e) =>
                        handleNestedInputChange(
                          "businessAddress",
                          "street",
                          e.target.value
                        )
                      }
                      className="w-full border border-stone-300 rounded-md px-3 py-2 text-sm"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="City"
                    value={profileData.businessAddress.city}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "businessAddress",
                        "city",
                        e.target.value
                      )
                    }
                    className="w-full border border-stone-300 rounded-md px-3 py-2 text-sm"
                  />
                  <input
                    type="text"
                    placeholder="State"
                    value={profileData.businessAddress.state}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "businessAddress",
                        "state",
                        e.target.value
                      )
                    }
                    className="w-full border border-stone-300 rounded-md px-3 py-2 text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Country"
                    value={profileData.businessAddress.country}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "businessAddress",
                        "country",
                        e.target.value
                      )
                    }
                    className="w-full border border-stone-300 rounded-md px-3 py-2 text-sm"
                  />
                  <input
                    type="text"
                    placeholder="PIN Code"
                    value={profileData.businessAddress.pinCode}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "businessAddress",
                        "pinCode",
                        e.target.value
                      )
                    }
                    className="w-full border border-stone-300 rounded-md px-3 py-2 text-sm"
                  />
                </div>
              ) : (
                <div className="text-stone-600 text-sm">
                  <p>{profileData.businessAddress.street}</p>
                  <p>
                    {profileData.businessAddress.city},{" "}
                    {profileData.businessAddress.state}{" "}
                    {profileData.businessAddress.pinCode}
                  </p>
                  <p>{profileData.businessAddress.country}</p>
                </div>
              )}
            </div>

            {/* Warehouse Address */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 sm:mb-3 gap-2">
                <h3 className="text-sm font-medium text-stone-700">
                  Warehouse Address
                </h3>
                {isEditing && (
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="sameAsBusiness"
                      checked={profileData.warehouseAddress.sameAsBusiness}
                      onChange={(e) =>
                        handleNestedInputChange(
                          "warehouseAddress",
                          "sameAsBusiness",
                          e.target.checked
                        )
                      }
                      className="h-4 w-4 text-terracotta-600 focus:ring-terracotta-500 border-stone-300 rounded"
                    />
                    <label
                      htmlFor="sameAsBusiness"
                      className="ml-2 text-sm text-stone-700"
                    >
                      Same as Business Address
                    </label>
                  </div>
                )}
              </div>

              {profileData.warehouseAddress.sameAsBusiness ? (
                <p className="text-stone-600 text-sm">
                  Same as Business Address
                </p>
              ) : isEditing ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      placeholder="Street Address"
                      value={profileData.warehouseAddress.street}
                      onChange={(e) =>
                        handleNestedInputChange(
                          "warehouseAddress",
                          "street",
                          e.target.value
                        )
                      }
                      className="w-full border border-stone-300 rounded-md px-3 py-2 text-sm"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="City"
                    value={profileData.warehouseAddress.city}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "warehouseAddress",
                        "city",
                        e.target.value
                      )
                    }
                    className="w-full border border-stone-300 rounded-md px-3 py-2 text-sm"
                  />
                  <input
                    type="text"
                    placeholder="State"
                    value={profileData.warehouseAddress.state}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "warehouseAddress",
                        "state",
                        e.target.value
                      )
                    }
                    className="w-full border border-stone-300 rounded-md px-3 py-2 text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Country"
                    value={profileData.warehouseAddress.country}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "warehouseAddress",
                        "country",
                        e.target.value
                      )
                    }
                    className="w-full border border-stone-300 rounded-md px-3 py-2 text-sm"
                  />
                  <input
                    type="text"
                    placeholder="PIN Code"
                    value={profileData.warehouseAddress.pinCode}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "warehouseAddress",
                        "pinCode",
                        e.target.value
                      )
                    }
                    className="w-full border border-stone-300 rounded-md px-3 py-2 text-sm"
                  />
                </div>
              ) : (
                <div className="text-stone-600 text-sm">
                  <p>{profileData.warehouseAddress.street}</p>
                  <p>
                    {profileData.warehouseAddress.city},{" "}
                    {profileData.warehouseAddress.state}{" "}
                    {profileData.warehouseAddress.pinCode}
                  </p>
                  <p>{profileData.warehouseAddress.country}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Banking & Tax Information */}
        <div className="bg-white border border-stone-200 p-4 sm:p-6 rounded-md shadow-sm">
          <div className="flex items-center mb-4 sm:mb-6">
            <CreditCard className="w-5 h-5 text-terracotta-600 mr-2 sm:mr-3 flex-shrink-0" />
            <h2 className="text-base sm:text-lg font-medium text-stone-900">
              Banking & Tax Information
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Banking Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-stone-700 flex items-center">
                <Building className="w-4 h-4 mr-2 flex-shrink-0" />
                Banking Details
              </h3>
              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1">
                  Account Holder Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.bankAccountName}
                    onChange={(e) =>
                      handleInputChange("bankAccountName", e.target.value)
                    }
                    className="w-full border border-stone-300 rounded-md px-3 py-2 text-sm"
                  />
                ) : (
                  <p className="text-stone-600 text-sm">
                    {profileData.bankAccountName}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1">
                  Bank Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.bankName}
                    onChange={(e) =>
                      handleInputChange("bankName", e.target.value)
                    }
                    className="w-full border border-stone-300 rounded-md px-3 py-2 text-sm"
                  />
                ) : (
                  <p className="text-stone-600 text-sm">
                    {profileData.bankName}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1">
                  Account Number
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.accountNumber}
                    onChange={(e) =>
                      handleInputChange("accountNumber", e.target.value)
                    }
                    className="w-full border border-stone-300 rounded-md px-3 py-2 text-sm"
                  />
                ) : (
                  <p className="text-stone-600 text-sm">
                    {profileData.accountNumber}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1">
                  IFSC Code
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.ifscCode}
                    onChange={(e) =>
                      handleInputChange("ifscCode", e.target.value)
                    }
                    className="w-full border border-stone-300 rounded-md px-3 py-2 text-sm"
                  />
                ) : (
                  <p className="text-stone-600 text-sm">
                    {profileData.ifscCode}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1">
                  UPI ID
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.upiId}
                    onChange={(e) => handleInputChange("upiId", e.target.value)}
                    className="w-full border border-stone-300 rounded-md px-3 py-2 text-sm"
                  />
                ) : (
                  <p className="text-stone-600 text-sm">{profileData.upiId}</p>
                )}
              </div>
            </div>

            {/* Tax Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-stone-700 flex items-center">
                <FileText className="w-4 h-4 mr-2 flex-shrink-0" />
                Tax Details
              </h3>
              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1">
                  GST Number
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.gstNumber}
                    onChange={(e) =>
                      handleInputChange("gstNumber", e.target.value)
                    }
                    className="w-full border border-stone-300 rounded-md px-3 py-2 text-sm"
                  />
                ) : (
                  <p className="text-stone-600 text-sm">
                    {profileData.gstNumber}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1">
                  PAN Number
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.panNumber}
                    onChange={(e) =>
                      handleInputChange("panNumber", e.target.value)
                    }
                    className="w-full border border-stone-300 rounded-md px-3 py-2 text-sm"
                  />
                ) : (
                  <p className="text-stone-600 text-sm">
                    {profileData.panNumber}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Shipping & Logistics */}
        <div className="bg-white border border-stone-200 p-4 sm:p-6 rounded-md shadow-sm">
          <div className="flex items-center mb-4 sm:mb-6">
            <Truck className="w-5 h-5 text-terracotta-600 mr-2 sm:mr-3 flex-shrink-0" />
            <h2 className="text-base sm:text-lg font-medium text-stone-900">
              Shipping & Logistics
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className=" text-sm font-medium text-stone-700 mb-1 sm:mb-2 flex items-center">
                <Package className="w-4 h-4 mr-2 flex-shrink-0" />
                Shipping Type
              </label>
              {isEditing ? (
                <select
                  value={profileData.shippingType}
                  onChange={(e) =>
                    handleInputChange("shippingType", e.target.value)
                  }
                  className="w-full border border-stone-300 rounded-md px-3 py-2 text-sm"
                >
                  <option value="Self Fulfilled">Self Fulfilled</option>
                  <option value="Platform Fulfilled">Platform Fulfilled</option>
                  <option value="Both">Both</option>
                </select>
              ) : (
                <p className="text-stone-600 text-sm">
                  {profileData.shippingType}
                </p>
              )}
            </div>
            <div>
              <label className=" text-sm font-medium text-stone-700 mb-1 sm:mb-2 flex items-center">
                <Hash className="w-4 h-4 mr-2 flex-shrink-0" />
                Inventory Volume
              </label>
              {isEditing ? (
                <select
                  value={profileData.inventoryVolume}
                  onChange={(e) =>
                    handleInputChange("inventoryVolume", e.target.value)
                  }
                  className="w-full border border-stone-300 rounded-md px-3 py-2 text-sm"
                >
                  <option value="1-10">1-10 items</option>
                  <option value="11-50">11-50 items</option>
                  <option value="51-100">51-100 items</option>
                  <option value="101-500">101-500 items</option>
                  <option value="500+">500+ items</option>
                </select>
              ) : (
                <p className="text-stone-600 text-sm">
                  {profileData.inventoryVolume} items
                </p>
              )}
            </div>
            <div>
              <label className=" text-sm font-medium text-stone-700 mb-1 sm:mb-2 flex items-center">
                <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
                Support Contact
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={profileData.supportContact}
                  onChange={(e) =>
                    handleInputChange("supportContact", e.target.value)
                  }
                  className="w-full border border-stone-300 rounded-md px-3 py-2 text-sm"
                />
              ) : (
                <p className="text-stone-600 text-sm">
                  {profileData.supportContact}
                </p>
              )}
            </div>
            <div>
              <label className=" text-sm font-medium text-stone-700 mb-1 sm:mb-2 flex items-center">
                <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
                Working Hours
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={profileData.workingHours}
                  onChange={(e) =>
                    handleInputChange("workingHours", e.target.value)
                  }
                  className="w-full border border-stone-300 rounded-md px-3 py-2 text-sm"
                />
              ) : (
                <p className="text-stone-600 text-sm">
                  {profileData.workingHours}
                </p>
              )}
            </div>
          </div>

          {/* Service Areas */}
          <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-stone-200">
            <label className=" text-sm font-medium text-stone-700 mb-2 sm:mb-3 flex items-center">
              <Globe className="w-4 h-4 mr-2 flex-shrink-0" />
              Service Areas
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {profileData.serviceAreas.map((area, index) => (
                <span
                  key={index}
                  className="bg-sage-100 text-sage-700 px-2 sm:px-3 py-1 rounded-full text-xs flex items-center"
                >
                  {area}
                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => handleArrayRemove("serviceAreas", index)}
                      className="ml-1 sm:ml-2 text-sage-500 hover:text-sage-700"
                      aria-label={`Remove ${area}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </span>
              ))}
            </div>
            {isEditing && (
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-0">
                <input
                  type="text"
                  placeholder="Add a service area"
                  className="flex-1 px-3 py-2 text-sm border border-stone-300 rounded-md sm:rounded-l-md sm:rounded-r-none focus:outline-none focus:ring-1 focus:ring-terracotta-500"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleArrayAdd(
                        "serviceAreas",
                        (e.target as HTMLInputElement).value
                      );
                      (e.target as HTMLInputElement).value = "";
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={(e) => {
                    const input = e.currentTarget
                      .previousElementSibling as HTMLInputElement;
                    handleArrayAdd("serviceAreas", input.value);
                    input.value = "";
                  }}
                  className="bg-sage-600 text-white px-4 py-2 rounded-md sm:rounded-l-none sm:rounded-r-md hover:bg-sage-700 transition-colors"
                  aria-label="Add service area"
                >
                  <Plus className="w-4 h-4 mx-auto sm:mx-0" />
                </button>
              </div>
            )}
          </div>

          {/* Return Policy */}
          <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-stone-200">
            <label className=" text-sm font-medium text-stone-700 mb-2 sm:mb-3 flex items-center">
              <Shield className="w-4 h-4 mr-2 flex-shrink-0" />
              Return Policy
            </label>
            {isEditing ? (
              <textarea
                value={profileData.returnPolicy}
                onChange={(e) =>
                  handleInputChange("returnPolicy", e.target.value)
                }
                rows={3}
                className="w-full border border-stone-300 rounded-md px-3 py-2 text-sm"
              />
            ) : (
              <p className="text-stone-600 text-sm">
                {profileData.returnPolicy}
              </p>
            )}
          </div>
        </div>

        {/* Social Media Links */}
        <div className="bg-white border border-stone-200 p-4 sm:p-6 rounded-md shadow-sm">
          <div className="flex items-center mb-4 sm:mb-6">
            <Globe className="w-5 h-5 text-terracotta-600 mr-2 sm:mr-3 flex-shrink-0" />
            <h2 className="text-base sm:text-lg font-medium text-stone-900">
              Social Media & Website
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className=" text-sm font-medium text-stone-700 mb-1 sm:mb-2 flex items-center">
                <Globe className="w-4 h-4 mr-2 flex-shrink-0" />
                Website
              </label>
              {isEditing ? (
                <input
                  type="url"
                  value={profileData.socialLinks.website}
                  onChange={(e) =>
                    handleNestedInputChange(
                      "socialLinks",
                      "website",
                      e.target.value
                    )
                  }
                  className="w-full border border-stone-300 rounded-md px-3 py-2 text-sm"
                />
              ) : (
                <p className="text-stone-600 text-sm">
                  {profileData.socialLinks.website}
                </p>
              )}
            </div>
            <div>
              <label className=" text-sm font-medium text-stone-700 mb-1 sm:mb-2 flex items-center">
                <Instagram className="w-4 h-4 mr-2 flex-shrink-0" />
                Instagram
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={profileData.socialLinks.instagram}
                  onChange={(e) =>
                    handleNestedInputChange(
                      "socialLinks",
                      "instagram",
                      e.target.value
                    )
                  }
                  className="w-full border border-stone-300 rounded-md px-3 py-2 text-sm"
                />
              ) : (
                <p className="text-stone-600 text-sm">
                  {profileData.socialLinks.instagram}
                </p>
              )}
            </div>
            <div>
              <label className=" text-sm font-medium text-stone-700 mb-1 sm:mb-2 flex items-center">
                <Facebook className="w-4 h-4 mr-2 flex-shrink-0" />
                Facebook
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={profileData.socialLinks.facebook}
                  onChange={(e) =>
                    handleNestedInputChange(
                      "socialLinks",
                      "facebook",
                      e.target.value
                    )
                  }
                  className="w-full border border-stone-300 rounded-md px-3 py-2 text-sm"
                />
              ) : (
                <p className="text-stone-600 text-sm">
                  {profileData.socialLinks.facebook}
                </p>
              )}
            </div>
            <div>
              <label className=" text-sm font-medium text-stone-700 mb-1 sm:mb-2 flex items-center">
                <Twitter className="w-4 h-4 mr-2 flex-shrink-0" />
                Twitter
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={profileData.socialLinks.twitter}
                  onChange={(e) =>
                    handleNestedInputChange(
                      "socialLinks",
                      "twitter",
                      e.target.value
                    )
                  }
                  className="w-full border border-stone-300 rounded-md px-3 py-2 text-sm"
                />
              ) : (
                <p className="text-stone-600 text-sm">
                  {profileData.socialLinks.twitter}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
