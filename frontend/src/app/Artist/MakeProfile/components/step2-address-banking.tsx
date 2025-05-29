"use client";

import { Upload } from "lucide-react";
import type { ProfileData } from "../page";

interface Step2Props {
  profileData: ProfileData;
  handleInputChange: (field: string, value: any) => void;
  handleNestedInputChange: (
    parent: keyof ProfileData,
    field: string,
    value: any
  ) => void;
}

export default function Step2AddressBanking({
  profileData,
  handleInputChange,
  handleNestedInputChange,
}: Step2Props) {
  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-light text-stone-900 mb-4 sm:mb-6">
        Address, Banking & Tax Details
      </h2>

      <div className="mb-8">
        <h3 className="text-base sm:text-lg font-medium text-stone-900 mb-3 sm:mb-4">
          Business Address
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Street Address <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={profileData.businessAddress.street}
              onChange={(e) =>
                handleNestedInputChange(
                  "businessAddress",
                  "street",
                  e.target.value
                )
              }
              className="w-full px-4 py-3 border border-stone-300 rounded-md focus:border-terracotta-500 focus:outline-none focus:ring-1 focus:ring-terracotta-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              City <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={profileData.businessAddress.city}
              onChange={(e) =>
                handleNestedInputChange(
                  "businessAddress",
                  "city",
                  e.target.value
                )
              }
              className="w-full px-4 py-3 border border-stone-300 rounded-md focus:border-terracotta-500 focus:outline-none focus:ring-1 focus:ring-terracotta-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              State <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={profileData.businessAddress.state}
              onChange={(e) =>
                handleNestedInputChange(
                  "businessAddress",
                  "state",
                  e.target.value
                )
              }
              className="w-full px-4 py-3 border border-stone-300 rounded-md focus:border-terracotta-500 focus:outline-none focus:ring-1 focus:ring-terracotta-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Country <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={profileData.businessAddress.country}
              onChange={(e) =>
                handleNestedInputChange(
                  "businessAddress",
                  "country",
                  e.target.value
                )
              }
              className="w-full px-4 py-3 border border-stone-300 rounded-md focus:border-terracotta-500 focus:outline-none focus:ring-1 focus:ring-terracotta-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              PIN Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={profileData.businessAddress.pinCode}
              onChange={(e) =>
                handleNestedInputChange(
                  "businessAddress",
                  "pinCode",
                  e.target.value
                )
              }
              className="w-full px-4 py-3 border border-stone-300 rounded-md focus:border-terracotta-500 focus:outline-none focus:ring-1 focus:ring-terracotta-500"
              required
            />
          </div>
        </div>
      </div>

      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 sm:mb-4 gap-2 sm:gap-0">
          <h3 className="text-base sm:text-lg font-medium text-stone-900">
            Warehouse / Pickup Address
          </h3>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="sameAsBusiness"
              checked={profileData.warehouseAddress.sameAsBusiness}
              onChange={(e) =>
                handleNestedInputChange(
                  "warehouseAddress",
                  "sameAsBusiness",
                  e.target.checked
                )
              }
              className="h-4 w-4 text-terracotta-600 focus:ring-terracotta-500 border-stone-300 rounded"
            />
            <label
              htmlFor="sameAsBusiness"
              className="ml-2 text-sm text-stone-700"
            >
              Same as Business Address
            </label>
          </div>
        </div>

        {!profileData.warehouseAddress.sameAsBusiness && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Street Address
              </label>
              <input
                type="text"
                value={profileData.warehouseAddress.street}
                onChange={(e) =>
                  handleNestedInputChange(
                    "warehouseAddress",
                    "street",
                    e.target.value
                  )
                }
                className="w-full px-4 py-3 border border-stone-300 rounded-md focus:border-terracotta-500 focus:outline-none focus:ring-1 focus:ring-terracotta-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                City
              </label>
              <input
                type="text"
                value={profileData.warehouseAddress.city}
                onChange={(e) =>
                  handleNestedInputChange(
                    "warehouseAddress",
                    "city",
                    e.target.value
                  )
                }
                className="w-full px-4 py-3 border border-stone-300 rounded-md focus:border-terracotta-500 focus:outline-none focus:ring-1 focus:ring-terracotta-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                State
              </label>
              <input
                type="text"
                value={profileData.warehouseAddress.state}
                onChange={(e) =>
                  handleNestedInputChange(
                    "warehouseAddress",
                    "state",
                    e.target.value
                  )
                }
                className="w-full px-4 py-3 border border-stone-300 rounded-md focus:border-terracotta-500 focus:outline-none focus:ring-1 focus:ring-terracotta-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Country
              </label>
              <input
                type="text"
                value={profileData.warehouseAddress.country}
                onChange={(e) =>
                  handleNestedInputChange(
                    "warehouseAddress",
                    "country",
                    e.target.value
                  )
                }
                className="w-full px-4 py-3 border border-stone-300 rounded-md focus:border-terracotta-500 focus:outline-none focus:ring-1 focus:ring-terracotta-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                PIN Code
              </label>
              <input
                type="text"
                value={profileData.warehouseAddress.pinCode}
                onChange={(e) =>
                  handleNestedInputChange(
                    "warehouseAddress",
                    "pinCode",
                    e.target.value
                  )
                }
                className="w-full px-4 py-3 border border-stone-300 rounded-md focus:border-terracotta-500 focus:outline-none focus:ring-1 focus:ring-terracotta-500"
              />
            </div>
          </div>
        )}
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-medium text-stone-900 mb-4">
          Banking Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Bank Account Holder Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={profileData.bankAccountName}
              onChange={(e) =>
                handleInputChange("bankAccountName", e.target.value)
              }
              className="w-full px-4 py-3 border border-stone-300 rounded-md focus:border-terracotta-500 focus:outline-none focus:ring-1 focus:ring-terracotta-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Bank Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={profileData.bankName}
              onChange={(e) => handleInputChange("bankName", e.target.value)}
              className="w-full px-4 py-3 border border-stone-300 rounded-md focus:border-terracotta-500 focus:outline-none focus:ring-1 focus:ring-terracotta-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Account Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={profileData.accountNumber}
              onChange={(e) =>
                handleInputChange("accountNumber", e.target.value)
              }
              className="w-full px-4 py-3 border border-stone-300 rounded-md focus:border-terracotta-500 focus:outline-none focus:ring-1 focus:ring-terracotta-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              IFSC / SWIFT Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={profileData.ifscCode}
              onChange={(e) => handleInputChange("ifscCode", e.target.value)}
              className="w-full px-4 py-3 border border-stone-300 rounded-md focus:border-terracotta-500 focus:outline-none focus:ring-1 focus:ring-terracotta-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              UPI ID (optional)
            </label>
            <input
              type="text"
              value={profileData.upiId}
              onChange={(e) => handleInputChange("upiId", e.target.value)}
              className="w-full px-4 py-3 border border-stone-300 rounded-md focus:border-terracotta-500 focus:outline-none focus:ring-1 focus:ring-terracotta-500"
            />
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-medium text-stone-900 mb-4">Tax Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              GST Number (if applicable)
            </label>
            <input
              type="text"
              value={profileData.gstNumber}
              onChange={(e) => handleInputChange("gstNumber", e.target.value)}
              className="w-full px-4 py-3 border border-stone-300 rounded-md focus:border-terracotta-500 focus:outline-none focus:ring-1 focus:ring-terracotta-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              PAN Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={profileData.panNumber}
              onChange={(e) => handleInputChange("panNumber", e.target.value)}
              className="w-full px-4 py-3 border border-stone-300 rounded-md focus:border-terracotta-500 focus:outline-none focus:ring-1 focus:ring-terracotta-500"
              required
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-stone-900 mb-4">
          Upload Documents
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              GST Certificate (if applicable)
            </label>
            <div className="mt-1 flex justify-center px-3 sm:px-6 pt-3 sm:pt-5 pb-3 sm:pb-6 border-2 border-dashed border-stone-300 rounded-md">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-6 sm:h-8 w-6 sm:w-8 text-stone-400" />
                <div className="flex flex-col sm:flex-row text-sm text-stone-600 justify-center">
                  <label
                    htmlFor="gst-upload"
                    className="relative cursor-pointer rounded-md font-medium text-terracotta-600 hover:text-terracotta-500"
                  >
                    <span>Upload a file</span>
                    <input
                      id="gst-upload"
                      name="gst-upload"
                      type="file"
                      className="sr-only"
                    />
                  </label>
                  <p className="sm:pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-stone-500">PDF or image up to 5MB</p>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              PAN Card <span className="text-red-500">*</span>
            </label>
            <div className="mt-1 flex justify-center px-3 sm:px-6 pt-3 sm:pt-5 pb-3 sm:pb-6 border-2 border-dashed border-stone-300 rounded-md">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-6 sm:h-8 w-6 sm:w-8 text-stone-400" />
                <div className="flex flex-col sm:flex-row text-sm text-stone-600 justify-center">
                  <label
                    htmlFor="pan-upload"
                    className="relative cursor-pointer rounded-md font-medium text-terracotta-600 hover:text-terracotta-500"
                  >
                    <span>Upload a file</span>
                    <input
                      id="pan-upload"
                      name="pan-upload"
                      type="file"
                      className="sr-only"
                    />
                  </label>
                  <p className="sm:pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-stone-500">PDF or image up to 5MB</p>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Business License / Incorporation Certificate{" "}
              <span className="text-red-500">*</span>
            </label>
            <div className="mt-1 flex justify-center px-3 sm:px-6 pt-3 sm:pt-5 pb-3 sm:pb-6 border-2 border-dashed border-stone-300 rounded-md">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-6 sm:h-8 w-6 sm:w-8 text-stone-400" />
                <div className="flex flex-col sm:flex-row text-sm text-stone-600 justify-center">
                  <label
                    htmlFor="license-upload"
                    className="relative cursor-pointer rounded-md font-medium text-terracotta-600 hover:text-terracotta-500"
                  >
                    <span>Upload a file</span>
                    <input
                      id="license-upload"
                      name="license-upload"
                      type="file"
                      className="sr-only"
                    />
                  </label>
                  <p className="sm:pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-stone-500">PDF or image up to 5MB</p>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Canceled Cheque or Passbook{" "}
              <span className="text-red-500">*</span>
            </label>
            <div className="mt-1 flex justify-center px-3 sm:px-6 pt-3 sm:pt-5 pb-3 sm:pb-6 border-2 border-dashed border-stone-300 rounded-md">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-6 sm:h-8 w-6 sm:w-8 text-stone-400" />
                <div className="flex flex-col sm:flex-row text-sm text-stone-600 justify-center">
                  <label
                    htmlFor="cheque-upload"
                    className="relative cursor-pointer rounded-md font-medium text-terracotta-600 hover:text-terracotta-500"
                  >
                    <span>Upload a file</span>
                    <input
                      id="cheque-upload"
                      name="cheque-upload"
                      type="file"
                      className="sr-only"
                    />
                  </label>
                  <p className="sm:pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-stone-500">PDF or image up to 5MB</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
