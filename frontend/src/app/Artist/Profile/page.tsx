"use client";

import { useState, useRef } from "react";
import { Save, Edit, X } from "lucide-react";
import BasicInformation from "./components/basic-information";
import AddressInformation from "./components/address-information";
import BankingTaxInformation from "./components/banking-tax-information";
import ShippingLogistics from "./components/shipping-logistics";
import SocialMediaLinks from "./components/social-media-links";
import SellerProfileProgress from "./components/seller-profile-progress";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [profileData, setProfileData] = useState({
    basicInfo: {},
    addressInfo: {},
    bankingTaxInfo: {},
    shippingLogisticsInfo: {},
    socialMediaInfo: {},
  });

  const profileRef = useRef<HTMLDivElement>(null);

  const handleDataChange = (section: string, data: any) => {
    setProfileData((prev) => ({
      ...prev,
      [section]: data,
    }));
  };

  const hasChanges = () => {
    return Object.values(profileData).some(
      (section) => Object.keys(section).length > 0
    );
  };

  const handleSave = () => {
    console.log("Saving profile data:", profileData);
    setIsEditing(false);
    setShowSaveConfirm(false);
    profileRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleCancel = () => {
    if (hasChanges()) {
      setShowCancelConfirm(true);
    } else {
      performCancel();
    }
  };

  const performCancel = () => {
    setProfileData({
      basicInfo: {},
      addressInfo: {},
      bankingTaxInfo: {},
      shippingLogisticsInfo: {},
      socialMediaInfo: {},
    });
    setIsEditing(false);
    setShowCancelConfirm(false);
  };

  return (
    <div
      ref={profileRef}
      className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-6xl"
    >
      {/* Confirmation Modals */}
      {showSaveConfirm && (
        <div className="fixed inset-0  bg-opacity-30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-stone-900 mb-2">
              Confirm Changes
            </h3>
            <p className="text-stone-600 mb-6">
              Are you sure you want to save these changes to your profile?
            </p>
            <div className="flex space-x-3">
              <button
                onClick={handleSave}
                className="bg-terracotta-500 hover:bg-terracotta-600 text-white px-4 py-2 font-medium transition-colors flex-1"
              >
                Save Changes
              </button>
              <button
                onClick={() => setShowSaveConfirm(false)}
                className="flex-1 border border-stone-300 text-stone-700 hover:bg-stone-50 px-4 py-2 font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showCancelConfirm && (
        <div className="fixed inset-0  bg-opacity-30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-stone-900 mb-2">
              Discard Changes
            </h3>
            <p className="text-stone-600 mb-6">
              You have unsaved changes. Are you sure you want to discard them?
            </p>
            <div className="flex space-x-3">
              <button
                onClick={performCancel}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 font-medium transition-colors"
              >
                Discard Changes
              </button>
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="flex-1 border border-stone-300 text-stone-700 hover:bg-stone-50 px-4 py-2 font-medium transition-colors"
              >
                Keep Editing
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border border-stone-200 shadow-sm mb-6">
        <div className="p-6 border-b border-stone-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-medium text-stone-900 mb-1">
                Seller Profile
              </h1>
              <p className="text-stone-600">
                Manage your seller profile and business information
              </p>
            </div>
            <div className="flex space-x-3 w-full sm:w-auto">
              {isEditing ? (
                <>
                  <button
                    onClick={handleCancel}
                    className="border border-stone-300 text-stone-700 hover:bg-stone-50 px-4 py-2 font-medium transition-colors flex-1 sm:flex-none flex items-center justify-center"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </button>
                  <button
                    onClick={() => setShowSaveConfirm(true)}
                    className="bg-terracotta-500 hover:bg-terracotta-600 text-white px-4 py-2 font-medium transition-colors flex items-center justify-center flex-1 sm:flex-none"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-terracotta-500 hover:bg-terracotta-600 text-white px-4 py-2 font-medium transition-colors flex items-center justify-center w-full sm:w-auto"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <SellerProfileProgress profileData={profileData} />

      {/* Profile Content */}
      <div className="space-y-6">
        <BasicInformation
          isEditing={isEditing}
          onDataChange={(data) => handleDataChange("basicInfo", data)}
        />

        <AddressInformation
          isEditing={isEditing}
          onDataChange={(data) => handleDataChange("addressInfo", data)}
        />

        <BankingTaxInformation
          isEditing={isEditing}
          onDataChange={(data) => handleDataChange("bankingTaxInfo", data)}
        />

        <ShippingLogistics
          isEditing={isEditing}
          onDataChange={(data) =>
            handleDataChange("shippingLogisticsInfo", data)
          }
        />

        <SocialMediaLinks
          isEditing={isEditing}
          onDataChange={(data) => handleDataChange("socialMediaInfo", data)}
        />
      </div>
    </div>
  );
}
