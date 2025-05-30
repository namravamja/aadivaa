"use client";

import type React from "react";

import { useState } from "react";
import { User, Edit, Save, X, Camera } from "lucide-react";
import Image from "next/image";

interface AccountDetailsProps {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    avatar?: string;
    dateOfBirth?: string;
    gender?: string;
  };
  onUpdate: (userData: any) => void;
  isLoading: boolean;
}

export default function AccountDetails({
  user,
  onUpdate,
  isLoading,
}: AccountDetailsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(user);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const handleSave = async () => {
    try {
      // Handle avatar upload if there's a new file
      const avatarUrl = formData.avatar;
      if (avatarFile) {
        // In a real app, upload the file to your storage service
        // avatarUrl = await uploadAvatar(avatarFile)
        console.log("Would upload avatar:", avatarFile);
      }

      await onUpdate({ ...formData, avatar: avatarUrl });
      setIsEditing(false);
      setAvatarFile(null);
      setAvatarPreview(null);
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const handleCancel = () => {
    setFormData(user);
    setIsEditing(false);
    setAvatarFile(null);
    setAvatarPreview(null);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white border border-stone-200 shadow-sm">
      <div className="p-6 border-b border-stone-200">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-medium text-stone-900 flex items-center">
            <User className="w-5 h-5 mr-2" />
            Account Details
          </h2>
          <button
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            disabled={isLoading}
            className="border border-stone-300 text-stone-700 hover:bg-stone-50 px-4 py-2 font-medium transition-colors disabled:opacity-50"
          >
            {isEditing ? (
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
                className="border border-stone-300 text-stone-700 hover:bg-stone-50 px-3 py-1 text-sm font-medium transition-colors cursor-pointer inline-flex items-center"
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
            </div>
          )}
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-stone-300 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent disabled:bg-stone-50 disabled:text-stone-500"
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
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-stone-300 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent disabled:bg-stone-50 disabled:text-stone-500"
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
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-stone-300 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent disabled:bg-stone-50 disabled:text-stone-500"
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
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-stone-300 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent disabled:bg-stone-50 disabled:text-stone-500"
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
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-stone-300 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent disabled:bg-stone-50 disabled:text-stone-500"
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
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-stone-300 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent disabled:bg-stone-50 disabled:text-stone-500"
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
              className="border border-stone-300 text-stone-700 hover:bg-stone-50 px-4 py-2 font-medium transition-colors"
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
