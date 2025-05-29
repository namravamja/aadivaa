import { Check } from "lucide-react";
import type { ProfileData } from "../page";

interface Step4Props {
  profileData: ProfileData;
}

export default function Step4Summary({ profileData }: Step4Props) {
  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-light text-stone-900 mb-4 sm:mb-6">
        Profile Summary
      </h2>

      <div className="bg-stone-50 p-4 sm:p-6 rounded-md mb-6 sm:mb-8">
        <h3 className="text-base sm:text-lg font-medium text-stone-900 mb-3 sm:mb-4">
          Seller Account & Business Basics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
          <div>
            <span className="font-medium text-stone-700">
              Full Name / Business Name:
            </span>{" "}
            {profileData.fullName || "Not provided"}
          </div>
          <div>
            <span className="font-medium text-stone-700">Store Name:</span>{" "}
            {profileData.storeName || "Not provided"}
          </div>
          <div>
            <span className="font-medium text-stone-700">Email:</span>{" "}
            {profileData.email || "Not provided"}
          </div>
          <div>
            <span className="font-medium text-stone-700">Mobile:</span>{" "}
            {profileData.mobile || "Not provided"}
          </div>
          <div>
            <span className="font-medium text-stone-700">Business Type:</span>{" "}
            {profileData.businessType || "Not provided"}
          </div>
          <div>
            <span className="font-medium text-stone-700">
              Business Registration Number:
            </span>{" "}
            {profileData.businessRegistrationNumber || "Not provided"}
          </div>
          <div className="md:col-span-2">
            <span className="font-medium text-stone-700">
              Product Categories:
            </span>{" "}
            {profileData.productCategories.length > 0
              ? profileData.productCategories.join(", ")
              : "None provided"}
          </div>
        </div>
      </div>

      <div className="bg-stone-50 p-4 sm:p-6 rounded-md mb-6 sm:mb-8">
        <h3 className="text-base sm:text-lg font-medium text-stone-900 mb-3 sm:mb-4">
          Address & Banking Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
          <div className="md:col-span-2">
            <span className="font-medium text-stone-700">
              Business Address:
            </span>{" "}
            {profileData.businessAddress.street
              ? `${profileData.businessAddress.street}, ${profileData.businessAddress.city}, ${profileData.businessAddress.state}, ${profileData.businessAddress.country}, ${profileData.businessAddress.pinCode}`
              : "Not provided"}
          </div>
          <div className="md:col-span-2">
            <span className="font-medium text-stone-700">
              Warehouse Address:
            </span>{" "}
            {profileData.warehouseAddress.sameAsBusiness
              ? "Same as Business Address"
              : profileData.warehouseAddress.street
              ? `${profileData.warehouseAddress.street}, ${profileData.warehouseAddress.city}, ${profileData.warehouseAddress.state}, ${profileData.warehouseAddress.country}, ${profileData.warehouseAddress.pinCode}`
              : "Not provided"}
          </div>
          <div>
            <span className="font-medium text-stone-700">
              Bank Account Name:
            </span>{" "}
            {profileData.bankAccountName || "Not provided"}
          </div>
          <div>
            <span className="font-medium text-stone-700">Bank Name:</span>{" "}
            {profileData.bankName || "Not provided"}
          </div>
          <div>
            <span className="font-medium text-stone-700">Account Number:</span>{" "}
            {profileData.accountNumber
              ? "XXXX" + profileData.accountNumber.slice(-4)
              : "Not provided"}
          </div>
          <div>
            <span className="font-medium text-stone-700">IFSC Code:</span>{" "}
            {profileData.ifscCode || "Not provided"}
          </div>
          <div>
            <span className="font-medium text-stone-700">GST Number:</span>{" "}
            {profileData.gstNumber || "Not provided"}
          </div>
          <div>
            <span className="font-medium text-stone-700">PAN Number:</span>{" "}
            {profileData.panNumber || "Not provided"}
          </div>
        </div>
      </div>

      <div className="bg-stone-50 p-4 sm:p-6 rounded-md mb-6 sm:mb-8">
        <h3 className="text-base sm:text-lg font-medium text-stone-900 mb-3 sm:mb-4">
          Preferences & Logistics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
          <div>
            <span className="font-medium text-stone-700">Shipping Type:</span>{" "}
            {profileData.shippingType || "Not provided"}
          </div>
          <div>
            <span className="font-medium text-stone-700">
              Inventory Volume:
            </span>{" "}
            {profileData.inventoryVolume || "Not provided"}
          </div>
          <div>
            <span className="font-medium text-stone-700">Support Contact:</span>{" "}
            {profileData.supportContact || "Not provided"}
          </div>
          <div>
            <span className="font-medium text-stone-700">Working Hours:</span>{" "}
            {profileData.workingHours || "Not provided"}
          </div>
          <div className="md:col-span-2">
            <span className="font-medium text-stone-700">Service Areas:</span>{" "}
            {profileData.serviceAreas.length > 0
              ? profileData.serviceAreas.join(", ")
              : "None provided"}
          </div>
          <div className="md:col-span-2">
            <span className="font-medium text-stone-700">Return Policy:</span>{" "}
            {profileData.returnPolicy || "Not provided"}
          </div>
          <div className="md:col-span-2">
            <span className="font-medium text-stone-700">
              Terms & Conditions:
            </span>{" "}
            {profileData.termsAgreed ? "Agreed" : "Not agreed"}
          </div>
        </div>
      </div>

      <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-terracotta-50 border border-terracotta-200 rounded-md">
        <div className="flex items-center">
          <Check className="w-4 sm:w-5 h-4 sm:h-5 text-terracotta-600 mr-2" />
          <p className="text-sm sm:text-base text-terracotta-700">
            Your profile is ready to be submitted. Please review all information
            for accuracy before proceeding.
          </p>
        </div>
      </div>
    </div>
  );
}
