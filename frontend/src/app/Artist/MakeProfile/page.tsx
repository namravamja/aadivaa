"use client";

import { useState, useRef, useEffect } from "react";
import { Save, Check, FileText, MapPin, Settings } from "lucide-react";
import {
  useGetartistQuery,
  useUpdateartistMutation,
} from "@/services/api/artistApi";
import Step1BusinessBasics from "./components/step1-business-basics";
import Step2AddressBanking from "./components/step2-address-banking";
import Step3PreferencesLogistics from "./components/step3-preferences-logistics";
import Step4Summary from "./components/step4-summary";
import ProfileProgress from "./components/ProfileProgress";
import toast from "react-hot-toast";

// Define the complete profile data structure
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

export default function MakeProfile() {
  const [step, setStep] = useState(1);
  const formRef = useRef<HTMLDivElement>(null);

  // RTK Query hooks
  const {
    data: artistData,
    isLoading,
    error: fetchError,
    refetch,
  } = useGetartistQuery(undefined);
  const [updateArtist, { isLoading: isUpdating }] = useUpdateartistMutation();

  console.log(artistData);

  // Centralized profile data state (local only, no API calls on change)
  const [profileData, setProfileData] = useState<ProfileData>({
    // Step 1: Seller Account & Business Basics
    fullName: "",
    storeName: "",
    email: "",
    mobile: "",
    businessType: "",
    businessRegistrationNumber: "",
    productCategories: [],
    businessLogo: "",

    // Step 2: Address, Banking & Tax Details
    businessAddress: {
      street: "",
      city: "",
      state: "",
      country: "",
      pinCode: "",
    },
    warehouseAddress: {
      sameAsBusiness: true,
      street: "",
      city: "",
      state: "",
      country: "",
      pinCode: "",
    },
    bankAccountName: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    upiId: "",
    gstNumber: "",
    panNumber: "",

    // Step 3: Preferences, Logistics & Agreement
    shippingType: "",
    inventoryVolume: "",
    supportContact: "",
    workingHours: "",
    serviceAreas: [],
    returnPolicy: "",
    socialLinks: {
      website: "",
      instagram: "",
      facebook: "",
      twitter: "",
    },
    termsAgreed: false,
  });

  // Load existing artist data when available (only once)
  useEffect(() => {
    if (artistData) {
      try {
        setProfileData({
          fullName: artistData.fullName || "",
          storeName: artistData.storeName || "",
          email: artistData.email || "",
          mobile: artistData.mobile || "",
          businessType: artistData.businessType || "",
          businessRegistrationNumber:
            artistData.businessRegistrationNumber || "",
          productCategories: Array.isArray(artistData.productCategories)
            ? artistData.productCategories
            : [],
          businessLogo: artistData.businessLogo || "",
          businessAddress: {
            street: artistData.businessAddress?.street || "",
            city: artistData.businessAddress?.city || "",
            state: artistData.businessAddress?.state || "",
            country: artistData.businessAddress?.country || "",
            pinCode: artistData.businessAddress?.pinCode || "",
          },
          warehouseAddress: {
            sameAsBusiness: artistData.warehouseAddress?.sameAsBusiness ?? true,
            street: artistData.warehouseAddress?.street || "",
            city: artistData.warehouseAddress?.city || "",
            state: artistData.warehouseAddress?.state || "",
            country: artistData.warehouseAddress?.country || "",
            pinCode: artistData.warehouseAddress?.pinCode || "",
          },
          bankAccountName: artistData.bankAccountName || "",
          bankName: artistData.bankName || "",
          accountNumber: artistData.accountNumber || "",
          ifscCode: artistData.ifscCode || "",
          upiId: artistData.upiId || "",
          gstNumber: artistData.gstNumber || "",
          panNumber: artistData.panNumber || "",
          shippingType: artistData.shippingType || "",
          inventoryVolume: artistData.inventoryVolume || "",
          supportContact: artistData.supportContact || "",
          workingHours: artistData.workingHours || "",
          serviceAreas: Array.isArray(artistData.serviceAreas)
            ? artistData.serviceAreas
            : [],
          returnPolicy: artistData.returnPolicy || "",
          socialLinks: {
            website: artistData.socialLinks?.website || "",
            instagram: artistData.socialLinks?.instagram || "",
            facebook: artistData.socialLinks?.facebook || "",
            twitter: artistData.socialLinks?.twitter || "",
          },
          termsAgreed: artistData.termsAgreed || false,
        });
      } catch (err) {
        console.error("Error loading artist data:", err);
        toast.error("Failed to load profile data. Please refresh the page.");
      }
    }
  }, [artistData]);

  // Function to prepare data for API update
  const prepareUpdateData = (updates: ProfileData) => {
    const updatePayload: any = {};

    // Handle simple fields
    Object.keys(updates).forEach((key) => {
      if (
        key !== "businessAddress" &&
        key !== "warehouseAddress" &&
        key !== "socialLinks"
      ) {
        updatePayload[key] = updates[key as keyof ProfileData];
      }
    });

    // Handle address relations
    if (updates.businessAddress) {
      updatePayload.businessAddress = {
        upsert: {
          create: updates.businessAddress,
          update: updates.businessAddress,
        },
      };
    }

    if (updates.warehouseAddress) {
      updatePayload.warehouseAddress = {
        upsert: {
          create: updates.warehouseAddress,
          update: updates.warehouseAddress,
        },
      };
    }

    // Handle social links relation
    if (updates.socialLinks) {
      updatePayload.socialLinks = {
        upsert: {
          create: updates.socialLinks,
          update: updates.socialLinks,
        },
      };
    }

    return updatePayload;
  };

  // Function to update profile data locally only (no API call)
  const updateProfileData = (updates: Partial<ProfileData>) => {
    try {
      setProfileData((prev) => ({ ...prev, ...updates }));
    } catch (error) {
      console.error("Failed to update profile data:", error);
      toast.error("Failed to update profile data");
    }
  };

  // Function to update nested fields locally only (no API call)
  const updateNestedField = (
    parent: keyof ProfileData,
    field: string,
    value: any
  ) => {
    try {
      const updates = {
        [parent]: {
          ...(profileData[parent] as Record<string, any>),
          [field]: value,
        } as any,
      };

      setProfileData((prev) => ({
        ...prev,
        ...updates,
      }));
    } catch (error) {
      console.error(`Failed to update ${parent}.${field}:`, error);
      toast.error(`Failed to update ${field}`);
    }
  };

  // Function to add to array fields locally only (no API call)
  const addToArray = (field: keyof ProfileData, value: string) => {
    if (!value?.trim()) return;

    try {
      const updates = {
        [field]: [...(profileData[field] as string[]), value.trim()],
      };

      setProfileData((prev) => ({
        ...prev,
        ...updates,
      }));
    } catch (error) {
      console.error("Failed to add item:", error);
      toast.error("Failed to add item");
    }
  };

  // Function to remove from array fields locally only (no API call)
  const removeFromArray = (field: keyof ProfileData, index: number) => {
    try {
      const updates = {
        [field]: (profileData[field] as string[]).filter((_, i) => i !== index),
      };

      setProfileData((prev) => ({
        ...prev,
        ...updates,
      }));
    } catch (error) {
      console.error("Failed to remove item:", error);
      toast.error("Failed to remove item");
    }
  };

  // Final submit function - only API call happens here
  const handleSubmit = async () => {
    try {
      const updatePayload = prepareUpdateData(profileData);
      await updateArtist(updatePayload).unwrap();
      toast.success("Profile submitted successfully!");
    } catch (err: any) {
      console.error("Failed to submit profile:", err);
      toast.error(
        err?.data?.message || "Failed to submit profile. Please try again."
      );
    }
  };

  const scrollToTop = () => {
    formRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const nextStep = () => {
    if (step < 4) {
      setStep(step + 1);
      setTimeout(() => scrollToTop(), 100);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      setTimeout(() => scrollToTop(), 100);
    }
  };

  // Step icons
  const stepIcons = [
    <FileText key="1" className="w-4 h-4 sm:w-6 sm:h-6" />,
    <MapPin key="2" className="w-4 h-4 sm:w-6 sm:h-6" />,
    <Settings key="3" className="w-4 h-4 sm:w-6 sm:h-6" />,
    <Check key="4" className="w-4 h-4 sm:w-6 sm:h-6" />,
  ];

  // Step titles
  const stepTitles = [
    "Seller Account & Business Basics",
    "Address, Banking & Tax Details",
    "Preferences, Logistics & Agreement",
    "Profile Summary",
  ];

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-stone-600">Loading profile data...</div>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <div className="text-lg text-red-600">Error loading profile data</div>
          <button
            onClick={() => {
              refetch();
              toast.error("Please refresh the page or contact support.");
            }}
            className="px-4 py-2 bg-terracotta-600 text-white rounded-md hover:bg-terracotta-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div ref={formRef} className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-light text-stone-900 mb-2">
          Create Seller Profile
        </h1>
        <p className="text-stone-600">
          Complete your seller profile to start selling on our platform
        </p>
      </div>

      <ProfileProgress profileData={profileData} />

      {/* Step Indicators */}
      <div className="mb-6 sm:mb-10">
        <div className="flex justify-between items-center relative">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`flex flex-col items-center relative z-10 ${
                i <= step ? "text-terracotta-600" : "text-stone-400"
              }`}
            >
              <div
                className={`w-8 h-8 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mb-1 sm:mb-2 ${
                  i <= step
                    ? "bg-terracotta-100 text-terracotta-600 border-2 border-terracotta-600"
                    : "bg-stone-100 text-stone-400 border-2 border-stone-300"
                }`}
              >
                {stepIcons[i - 1]}
              </div>
              <div
                className={`text-xs font-medium text-center ${
                  i <= step ? "text-terracotta-600" : "text-stone-400"
                } hidden xs:block`}
              >
                Step {i}
              </div>
              <div
                className={`text-xs sm:text-sm font-medium text-center mt-1 ${
                  i <= step ? "text-terracotta-600" : "text-stone-400"
                } hidden md:block`}
              >
                {stepTitles[i - 1]}
              </div>
            </div>
          ))}

          {/* Progress Line */}
          <div className="absolute top-4 sm:top-6 left-0 right-0 h-0.5 bg-stone-200">
            <div
              className="h-full bg-terracotta-600 transition-all duration-300"
              style={{ width: `${((step - 1) / 3) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white border border-stone-200 p-4 sm:p-6 md:p-8 shadow-sm rounded-md">
        {step === 1 && (
          <Step1BusinessBasics
            data={profileData}
            updateData={updateProfileData}
            addToArray={addToArray}
            removeFromArray={removeFromArray}
          />
        )}
        {step === 2 && (
          <Step2AddressBanking
            data={profileData}
            updateData={updateProfileData}
            updateNestedField={updateNestedField}
          />
        )}
        {step === 3 && (
          <Step3PreferencesLogistics
            data={profileData}
            updateData={updateProfileData}
            updateNestedField={updateNestedField}
            addToArray={addToArray}
            removeFromArray={removeFromArray}
          />
        )}
        {step === 4 && <Step4Summary data={profileData} />}

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 mt-8 pt-6 border-t border-stone-200">
          <button
            onClick={prevStep}
            disabled={step === 1}
            className="px-6 py-2 border border-stone-300 text-stone-700 rounded-md hover:bg-stone-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
          >
            Previous
          </button>

          {step < 4 ? (
            <button
              onClick={nextStep}
              className="px-6 py-2 bg-terracotta-600 text-white rounded-md hover:bg-terracotta-700 transition-colors w-full sm:w-auto"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isUpdating}
              className="px-6 py-2 bg-terracotta-600 text-white rounded-md hover:bg-terracotta-700 transition-colors flex items-center justify-center sm:justify-start w-full sm:w-auto disabled:opacity-50"
            >
              <Save className="w-4 h-4 mr-2" />
              {isUpdating ? "Submitting..." : "Submit Profile"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
