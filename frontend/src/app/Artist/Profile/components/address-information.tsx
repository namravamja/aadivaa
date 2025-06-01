"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";

interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  pinCode: string;
}

interface AddressData {
  businessAddress: Address;
  warehouseAddress: {
    sameAsBusiness: boolean;
  } & Address;
}

interface AddressInformationProps {
  isEditing: boolean;
  onDataChange: (data: AddressData) => void;
}

export default function AddressInformation({
  isEditing,
  onDataChange,
}: AddressInformationProps) {
  const [data, setData] = useState<AddressData>({
    businessAddress: {
      street: "123 Main Street",
      city: "Craftsville",
      state: "Artisan State",
      country: "United States",
      pinCode: "12345",
    },
    warehouseAddress: {
      sameAsBusiness: true,
      street: "",
      city: "",
      state: "",
      country: "",
      pinCode: "",
    },
  });

  const handleNestedInputChange = <
    K extends keyof AddressData,
    NK extends keyof AddressData[K]
  >(
    parent: K,
    field: NK,
    value: AddressData[K][NK]
  ) => {
    const newData = {
      ...data,
      [parent]: {
        ...(typeof data[parent] === "object" && data[parent] !== null
          ? data[parent]
          : {}),
        [field]: value,
      },
    };
    setData(newData);
    onDataChange(newData);
  };

  return (
    <div className="bg-white border border-stone-200 shadow-sm">
      <div className="p-6 border-b border-stone-200">
        <h2 className="text-xl font-medium text-stone-900 flex items-center">
          <MapPin className="w-5 h-5 mr-2" />
          Address Information
        </h2>
      </div>

      <div className="p-6 space-y-6">
        {/* Business Address */}
        <div>
          <h3 className="text-sm font-medium text-stone-700 mb-3">
            Business Address
          </h3>
          {isEditing ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <input
                  type="text"
                  placeholder="Street Address"
                  value={data.businessAddress.street}
                  onChange={(e) =>
                    handleNestedInputChange(
                      "businessAddress",
                      "street",
                      e.target.value
                    )
                  }
                  className="w-full px-3 py-2 border border-stone-300 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent transition-colors"
                />
              </div>
              <input
                type="text"
                placeholder="City"
                value={data.businessAddress.city}
                onChange={(e) =>
                  handleNestedInputChange(
                    "businessAddress",
                    "city",
                    e.target.value
                  )
                }
                className="w-full px-3 py-2 border border-stone-300 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent transition-colors"
              />
              <input
                type="text"
                placeholder="State"
                value={data.businessAddress.state}
                onChange={(e) =>
                  handleNestedInputChange(
                    "businessAddress",
                    "state",
                    e.target.value
                  )
                }
                className="w-full px-3 py-2 border border-stone-300 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent transition-colors"
              />
              <input
                type="text"
                placeholder="Country"
                value={data.businessAddress.country}
                onChange={(e) =>
                  handleNestedInputChange(
                    "businessAddress",
                    "country",
                    e.target.value
                  )
                }
                className="w-full px-3 py-2 border border-stone-300 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent transition-colors"
              />
              <input
                type="text"
                placeholder="PIN Code"
                value={data.businessAddress.pinCode}
                onChange={(e) =>
                  handleNestedInputChange(
                    "businessAddress",
                    "pinCode",
                    e.target.value
                  )
                }
                className="w-full px-3 py-2 border border-stone-300 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent transition-colors"
              />
            </div>
          ) : (
            <div className="text-stone-600 space-y-1">
              <p>{data.businessAddress.street}</p>
              <p>
                {data.businessAddress.city}, {data.businessAddress.state}{" "}
                {data.businessAddress.pinCode}
              </p>
              <p>{data.businessAddress.country}</p>
            </div>
          )}
        </div>

        {/* Warehouse Address */}
        <div className="pt-6 border-t border-stone-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
            <h3 className="text-sm font-medium text-stone-700">
              Warehouse Address
            </h3>
            {isEditing && (
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="sameAsBusiness"
                  checked={data.warehouseAddress.sameAsBusiness}
                  onChange={(e) =>
                    handleNestedInputChange(
                      "warehouseAddress",
                      "sameAsBusiness",
                      e.target.checked
                    )
                  }
                  className="h-4 w-4 text-terracotta-500 focus:ring-terracotta-500 border-stone-300 rounded"
                />
                <label
                  htmlFor="sameAsBusiness"
                  className="ml-2 text-sm text-stone-700"
                >
                  Same as Business Address
                </label>
              </div>
            )}
          </div>

          {data.warehouseAddress.sameAsBusiness ? (
            <p className="text-stone-600">Same as Business Address</p>
          ) : isEditing ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <input
                  type="text"
                  placeholder="Street Address"
                  value={data.warehouseAddress.street}
                  onChange={(e) =>
                    handleNestedInputChange(
                      "warehouseAddress",
                      "street",
                      e.target.value
                    )
                  }
                  className="w-full px-3 py-2 border border-stone-300 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent transition-colors"
                />
              </div>
              <input
                type="text"
                placeholder="City"
                value={data.warehouseAddress.city}
                onChange={(e) =>
                  handleNestedInputChange(
                    "warehouseAddress",
                    "city",
                    e.target.value
                  )
                }
                className="w-full px-3 py-2 border border-stone-300 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent transition-colors"
              />
              <input
                type="text"
                placeholder="State"
                value={data.warehouseAddress.state}
                onChange={(e) =>
                  handleNestedInputChange(
                    "warehouseAddress",
                    "state",
                    e.target.value
                  )
                }
                className="w-full px-3 py-2 border border-stone-300 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent transition-colors"
              />
              <input
                type="text"
                placeholder="Country"
                value={data.warehouseAddress.country}
                onChange={(e) =>
                  handleNestedInputChange(
                    "warehouseAddress",
                    "country",
                    e.target.value
                  )
                }
                className="w-full px-3 py-2 border border-stone-300 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent transition-colors"
              />
              <input
                type="text"
                placeholder="PIN Code"
                value={data.warehouseAddress.pinCode}
                onChange={(e) =>
                  handleNestedInputChange(
                    "warehouseAddress",
                    "pinCode",
                    e.target.value
                  )
                }
                className="w-full px-3 py-2 border border-stone-300 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent transition-colors"
              />
            </div>
          ) : (
            <div className="text-stone-600 space-y-1">
              <p>{data.warehouseAddress.street}</p>
              <p>
                {data.warehouseAddress.city}, {data.warehouseAddress.state}{" "}
                {data.warehouseAddress.pinCode}
              </p>
              <p>{data.warehouseAddress.country}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
