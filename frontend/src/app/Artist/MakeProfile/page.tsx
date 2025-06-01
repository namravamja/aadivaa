"use client";

import { useState, useRef } from "react";
import { Save, Check, FileText, MapPin, Settings } from "lucide-react";
import Step1BusinessBasics from "./components/step1-business-basics";
import Step2AddressBanking from "./components/step2-address-banking";
import Step3PreferencesLogistics from "./components/step3-preferences-logistics";
import Step4Summary from "./components/step4-summary";
import ProfileProgress from "./components/ProfileProgress";

// Define the profile data type
export interface ProfileData {
  // Step 1: Seller Account & Business Basics
  fullName: string;
  storeName: string;
  email: string;
  mobile: string;
  password: string;
  confirmPassword: string;
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
  documents: {
    gstCertificate: string;
    panCard: string;
    businessLicense: string;
    canceledCheque: string;
  };

  // Step 3: Preferences, Logistics & Agreement
  shippingType: string;
  serviceAreas: string[];
  inventoryVolume: string;
  supportContact: string;
  returnPolicy: string;
  workingHours: string;
  socialLinks: {
    website: string;
    instagram: string;
    facebook: string;
    twitter: string;
  };
  termsAgreed: boolean;
  digitalSignature: string;
}

export default function MakeProfile() {
  const [step, setStep] = useState(1);
  const [profileData, setProfileData] = useState<ProfileData>({
    // Step 1: Seller Account & Business Basics
    fullName: "",
    storeName: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
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
    documents: {
      gstCertificate: "",
      panCard: "",
      businessLicense: "",
      canceledCheque: "",
    },

    // Step 3: Preferences, Logistics & Agreement
    shippingType: "",
    serviceAreas: [],
    inventoryVolume: "",
    supportContact: "",
    returnPolicy: "",
    workingHours: "",
    socialLinks: {
      website: "",
      instagram: "",
      facebook: "",
      twitter: "",
    },
    termsAgreed: false,
    digitalSignature: "",
  });

  const formRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (field: string, value: any) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNestedInputChange = (
    parent: keyof ProfileData,
    field: string,
    value: any
  ) => {
    setProfileData((prev) => ({
      ...prev,
      [parent]: {
        ...(prev[parent] as Record<string, any>),
        [field]: value,
      } as any,
    }));
  };

  const handleArrayAdd = (field: keyof ProfileData, value: string) => {
    if (value.trim()) {
      setProfileData((prev) => ({
        ...prev,
        [field]: [...(prev[field] as string[]), value.trim()],
      }));
    }
  };

  const handleArrayRemove = (field: keyof ProfileData, index: number) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: (prev[field] as string[]).filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = () => {
    // In a real app, this would save to an API
    console.log("Creating profile:", profileData);
    alert("Profile created successfully!");
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
            profileData={profileData}
            handleInputChange={handleInputChange}
            handleArrayAdd={handleArrayAdd}
            handleArrayRemove={handleArrayRemove}
          />
        )}

        {step === 2 && (
          <Step2AddressBanking
            profileData={profileData}
            handleInputChange={handleInputChange}
            handleNestedInputChange={handleNestedInputChange}
          />
        )}

        {step === 3 && (
          <Step3PreferencesLogistics
            profileData={profileData}
            handleInputChange={handleInputChange}
            handleNestedInputChange={handleNestedInputChange}
            handleArrayAdd={handleArrayAdd}
            handleArrayRemove={handleArrayRemove}
          />
        )}

        {step === 4 && <Step4Summary profileData={profileData} />}

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
              className="px-6 py-2 bg-terracotta-600 text-white rounded-md hover:bg-terracotta-700 transition-colors flex items-center justify-center sm:justify-start w-full sm:w-auto"
            >
              <Save className="w-4 h-4 mr-2" />
              Submit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
