"use client";

import { useState, useRef, useEffect } from "react";
import { Save, Check, FileText, MapPin, Settings } from "lucide-react";
import {
  useGetartistQuery,
  useUpdateartistMutation,
  useUpdateBusinessAddressMutation,
  useUpdateWarehouseAddressMutation,
  useUpdateDocumentsMutation,
  useUpdateSocialLinksMutation,
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
  // Store uploaded files separately
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, File>>({});

  // RTK Query hooks - add the individual mutation hooks
  const {
    data: artistData,
    isLoading,
    error: fetchError,
    refetch,
  } = useGetartistQuery(undefined);
  const [updateArtist, { isLoading: isUpdating }] = useUpdateartistMutation();
  const [updateBusinessAddress, { isLoading: isUpdatingBusinessAddress }] =
    useUpdateBusinessAddressMutation();
  const [updateWarehouseAddress, { isLoading: isUpdatingWarehouseAddress }] =
    useUpdateWarehouseAddressMutation();
  const [updateDocuments, { isLoading: isUpdatingDocuments }] =
    useUpdateDocumentsMutation();
  const [updateSocialLinks, { isLoading: isUpdatingSocialLinks }] =
    useUpdateSocialLinksMutation();

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

  // Add state to track original data for comparison
  const [originalData, setOriginalData] = useState<ProfileData | null>(null);

  // Load existing artist data when available (only once)
  useEffect(() => {
    if (artistData) {
      try {
        const loadedData = {
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
          // Fix: Ensure termsAgreed is always a boolean
          termsAgreed: Boolean(artistData.termsAgreed),
        };

        setProfileData(loadedData);
        setOriginalData(loadedData); // Store original data for comparison
        toast.success("Profile data loaded successfully");
      } catch (err) {
        console.error("Error loading artist data:", err);
        toast.error("Failed to load profile data. Please refresh the page.");
      }
    }
  }, [artistData]);

  // Helper function to check if data has changed
  const hasDataChanged = (currentData: any, originalData: any): boolean => {
    return JSON.stringify(currentData) !== JSON.stringify(originalData);
  };

  // Helper function to get only changed fields
  const getChangedFields = (currentData: any, originalData: any): any => {
    const changes: any = {};

    for (const key in currentData) {
      if (
        typeof currentData[key] === "object" &&
        currentData[key] !== null &&
        !Array.isArray(currentData[key])
      ) {
        // Handle nested objects
        const nestedChanges = getChangedFields(
          currentData[key],
          originalData?.[key] || {}
        );
        if (Object.keys(nestedChanges).length > 0) {
          changes[key] = nestedChanges;
        }
      } else if (
        JSON.stringify(currentData[key]) !== JSON.stringify(originalData?.[key])
      ) {
        // Handle primitive values and arrays
        changes[key] = currentData[key];
      }
    }

    return changes;
  };

  // Function to validate step data
  const validateStep = (stepNumber: number): boolean => {
    try {
      switch (stepNumber) {
        case 1:
          if (!profileData.fullName?.trim()) {
            toast.error("Full name is required");
            return false;
          }
          if (!profileData.storeName?.trim()) {
            toast.error("Store name is required");
            return false;
          }
          if (!profileData.email?.trim()) {
            toast.error("Email is required");
            return false;
          }
          if (!profileData.mobile?.trim()) {
            toast.error("Mobile number is required");
            return false;
          }
          if (!profileData.businessType?.trim()) {
            toast.error("Business type is required");
            return false;
          }
          if (!profileData.businessRegistrationNumber?.trim()) {
            toast.error("Business registration number is required");
            return false;
          }
          if (
            !Array.isArray(profileData.productCategories) ||
            profileData.productCategories.length === 0
          ) {
            toast.error("At least one product category is required");
            return false;
          }
          break;

        case 2:
          if (!profileData.businessAddress?.street?.trim()) {
            toast.error("Business street address is required");
            return false;
          }
          if (!profileData.businessAddress?.city?.trim()) {
            toast.error("Business city is required");
            return false;
          }
          if (!profileData.businessAddress?.state?.trim()) {
            toast.error("Business state is required");
            return false;
          }
          if (!profileData.businessAddress?.country?.trim()) {
            toast.error("Business country is required");
            return false;
          }
          if (!profileData.businessAddress?.pinCode?.trim()) {
            toast.error("Business PIN code is required");
            return false;
          }
          if (!profileData.bankAccountName?.trim()) {
            toast.error("Bank account name is required");
            return false;
          }
          if (!profileData.bankName?.trim()) {
            toast.error("Bank name is required");
            return false;
          }
          if (!profileData.accountNumber?.trim()) {
            toast.error("Account number is required");
            return false;
          }
          if (!profileData.ifscCode?.trim()) {
            toast.error("IFSC code is required");
            return false;
          }
          if (!profileData.panNumber?.trim()) {
            toast.error("PAN number is required");
            return false;
          }
          break;

        case 3:
          if (!profileData.shippingType?.trim()) {
            toast.error("Shipping type is required");
            return false;
          }
          if (!profileData.inventoryVolume?.trim()) {
            toast.error("Inventory volume is required");
            return false;
          }
          if (!profileData.supportContact?.trim()) {
            toast.error("Support contact is required");
            return false;
          }
          if (
            !Array.isArray(profileData.serviceAreas) ||
            profileData.serviceAreas.length === 0
          ) {
            toast.error("At least one service area is required");
            return false;
          }
          if (!profileData.termsAgreed) {
            toast.error("You must agree to the terms and conditions");
            return false;
          }
          break;
      }
      return true;
    } catch (error) {
      console.error("Validation error:", error);
      toast.error("Validation failed. Please check your inputs.");
      return false;
    }
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
    if (!value?.trim()) {
      toast.error("Please enter a valid value");
      return;
    }

    try {
      const currentArray = profileData[field] as string[];
      if (currentArray.includes(value.trim())) {
        toast.error("This item already exists");
        return;
      }

      const updates = {
        [field]: [...currentArray, value.trim()],
      };

      setProfileData((prev) => ({
        ...prev,
        ...updates,
      }));
      toast.success("Item added successfully");
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
      toast.success("Item removed successfully");
    } catch (error) {
      console.error("Failed to remove item:", error);
      toast.error("Failed to remove item");
    }
  };

  // Prepare data for API submission with proper type conversion
  const prepareDataForSubmission = (data: ProfileData) => {
    try {
      return {
        ...data,
        // Ensure boolean fields are properly converted - be more explicit
        termsAgreed: data.termsAgreed === true,
        warehouseAddress: {
          ...data.warehouseAddress,
          sameAsBusiness: data.warehouseAddress.sameAsBusiness === true,
        },
        // Ensure arrays are properly formatted
        productCategories: Array.isArray(data.productCategories)
          ? data.productCategories
          : [],
        serviceAreas: Array.isArray(data.serviceAreas) ? data.serviceAreas : [],
        // Remove any undefined or null values that might cause issues
        businessLogo: data.businessLogo || "",
        upiId: data.upiId || "",
        gstNumber: data.gstNumber || "",
        workingHours: data.workingHours || "",
        returnPolicy: data.returnPolicy || "",
      };
    } catch (error) {
      console.error("Error preparing data for submission:", error);
      throw new Error("Failed to prepare data for submission");
    }
  };

  // Final submit function - only API call happens here
  const handleSubmit = async () => {
    try {
      // Validate all steps before submission
      for (let i = 1; i <= 3; i++) {
        if (!validateStep(i)) {
          setStep(i);
          return;
        }
      }

      const submissionData = prepareDataForSubmission(profileData);

      // Debug: Log the data being sent
      console.log("Submitting data:", {
        termsAgreed: submissionData.termsAgreed,
        termsAgreedType: typeof submissionData.termsAgreed,
        warehouseAddress: submissionData.warehouseAddress,
      });

      // Check if we have any files to upload
      if (Object.keys(uploadedFiles).length > 0) {
        // Create FormData object for file uploads
        const formData = new FormData();

        // Add all regular data fields to FormData
        Object.entries(submissionData).forEach(([key, value]) => {
          // Handle boolean fields explicitly
          if (key === "termsAgreed") {
            formData.append(key, String(Boolean(value)));
          } else if (typeof value !== "object" || value === null) {
            formData.append(key, String(value));
          }
        });

        // Add arrays as JSON strings
        if (submissionData.productCategories?.length) {
          formData.append(
            "productCategories",
            JSON.stringify(submissionData.productCategories)
          );
        }

        if (submissionData.serviceAreas?.length) {
          formData.append(
            "serviceAreas",
            JSON.stringify(submissionData.serviceAreas)
          );
        }

        // Add nested objects as JSON strings
        if (submissionData.businessAddress) {
          formData.append(
            "businessAddress",
            JSON.stringify(submissionData.businessAddress)
          );
        }

        if (submissionData.warehouseAddress) {
          formData.append(
            "warehouseAddress",
            JSON.stringify(submissionData.warehouseAddress)
          );
        }

        if (submissionData.socialLinks) {
          formData.append(
            "socialLinks",
            JSON.stringify(submissionData.socialLinks)
          );
        }

        // Add files to FormData
        Object.entries(uploadedFiles).forEach(([fieldName, file]) => {
          formData.append(fieldName, file);
        });

        // Send FormData to the API
        await updateArtist(formData).unwrap();
      } else {
        // No files to upload, send regular JSON data
        console.log("Final submission data:", submissionData);
        await updateArtist(submissionData).unwrap();
      }

      toast.success("Profile submitted successfully!");
      // Optionally redirect or refresh data
      refetch();
    } catch (err: any) {
      console.error("Failed to submit profile:", err);

      // Handle specific error types
      if (err?.status === 400) {
        toast.error("Invalid data provided. Please check your inputs.");
      } else if (err?.status === 401) {
        toast.error("You are not authorized. Please log in again.");
      } else if (err?.status === 500) {
        toast.error("Server error. Please try again later.");
      } else {
        toast.error(
          err?.data?.message || "Failed to submit profile. Please try again."
        );
      }
    }
  };

  const scrollToTop = () => {
    formRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  // Replace the placeholder save functions with actual implementations:
  const saveStep1Data = async (): Promise<boolean> => {
    try {
      if (!validateStep(1)) {
        return false;
      }

      if (!originalData) {
        toast.error("Original data not loaded yet");
        return false;
      }

      // Prepare Step 1 data
      const step1Data = {
        fullName: profileData.fullName,
        storeName: profileData.storeName,
        email: profileData.email,
        mobile: profileData.mobile,
        businessType: profileData.businessType,
        businessRegistrationNumber: profileData.businessRegistrationNumber,
        productCategories: profileData.productCategories,
      };

      const originalStep1Data = {
        fullName: originalData.fullName,
        storeName: originalData.storeName,
        email: originalData.email,
        mobile: originalData.mobile,
        businessType: originalData.businessType,
        businessRegistrationNumber: originalData.businessRegistrationNumber,
        productCategories: originalData.productCategories,
      };

      // Check if data has changed
      if (
        !hasDataChanged(step1Data, originalStep1Data) &&
        Object.keys(uploadedFiles).length === 0
      ) {
        toast.success("No changes detected in Step 1");
        return true;
      }

      // Check if we have files to upload (business logo)
      if (Object.keys(uploadedFiles).length > 0) {
        const formData = new FormData();

        // Add all step 1 fields to FormData
        Object.entries(step1Data).forEach(([key, value]) => {
          if (key === "productCategories") {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, String(value));
          }
        });

        // Add files to FormData
        Object.entries(uploadedFiles).forEach(([fieldName, file]) => {
          formData.append(fieldName, file);
        });

        await updateArtist(formData).unwrap();
      } else {
        // Get only changed fields
        const changedFields = getChangedFields(step1Data, originalStep1Data);
        if (Object.keys(changedFields).length > 0) {
          await updateArtist(changedFields).unwrap();
        }
      }

      // Update original data after successful save
      setOriginalData((prev) => (prev ? { ...prev, ...step1Data } : null));
      toast.success("Step 1 data saved successfully!");
      refetch();
      return true;
    } catch (err: any) {
      console.error("Failed to save Step 1 data:", err);
      toast.error(err?.data?.message || "Failed to save Step 1 data");
      return false;
    }
  };

  const saveStep2Data = async (): Promise<boolean> => {
    try {
      if (!validateStep(2)) {
        return false;
      }

      if (!originalData) {
        toast.error("Original data not loaded yet");
        return false;
      }

      let hasChanges = false;

      // Check and save business address
      if (
        hasDataChanged(
          profileData.businessAddress,
          originalData.businessAddress
        )
      ) {
        try {
          await updateBusinessAddress(profileData.businessAddress).unwrap();
          toast.success("Business address saved!");
          hasChanges = true;
        } catch (err: any) {
          console.error("Failed to save business address:", err);
          toast.error("Failed to save business address");
          return false;
        }
      }

      // Check and save warehouse address
      if (
        hasDataChanged(
          profileData.warehouseAddress,
          originalData.warehouseAddress
        )
      ) {
        try {
          await updateWarehouseAddress(profileData.warehouseAddress).unwrap();
          toast.success("Warehouse address saved!");
          hasChanges = true;
        } catch (err: any) {
          console.error("Failed to save warehouse address:", err);
          toast.error("Failed to save warehouse address");
          return false;
        }
      }

      // Check and save banking and tax details
      const bankingData = {
        bankAccountName: profileData.bankAccountName,
        bankName: profileData.bankName,
        accountNumber: profileData.accountNumber,
        ifscCode: profileData.ifscCode,
        upiId: profileData.upiId,
        gstNumber: profileData.gstNumber,
        panNumber: profileData.panNumber,
      };

      const originalBankingData = {
        bankAccountName: originalData.bankAccountName,
        bankName: originalData.bankName,
        accountNumber: originalData.accountNumber,
        ifscCode: originalData.ifscCode,
        upiId: originalData.upiId,
        gstNumber: originalData.gstNumber,
        panNumber: originalData.panNumber,
      };

      if (hasDataChanged(bankingData, originalBankingData)) {
        try {
          const changedFields = getChangedFields(
            bankingData,
            originalBankingData
          );
          await updateArtist(changedFields).unwrap();
          toast.success("Banking details saved!");
          hasChanges = true;
        } catch (err: any) {
          console.error("Failed to save banking details:", err);
          toast.error("Failed to save banking details");
          return false;
        }
      }

      if (!hasChanges) {
        toast.success("No changes detected in Step 2");
      } else {
        // Update original data after successful save
        setOriginalData((prev) =>
          prev
            ? {
                ...prev,
                businessAddress: profileData.businessAddress,
                warehouseAddress: profileData.warehouseAddress,
                ...bankingData,
              }
            : null
        );
        toast.success("Step 2 data saved successfully!");
      }

      refetch();
      return true;
    } catch (err: any) {
      console.error("Failed to save Step 2 data:", err);
      toast.error("Failed to save Step 2 data");
      return false;
    }
  };

  const saveStep3Data = async (): Promise<boolean> => {
    try {
      if (!validateStep(3)) {
        return false;
      }

      if (!originalData) {
        toast.error("Original data not loaded yet");
        return false;
      }

      let hasChanges = false;

      // Check and save social links
      if (hasDataChanged(profileData.socialLinks, originalData.socialLinks)) {
        try {
          await updateSocialLinks(profileData.socialLinks).unwrap();
          toast.success("Social links saved!");
          hasChanges = true;
        } catch (err: any) {
          console.error("Failed to save social links:", err);
          toast.error("Failed to save social links");
          return false;
        }
      }

      // Check and save preferences and logistics data
      const preferencesData = {
        shippingType: profileData.shippingType,
        inventoryVolume: profileData.inventoryVolume,
        supportContact: profileData.supportContact,
        workingHours: profileData.workingHours,
        serviceAreas: profileData.serviceAreas,
        returnPolicy: profileData.returnPolicy,
        termsAgreed: profileData.termsAgreed,
      };

      const originalPreferencesData = {
        shippingType: originalData.shippingType,
        inventoryVolume: originalData.inventoryVolume,
        supportContact: originalData.supportContact,
        workingHours: originalData.workingHours,
        serviceAreas: originalData.serviceAreas,
        returnPolicy: originalData.returnPolicy,
        termsAgreed: originalData.termsAgreed,
      };

      if (hasDataChanged(preferencesData, originalPreferencesData)) {
        try {
          const changedFields = getChangedFields(
            preferencesData,
            originalPreferencesData
          );
          await updateArtist(changedFields).unwrap();
          toast.success("Preferences saved!");
          hasChanges = true;
        } catch (err: any) {
          console.error("Failed to save preferences:", err);
          toast.error("Failed to save preferences");
          return false;
        }
      }

      if (!hasChanges) {
        toast.success("No changes detected in Step 3");
      } else {
        // Update original data after successful save
        setOriginalData((prev) =>
          prev
            ? {
                ...prev,
                socialLinks: profileData.socialLinks,
                ...preferencesData,
              }
            : null
        );
        toast.success("Step 3 data saved successfully!");
      }

      refetch();
      return true;
    } catch (err: any) {
      console.error("Failed to save Step 3 data:", err);
      toast.error("Failed to save Step 3 data");
      return false;
    }
  };

  const nextStep = async () => {
    if (validateStep(step)) {
      // Save current step data before proceeding
      let saveSuccess = true;

      if (step === 1) {
        saveSuccess = await saveStep1Data();
      } else if (step === 2) {
        saveSuccess = await saveStep2Data();
      } else if (step === 3) {
        saveSuccess = await saveStep3Data();
      }

      if (saveSuccess && step < 4) {
        setStep(step + 1);
        setTimeout(() => scrollToTop(), 100);
        toast.success(`Step ${step} completed successfully`);
      }
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
            setUploadedFiles={setUploadedFiles}
            onSave={saveStep1Data}
            isLoading={isUpdating}
          />
        )}
        {step === 2 && (
          <Step2AddressBanking
            data={profileData}
            updateData={updateProfileData}
            updateNestedField={updateNestedField}
            onSave={saveStep2Data}
            isLoading={
              isUpdatingBusinessAddress ||
              isUpdatingWarehouseAddress ||
              isUpdating
            }
          />
        )}
        {step === 3 && (
          <Step3PreferencesLogistics
            data={profileData}
            updateData={updateProfileData}
            updateNestedField={updateNestedField}
            addToArray={addToArray}
            removeFromArray={removeFromArray}
            onSave={saveStep3Data}
            isLoading={isUpdatingSocialLinks || isUpdating}
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
