"use client";

import { Upload, X, Plus } from "lucide-react";
import type { ProfileData } from "../page";

interface Step3Props {
  profileData: ProfileData;
  handleInputChange: (field: string, value: any) => void;
  handleNestedInputChange: (
    parent: keyof ProfileData,
    field: string,
    value: any
  ) => void;
  handleArrayAdd: (field: keyof ProfileData, value: string) => void;
  handleArrayRemove: (field: keyof ProfileData, index: number) => void;
}

export default function Step3PreferencesLogistics({
  profileData,
  handleInputChange,
  handleNestedInputChange,
  handleArrayAdd,
  handleArrayRemove,
}: Step3Props) {
  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-light text-stone-900 mb-4 sm:mb-6">
        Preferences, Logistics & Agreement
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Preferred Shipping Type <span className="text-red-500">*</span>
          </label>
          <select
            value={profileData.shippingType}
            onChange={(e) => handleInputChange("shippingType", e.target.value)}
            className="w-full px-4 py-3 border border-stone-300 rounded-md focus:border-terracotta-500 focus:outline-none focus:ring-1 focus:ring-terracotta-500"
            required
          >
            <option value="">Select Shipping Type</option>
            <option value="Self">Self Fulfilled</option>
            <option value="Platform">Platform Fulfilled</option>
            <option value="Both">Both</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Estimated Inventory Volume <span className="text-red-500">*</span>
          </label>
          <select
            value={profileData.inventoryVolume}
            onChange={(e) =>
              handleInputChange("inventoryVolume", e.target.value)
            }
            className="w-full px-4 py-3 border border-stone-300 rounded-md focus:border-terracotta-500 focus:outline-none focus:ring-1 focus:ring-terracotta-500"
            required
          >
            <option value="">Select Volume</option>
            <option value="1-10">1-10 items</option>
            <option value="11-50">11-50 items</option>
            <option value="51-100">51-100 items</option>
            <option value="101-500">101-500 items</option>
            <option value="500+">500+ items</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Support Contact Info <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={profileData.supportContact}
            onChange={(e) =>
              handleInputChange("supportContact", e.target.value)
            }
            className="w-full px-4 py-3 border border-stone-300 rounded-md focus:border-terracotta-500 focus:outline-none focus:ring-1 focus:ring-terracotta-500"
            placeholder="Email or phone number"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Working Hours (optional)
          </label>
          <input
            type="text"
            value={profileData.workingHours}
            onChange={(e) => handleInputChange("workingHours", e.target.value)}
            className="w-full px-4 py-3 border border-stone-300 rounded-md focus:border-terracotta-500 focus:outline-none focus:ring-1 focus:ring-terracotta-500"
            placeholder="e.g., Mon-Fri: 9AM-5PM"
          />
        </div>
      </div>

      <div className="mb-6 sm:mb-8">
        <label className="block text-sm font-medium text-stone-700 mb-2">
          Service Areas <span className="text-red-500">*</span>
        </label>
        <div className="flex flex-wrap gap-2 mb-3">
          {profileData.serviceAreas.map((area, index) => (
            <span
              key={index}
              className="bg-sage-100 text-sage-700 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm flex items-center"
            >
              {area}
              <button
                onClick={() => handleArrayRemove("serviceAreas", index)}
                className="ml-1 sm:ml-2 text-sage-500 hover:text-sage-700"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-0">
          <input
            type="text"
            placeholder="Add a service area (e.g., Local, National, International, or specific regions)"
            className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border border-stone-300 rounded-md focus:border-terracotta-500 focus:outline-none focus:ring-1 focus:ring-terracotta-500"
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
            onClick={(e) => {
              const input = e.currentTarget
                .previousElementSibling as HTMLInputElement;
              handleArrayAdd("serviceAreas", input.value);
              input.value = "";
            }}
            className="sm:ml-2 bg-sage-600 text-white px-4 py-2 sm:py-3 rounded-md hover:bg-sage-700 transition-colors"
          >
            <Plus className="w-4 h-4 mx-auto" />
          </button>
        </div>
      </div>

      <div className="mb-8">
        <label className="block text-sm font-medium text-stone-700 mb-2">
          Return Handling Policy (optional)
        </label>
        <textarea
          value={profileData.returnPolicy}
          onChange={(e) => handleInputChange("returnPolicy", e.target.value)}
          rows={4}
          className="w-full px-4 py-3 border border-stone-300 rounded-md focus:border-terracotta-500 focus:outline-none focus:ring-1 focus:ring-terracotta-500"
          placeholder="Describe your return policy..."
        />
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-medium text-stone-900 mb-4">
          Social Media & Website Links (optional)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Website
            </label>
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
              className="w-full px-4 py-3 border border-stone-300 rounded-md focus:border-terracotta-500 focus:outline-none focus:ring-1 focus:ring-terracotta-500"
              placeholder="https://your-website.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Instagram
            </label>
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
              className="w-full px-4 py-3 border border-stone-300 rounded-md focus:border-terracotta-500 focus:outline-none focus:ring-1 focus:ring-terracotta-500"
              placeholder="@username"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Facebook
            </label>
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
              className="w-full px-4 py-3 border border-stone-300 rounded-md focus:border-terracotta-500 focus:outline-none focus:ring-1 focus:ring-terracotta-500"
              placeholder="Page name or URL"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Twitter
            </label>
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
              className="w-full px-4 py-3 border border-stone-300 rounded-md focus:border-terracotta-500 focus:outline-none focus:ring-1 focus:ring-terracotta-500"
              placeholder="@username"
            />
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-center">
          <input
            id="terms"
            name="terms"
            type="checkbox"
            checked={profileData.termsAgreed}
            onChange={(e) => handleInputChange("termsAgreed", e.target.checked)}
            className="h-4 w-4 text-terracotta-600 focus:ring-terracotta-500 border-stone-300 rounded"
            required
          />
          <label htmlFor="terms" className="ml-2 block text-sm text-stone-700">
            I agree to the{" "}
            <a
              href="#"
              className="text-terracotta-600 hover:text-terracotta-500"
            >
              Terms and Conditions
            </a>{" "}
            and{" "}
            <a
              href="#"
              className="text-terracotta-600 hover:text-terracotta-500"
            >
              Seller Agreement
            </a>
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-700 mb-2">
          Digital Signature (optional)
        </label>
        <div className="mt-1 flex justify-center px-3 sm:px-6 pt-3 sm:pt-5 pb-3 sm:pb-6 border-2 border-dashed border-stone-300 rounded-md">
          <div className="space-y-1 text-center">
            <Upload className="mx-auto h-6 sm:h-8 w-6 sm:w-8 text-stone-400" />
            <div className="flex flex-col sm:flex-row text-sm text-stone-600 justify-center">
              <label
                htmlFor="signature-upload"
                className="relative cursor-pointer rounded-md font-medium text-terracotta-600 hover:text-terracotta-500"
              >
                <span>Upload a file</span>
                <input
                  id="signature-upload"
                  name="signature-upload"
                  type="file"
                  className="sr-only"
                />
              </label>
              <p className="sm:pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-stone-500">PNG, JPG up to 2MB</p>
          </div>
        </div>
      </div>
    </div>
  );
}
