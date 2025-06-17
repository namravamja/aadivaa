"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { User, Edit, Save, X, Camera, Check } from "lucide-react";
import ReactCrop, {
  type Crop,
  centerCrop,
  makeAspectCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import {
  useGetBuyerQuery,
  useUpdateBuyerMutation,
} from "@/services/api/buyerApi";
import { toast } from "react-hot-toast";
import SafeImage from "./SafeImage";

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

// Function to create a centered crop with a specific aspect ratio
function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

// Function to get cropped image as File
async function getCroppedImg(
  image: HTMLImageElement,
  crop: Crop,
  fileName = "cropped-image.jpg"
): Promise<File> {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("No 2d context");
  }

  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  // Set the canvas size to the crop size
  canvas.width = crop.width * scaleX;
  canvas.height = crop.height * scaleY;

  // Draw the cropped image onto the canvas
  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    canvas.width,
    canvas.height
  );

  // Convert canvas to blob
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Canvas is empty"));
          return;
        }

        // Create a File from the blob
        const file = new File([blob], fileName, {
          type: "image/jpeg",
          lastModified: Date.now(),
        });

        resolve(file);
      },
      "image/jpeg",
      0.95
    );
  });
}

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

  // Image cropping states
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [croppedImageFile, setCroppedImageFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<Crop | null>(null);
  const [imgSrc, setImgSrc] = useState("");
  const imgRef = useRef<HTMLImageElement>(null);

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
      croppedImageFile !== null
    );
  };

  const handleSave = async () => {
    try {
      // Create FormData object for multipart/form-data submission
      const formDataToSend = new FormData();

      // Add text fields to FormData
      formDataToSend.append("firstName", formData.firstName);
      formDataToSend.append("lastName", formData.lastName);
      formDataToSend.append("phone", formData.phone || "");
      formDataToSend.append("gender", formData.gender || "");

      // Add cropped image file if available
      if (croppedImageFile) {
        formDataToSend.append(
          "avatar",
          croppedImageFile,
          croppedImageFile.name
        );
      }

      // Handle date of birth
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

        if (formattedDate) {
          formDataToSend.append("dateOfBirth", formattedDate);
        }
      }

      const result = await updateBuyer(formDataToSend).unwrap();

      // Reset states
      setIsEditing(false);
      setOriginalFile(null);
      setCroppedImageFile(null);
      setAvatarPreview(null);
      setShowCropper(false);
      setImgSrc("");
      setCompletedCrop(null);

      // Update form data with response
      if (result && result.avatar) {
        setFormData((prev) => ({ ...prev, avatar: result.avatar }));
        setOriginalData((prev) => ({ ...prev, avatar: result.avatar }));
      } else {
        setOriginalData(formData);
      }

      setShowSaveConfirm(false);
      toast.success("Profile updated successfully");
      refetch();
    } catch (error: any) {
      console.error("=== SAVE ERROR ===", error);
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
    setOriginalFile(null);
    setCroppedImageFile(null);
    setAvatarPreview(null);
    setShowCropper(false);
    setImgSrc("");
    setCompletedCrop(null);
    setShowCancelConfirm(false);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log("Selected file:", file.name, file.type, file.size);

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

      setOriginalFile(file);

      // Read the file and set the image source for cropping
      const reader = new FileReader();
      reader.onload = (e) => {
        setImgSrc(e.target?.result as string);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle image load to set initial crop
  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height, 1));
  };

  // Handle crop completion
  const handleCropComplete = async () => {
    if (!completedCrop || !imgRef.current || !originalFile) {
      toast.error("Please select an area to crop");
      return;
    }

    try {
      // Get the cropped image as a File
      const croppedFile = await getCroppedImg(
        imgRef.current,
        completedCrop,
        `cropped-${originalFile.name}`
      );

      // Set the cropped file
      setCroppedImageFile(croppedFile);

      // Create preview URL
      const previewUrl = URL.createObjectURL(croppedFile);
      setAvatarPreview(previewUrl);
      setShowCropper(false);

      toast.success("Image cropped successfully!");
    } catch (error) {
      console.error("=== CROP ERROR ===", error);
      toast.error("Failed to crop image. Please try again.");
    }
  };

  const handleRetry = () => {
    refetch();
  };

  useEffect(() => {
    return () => {
      // Clean up any created object URLs to prevent memory leaks
      if (avatarPreview && avatarPreview.startsWith("blob:")) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

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
              className="bg-terracotta-500 hover:bg-terracotta-600 text-white px-4 py-2 font-medium transition-colors hover:opacity-80 cursor-pointer"
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
            className="border border-stone-300 text-stone-700 hover:bg-stone-50 px-4 py-2 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-80 cursor-pointer"
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
                  className="flex-1 border border-stone-300 text-stone-700 hover:bg-stone-50 disabled:opacity-50 px-4 py-2 font-medium transition-colors hover:opacity-80 cursor-pointer"
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
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 font-medium transition-colors hover:opacity-80 cursor-pointer"
                >
                  Discard Changes
                </button>
                <button
                  onClick={() => setShowCancelConfirm(false)}
                  className="flex-1 border border-stone-300 text-stone-700 hover:bg-stone-50 px-4 py-2 font-medium transition-colors hover:opacity-80 cursor-pointer"
                >
                  Keep Editing
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Image Cropper Modal */}
        {showCropper && (
          <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
              <h3 className="text-lg font-semibold text-stone-900 mb-4">
                Crop Your Image
              </h3>
              <div className="flex flex-col items-center">
                <div className="max-h-[60vh] overflow-auto mb-4">
                  {imgSrc && (
                    <ReactCrop
                      crop={crop}
                      onChange={(c) => setCrop(c)}
                      onComplete={(c) => setCompletedCrop(c)}
                      aspect={1}
                      circularCrop
                    >
                      <img
                        ref={imgRef}
                        alt="Crop me"
                        src={imgSrc || "/placeholder.svg"}
                        onLoad={onImageLoad}
                        className="max-w-full"
                      />
                    </ReactCrop>
                  )}
                </div>

                <div className="flex space-x-3 mt-4">
                  <button
                    onClick={handleCropComplete}
                    className="bg-terracotta-500 hover:bg-terracotta-600 text-white px-4 py-2 font-medium transition-colors hover:opacity-80 cursor-pointer flex items-center"
                    disabled={!completedCrop}
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Apply Crop
                  </button>
                  <button
                    onClick={() => {
                      setShowCropper(false);
                      setImgSrc("");
                      setOriginalFile(null);
                    }}
                    className="border border-stone-300 text-stone-700 hover:bg-stone-50 px-4 py-2 font-medium transition-colors hover:opacity-80 cursor-pointer flex items-center"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Profile Photo */}
        <div className="flex items-center space-x-6">
          <div className="relative w-20 h-20 bg-stone-200 rounded-full flex items-center justify-center overflow-hidden">
            {avatarPreview ? (
              <img
                src={avatarPreview || "/Profile.jpg"}
                alt={`${formData.firstName} ${formData.lastName}`}
                className="w-full h-full object-cover"
              />
            ) : formData.avatar ? (
              <SafeImage
                src={formData.avatar}
                alt={`${formData.firstName} ${formData.lastName}`}
                width={80}
                height={80}
                className="w-full h-full object-cover rounded-full"
                fallback="/Profile.jpg"
                initials={`${formData.firstName?.[0] || ""}${
                  formData.lastName?.[0] || ""
                }`}
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
              {croppedImageFile && (
                <p className="text-xs text-green-600 mt-1">
                  ✓ Image cropped and ready to upload (
                  {Math.round(croppedImageFile.size / 1024)}KB)
                </p>
              )}
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
              disabled={true} // Email should not be editable
              className="w-full px-3 py-2 border border-stone-300 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent disabled:bg-stone-50 disabled:text-stone-500 transition-colors"
              placeholder="Enter your email address"
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-stone-700 mb-1"
            >
              Phone Number
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
              className="border border-stone-300 text-stone-700 hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 font-medium transition-colors hover:opacity-80 cursor-pointer"
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
