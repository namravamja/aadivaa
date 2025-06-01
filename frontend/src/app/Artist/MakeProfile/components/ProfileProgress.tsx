"use client";

import { useUpdateartistMutation } from "@/services/api/artistApi";
import { useEffect } from "react";

interface ProfileData {
  // Step 1: Seller Account & Business Basics
  fullName: string;
  storeName: string;
  email: string;
  mobile: string;
  businessType: string;
  businessRegistrationNumber: string;
  productCategories: string[];
  businessLogo: string;

  // Step 2: Address, Banking & Tax Details
  businessAddress: {
    street: string;
    city: string;
    state: string;
    country: string;
    pinCode: string;
  };
  warehouseAddress: {
    sameAsBusiness: boolean;
    street: string;
    city: string;
    state: string;
    country: string;
    pinCode: string;
  };
  bankAccountName: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  upiId: string;
  gstNumber: string;
  panNumber: string;

  // Step 3: Preferences, Logistics & Agreement
  shippingType: string;
  inventoryVolume: string;
  supportContact: string;
  workingHours: string;
  serviceAreas: string[];
  returnPolicy: string;
  socialLinks: {
    website: string;
    instagram: string;
    facebook: string;
    twitter: string;
  };
  termsAgreed: boolean;
}

interface ProfileProgressProps {
  profileData: ProfileData;
}

export default function ProfileProgress({ profileData }: ProfileProgressProps) {
  const [updateArtist] = useUpdateartistMutation();

  const calculateProgress = () => {
    let completed = 0;
    const total = 23; // Total required fields across all steps

    // Step 1: Seller Account & Business Basics (9 fields)
    if (profileData.fullName) completed++;
    if (profileData.storeName) completed++;
    if (profileData.email) completed++;
    if (profileData.mobile) completed++;
    if (profileData.businessType) completed++;
    if (profileData.businessRegistrationNumber) completed++;
    if (profileData.productCategories.length > 0) completed++;

    // Step 2: Address, Banking & Tax Details (11 fields)
    if (profileData.businessAddress.street) completed++;
    if (profileData.businessAddress.city) completed++;
    if (profileData.businessAddress.state) completed++;
    if (profileData.businessAddress.country) completed++;
    if (profileData.businessAddress.pinCode) completed++;
    if (profileData.bankAccountName) completed++;
    if (profileData.bankName) completed++;
    if (profileData.accountNumber) completed++;
    if (profileData.ifscCode) completed++;
    if (profileData.gstNumber) completed++;
    if (profileData.panNumber) completed++;

    // Step 3: Preferences, Logistics & Agreement (5 fields)
    if (profileData.shippingType) completed++;
    if (profileData.serviceAreas.length > 0) completed++;
    if (profileData.inventoryVolume) completed++;
    if (profileData.returnPolicy) completed++;
    if (profileData.termsAgreed) completed++;

    return Math.round((completed / total) * 100);
  };

  const progress = calculateProgress();

  // Update progress in the artist model whenever it changes
  useEffect(() => {
    updateArtist({ profileProgress: progress });
  }, [progress, updateArtist]);

  const getProgressColor = () => {
    if (progress >= 80) return "bg-sage-500";
    if (progress >= 50) return "bg-terracotta-600";
    return "bg-yellow-500";
  };

  const getProgressText = () => {
    if (progress === 100) return "Profile Complete!";
    if (progress >= 80) return "Almost Complete";
    if (progress >= 50) return "Good Progress";
    return "Getting Started";
  };

  const getMissingFields = () => {
    const missing = [];

    // Step 1 missing fields
    if (!profileData.fullName) missing.push("• Add your full name");
    if (!profileData.storeName) missing.push("• Add your store name");
    if (!profileData.email) missing.push("• Add your email address");
    if (!profileData.mobile) missing.push("• Add your mobile number");
    if (!profileData.businessType) missing.push("• Select business type");
    if (!profileData.businessRegistrationNumber)
      missing.push("• Add business registration number");
    if (profileData.productCategories.length === 0)
      missing.push("• Add product categories");

    // Step 2 missing fields
    if (!profileData.businessAddress.street)
      missing.push("• Add business street address");
    if (!profileData.businessAddress.city) missing.push("• Add business city");
    if (!profileData.businessAddress.state)
      missing.push("• Add business state");
    if (!profileData.businessAddress.country)
      missing.push("• Add business country");
    if (!profileData.businessAddress.pinCode)
      missing.push("• Add business pin code");
    if (!profileData.bankAccountName) missing.push("• Add bank account name");
    if (!profileData.bankName) missing.push("• Add bank name");
    if (!profileData.accountNumber) missing.push("• Add account number");
    if (!profileData.ifscCode) missing.push("• Add IFSC code");
    if (!profileData.gstNumber) missing.push("• Add GST number");
    if (!profileData.panNumber) missing.push("• Add PAN number");

    // Step 3 missing fields
    if (!profileData.shippingType) missing.push("• Select shipping type");
    if (profileData.serviceAreas.length === 0)
      missing.push("• Add service areas");
    if (!profileData.inventoryVolume) missing.push("• Add inventory volume");
    if (!profileData.returnPolicy) missing.push("• Add return policy");
    if (!profileData.termsAgreed)
      missing.push("• Agree to terms and conditions");

    return missing;
  };

  return (
    <div className="bg-white border border-stone-200 shadow-sm mb-8">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-medium text-stone-900">
              Profile Completion
            </h2>
            <p className="text-sm text-stone-600">{getProgressText()}</p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold text-stone-900">
              {progress}%
            </span>
          </div>
        </div>

        <div className="w-full bg-stone-200 h-3">
          <div
            className={`h-3 transition-all duration-500 ${getProgressColor()}`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {progress < 100 && (
          <div className="mt-4 text-sm text-stone-600">
            <p>
              Complete your seller profile to start selling on our platform:
            </p>
            <div className="mt-2 space-y-1 max-h-32 overflow-y-auto">
              {getMissingFields().map((field, index) => (
                <div key={index}>{field}</div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
