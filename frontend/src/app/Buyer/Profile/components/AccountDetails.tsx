"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { User, Edit, Save, X, Camera } from "lucide-react";
import Image from "next/image";
import {
  useGetBuyerQuery,
  useUpdateBuyerMutation,
} from "@/services/api/buyerApi";
import { toast } from "react-hot-toast";

// Helper functions for date handling
const formatDateForAPI = (dateString: string): string | null => {
  if (!dateString) return null;

  try {
    let date: Date;

    if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const [year, month, day] = dateString.split("-").map(Number);
      date = new Date(year, month - 1, day, 0, 0, 0, 0);
      const utcDate = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
      return utcDate.toISOString();
    } else {
      date = new Date(dateString);
    }

    if (isNaN(date.getTime())) {
      console.error("Invalid date format:", dateString);
      return null;
    }

    return date.toISOString();
  } catch (error) {
    console.error("Error formatting date:", error);
    return null;
  }
};

const formatDateForDisplay = (dateString: string): string => {
  if (!dateString) return "";

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    return date.toISOString().split("T")[0];
  } catch (error) {
    console.error("Error formatting date for display:", error);
    return "";
  }
};

const validateDateOfBirth = (
  dateString: string
): { isValid: boolean; message?: string } => {
  if (!dateString) {
    return { isValid: true };
  }

  try {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      return { isValid: false, message: "Invalid date format" };
    }

    const today = new Date();
    const age = today.getFullYear() - date.getFullYear();

    if (date > today) {
      return {
        isValid: false,
        message: "Date of birth cannot be in the future",
      };
    }

    if (age > 150) {
      return { isValid: false, message: "Please enter a valid date of birth" };
    }

    const monthDiff = today.getMonth() - date.getMonth();
    const actualAge =
      monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())
        ? age - 1
        : age;
    if (actualAge < 13) {
      return { isValid: false, message: "You must be at least 13 years old" };
    }

    return { isValid: true };
  } catch (error) {
    return { isValid: false, message: "Invalid date format" };
  }
};

export default function AccountDetails() {
  const {
    data: buyerData,
    isLoading: isFetching,
    error: fetchError,
    refetch,
  } = useGetBuyerQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const [updateBuyer, { isLoading: isUpdating }] = useUpdateBuyerMutation();

  const [isEditing, setIsEditing] = useState(false);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    avatar: "",
    dateOfBirth: "",
    gender: "",
  });
  const [originalData, setOriginalData] = useState(formData);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // Update local state when API data changes
  useEffect(() => {
    if (buyerData) {
      const newData = {
        id: buyerData.id,
        email: buyerData.email,
        firstName: buyerData.firstName || "",
        lastName: buyerData.lastName || "",
        phone: buyerData.phone || "",
        avatar: buyerData.avatar || "",
        dateOfBirth: buyerData.dateOfBirth
          ? formatDateForDisplay(buyerData.dateOfBirth)
          : "",
        gender: buyerData.gender || "",
      };
      setFormData(newData);
      setOriginalData(newData);
    }
  }, [buyerData]);

  // Check if form has changes
  const hasChanges = () => {
    return (
      JSON.stringify(formData) !== JSON.stringify(originalData) ||
      avatarFile !== null
    );
  };

  const handleSave = async () => {
    try {
      const avatarUrl = formData.avatar;
      if (avatarFile) {
        console.log("Would upload avatar:", avatarFile);
      }

      const updateData: any = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        avatar: avatarUrl,
        gender: formData.gender,
      };

      if (formData.dateOfBirth) {
        const validation = validateDateOfBirth(formData.dateOfBirth);
        if (!validation.isValid) {
          toast.error(validation.message || "Invalid date of birth");
          return;
        }

        const formattedDate = formatDateForAPI(formData.dateOfBirth);
        if (formattedDate === null && formData.dateOfBirth) {
          toast.error("Invalid date format. Please use a valid date.");
          return;
        }

        updateData.dateOfBirth = formattedDate || undefined;
      }

      await updateBuyer(updateData).unwrap();

      setIsEditing(false);
      setAvatarFile(null);
      setAvatarPreview(null);
      setOriginalData(formData);
      setShowSaveConfirm(false);
      toast.success("Profile updated successfully");
    } catch (error: any) {
      console.error("Failed to update profile:", error);

      let errorMessage = "Failed to update profile. Please try again.";
      if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
      setShowSaveConfirm(false);
    }
  };

  const handleCancel = () => {
    if (hasChanges()) {
      setShowCancelConfirm(true);
    } else {
      performCancel();
    }
  };

  const performCancel = () => {
    setFormData(originalData);
    setIsEditing(false);
    setAvatarFile(null);
    setAvatarPreview(null);
    setShowCancelConfirm(false);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file");
        return;
      }

      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRetry = () => {
    refetch();
  };

  // Error state
  if (fetchError && !buyerData) {
    return (
      <div className="bg-white border border-stone-200 shadow-sm">
        <div className="p-6 border-b border-stone-200">
          <h2 className="text-xl font-medium text-stone-900 flex items-center">
            <User className="w-5 h-5 mr-2" />
            Account Details
          </h2>
        </div>
        <div className="p-6">
          <div className="flex flex-col items-center justify-center min-h-[200px] text-center">
            <div className="text-red-600 mb-4">
              <p className="font-medium">Failed to load account details</p>
              <p className="text-sm mt-1">
                {fetchError && "status" in fetchError
                  ? `Error ${fetchError.status}: ${
                      typeof fetchError.data === "object" &&
                      fetchError.data &&
                      "message" in fetchError.data
                        ? (fetchError.data as { message: string }).message
                        : "Unknown error"
                    }`
                  : "Network error occurred"}
              </p>
            </div>
            <button
              onClick={handleRetry}
              className="bg-terracotta-500 hover:bg-terracotta-600 text-white px-4 py-2 font-medium transition-colors hover:opacity-80"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (isFetching && !buyerData) {
    return (
      <div className="bg-white border border-stone-200 shadow-sm">
        <div className="p-6 border-b border-stone-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-medium text-stone-900 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Account Details
            </h2>
            <div className="w-24 h-10 bg-stone-200 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="p-6">
          <div className="flex items-center space-x-6 mb-6">
            <div className="w-20 h-20 bg-stone-200 rounded animate-pulse"></div>
            <div className="w-32 h-8 bg-stone-200 rounded animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index}>
                <div className="w-24 h-4 bg-stone-200 rounded animate-pulse mb-2"></div>
                <div className="w-full h-10 bg-stone-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-stone-200 shadow-sm">
      <div className="p-6 border-b border-stone-200">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-medium text-stone-900 flex items-center">
            <User className="w-5 h-5 mr-2" />
            Account Details
          </h2>
          <button
            onClick={() => {
              if (isEditing) {
                if (hasChanges()) {
                  setShowSaveConfirm(true);
                } else {
                  setIsEditing(false);
                }
              } else {
                setIsEditing(true);
              }
            }}
            disabled={isUpdating}
            className="border border-stone-300 text-stone-700 hover:bg-stone-50 px-4 py-2 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-80"
          >
            {isUpdating ? (
              <>
                <div className="w-4 h-4 mr-2 inline-block animate-spin rounded-full border-2 border-stone-300 border-t-stone-700"></div>
                Saving...
              </>
            ) : isEditing ? (
              <>
                <Save className="w-4 h-4 mr-2 inline" />
                Save Changes
              </>
            ) : (
              <>
                <Edit className="w-4 h-4 mr-2 inline" />
                Edit Profile
              </>
            )}
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
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
                  disabled={isUpdating}
                  className="bg-terracotta-500 hover:bg-terracotta-600 disabled:bg-terracotta-400 text-white px-4 py-2 font-medium transition-colors cursor-pointer disabled:cursor-not-allowed hover:opacity-80 flex-1"
                >
                  {isUpdating ? "Saving..." : "Save Changes"}
                </button>
                <button
                  onClick={() => setShowSaveConfirm(false)}
                  disabled={isUpdating}
                  className="flex-1 border border-stone-300 text-stone-700 hover:bg-stone-50 disabled:opacity-50 px-4 py-2 font-medium transition-colors hover:opacity-80"
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
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 font-medium transition-colors hover:opacity-80"
                >
                  Discard Changes
                </button>
                <button
                  onClick={() => setShowCancelConfirm(false)}
                  className="flex-1 border border-stone-300 text-stone-700 hover:bg-stone-50 px-4 py-2 font-medium transition-colors hover:opacity-80"
                >
                  Keep Editing
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Profile Photo */}
        <div className="flex items-center space-x-6">
          <div className="relative w-20 h-20 bg-stone-200 flex items-center justify-center overflow-hidden">
            {avatarPreview || formData.avatar ? (
              <Image
                src={avatarPreview || formData.avatar || "/placeholder.svg"}
                alt={`${formData.firstName} ${formData.lastName}`}
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-lg font-medium text-stone-600">
                {formData.firstName?.[0] || ""}
                {formData.lastName?.[0] || ""}
              </span>
            )}
          </div>

          {isEditing && (
            <div>
              <label
                htmlFor="avatar-upload"
                className="border border-stone-300 text-stone-700 hover:bg-stone-50 px-3 py-1 text-sm font-medium transition-colors cursor-pointer inline-flex items-center hover:opacity-80"
              >
                <Camera className="w-4 h-4 mr-2" />
                Change Photo
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
              <p className="text-xs text-stone-500 mt-1">
                Max size: 5MB. Formats: JPG, PNG, GIF
              </p>
            </div>
          )}
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-stone-700 mb-1"
            >
              First Name *
            </label>
            <input
              id="firstName"
              type="text"
              value={formData.firstName}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, firstName: e.target.value }))
              }
              disabled={!isEditing || isUpdating}
              className="w-full px-3 py-2 border border-stone-300 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent disabled:bg-stone-50 disabled:text-stone-500 transition-colors"
              placeholder="Enter your first name"
            />
          </div>

          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-stone-700 mb-1"
            >
              Last Name *
            </label>
            <input
              id="lastName"
              type="text"
              value={formData.lastName}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, lastName: e.target.value }))
              }
              disabled={!isEditing || isUpdating}
              className="w-full px-3 py-2 border border-stone-300 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent disabled:bg-stone-50 disabled:text-stone-500 transition-colors"
              placeholder="Enter your last name"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-stone-700 mb-1"
            >
              Email Address *
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              disabled={!isEditing || isUpdating}
              className="w-full px-3 py-2 border border-stone-300 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent disabled:bg-stone-50 disabled:text-stone-500 transition-colors"
              placeholder="Enter your email address"
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-stone-700 mb-1"
            >
              Phone Number *
            </label>
            <input
              id="phone"
              type="tel"
              value={formData.phone || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, phone: e.target.value }))
              }
              disabled={!isEditing || isUpdating}
              className="w-full px-3 py-2 border border-stone-300 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent disabled:bg-stone-50 disabled:text-stone-500 transition-colors"
              placeholder="Enter your phone number"
            />
          </div>

          <div>
            <label
              htmlFor="dateOfBirth"
              className="block text-sm font-medium text-stone-700 mb-1"
            >
              Date of Birth
            </label>
            <input
              id="dateOfBirth"
              type="date"
              value={formData.dateOfBirth || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  dateOfBirth: e.target.value,
                }))
              }
              disabled={!isEditing || isUpdating}
              className="w-full px-3 py-2 border border-stone-300 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent disabled:bg-stone-50 disabled:text-stone-500 transition-colors"
            />
          </div>

          <div>
            <label
              htmlFor="gender"
              className="block text-sm font-medium text-stone-700 mb-1"
            >
              Gender
            </label>
            <select
              id="gender"
              value={formData.gender || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, gender: e.target.value }))
              }
              disabled={!isEditing || isUpdating}
              className="w-full px-3 py-2 border border-stone-300 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent disabled:bg-stone-50 disabled:text-stone-500 transition-colors"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </select>
          </div>
        </div>

        {isEditing && (
          <div className="flex space-x-2 pt-4 border-t border-stone-200">
            <button
              onClick={handleCancel}
              disabled={isUpdating}
              className="border border-stone-300 text-stone-700 hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 font-medium transition-colors hover:opacity-80"
            >
              <X className="w-4 h-4 mr-2 inline" />
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
