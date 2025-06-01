"use client";

import { useState } from "react";
import {
  Truck,
  Package,
  Hash,
  Mail,
  Clock,
  Globe,
  Shield,
  X,
  Plus,
} from "lucide-react";

interface ShippingLogisticsData {
  shippingType: string;
  serviceAreas: string[];
  inventoryVolume: string;
  supportContact: string;
  returnPolicy: string;
  workingHours: string;
}

interface ShippingLogisticsProps {
  isEditing: boolean;
  onDataChange: (data: ShippingLogisticsData) => void;
}

export default function ShippingLogistics({
  isEditing,
  onDataChange,
}: ShippingLogisticsProps) {
  const [data, setData] = useState<ShippingLogisticsData>({
    shippingType: "Self Fulfilled",
    serviceAreas: ["National", "International"],
    inventoryVolume: "51-100",
    supportContact: "support@smithcrafts.com",
    returnPolicy:
      "30-day returns accepted for unused items in original packaging. Customer pays return shipping.",
    workingHours: "Mon-Fri: 9AM-5PM EST",
  });

  const handleInputChange = <K extends keyof ShippingLogisticsData>(
    field: K,
    value: ShippingLogisticsData[K]
  ) => {
    const newData = { ...data, [field]: value };
    setData(newData);
    onDataChange(newData);
  };

  const handleArrayAdd = (value: string) => {
    if (value.trim()) {
      const newAreas = [...data.serviceAreas, value.trim()];
      const newData = { ...data, serviceAreas: newAreas };
      setData(newData);
      onDataChange(newData);
    }
  };

  const handleArrayRemove = (index: number) => {
    const newAreas = data.serviceAreas.filter((_, i) => i !== index);
    const newData = { ...data, serviceAreas: newAreas };
    setData(newData);
    onDataChange(newData);
  };

  return (
    <div className="bg-white border border-stone-200 shadow-sm">
      <div className="p-6 border-b border-stone-200">
        <h2 className="text-xl font-medium text-stone-900 flex items-center">
          <Truck className="w-5 h-5 mr-2" />
          Shipping & Logistics
        </h2>
      </div>

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className=" text-sm font-medium text-stone-700 mb-1 flex items-center">
              <Package className="w-4 h-4 mr-2" />
              Shipping Type *
            </label>
            {isEditing ? (
              <select
                value={data.shippingType}
                onChange={(e) =>
                  handleInputChange("shippingType", e.target.value)
                }
                className="w-full px-3 py-2 border border-stone-300 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent transition-colors"
              >
                <option value="Self Fulfilled">Self Fulfilled</option>
                <option value="Platform Fulfilled">Platform Fulfilled</option>
                <option value="Both">Both</option>
              </select>
            ) : (
              <p className="text-stone-600 py-2">{data.shippingType}</p>
            )}
          </div>
          <div>
            <label className=" text-sm font-medium text-stone-700 mb-1 flex items-center">
              <Hash className="w-4 h-4 mr-2" />
              Inventory Volume *
            </label>
            {isEditing ? (
              <select
                value={data.inventoryVolume}
                onChange={(e) =>
                  handleInputChange("inventoryVolume", e.target.value)
                }
                className="w-full px-3 py-2 border border-stone-300 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent transition-colors"
              >
                <option value="1-10">1-10 items</option>
                <option value="11-50">11-50 items</option>
                <option value="51-100">51-100 items</option>
                <option value="101-500">101-500 items</option>
                <option value="500+">500+ items</option>
              </select>
            ) : (
              <p className="text-stone-600 py-2">
                {data.inventoryVolume} items
              </p>
            )}
          </div>
          <div>
            <label className=" text-sm font-medium text-stone-700 mb-1 flex items-center">
              <Mail className="w-4 h-4 mr-2" />
              Support Contact *
            </label>
            {isEditing ? (
              <input
                type="text"
                value={data.supportContact}
                onChange={(e) =>
                  handleInputChange("supportContact", e.target.value)
                }
                className="w-full px-3 py-2 border border-stone-300 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent transition-colors"
                placeholder="Enter support contact"
              />
            ) : (
              <p className="text-stone-600 py-2">{data.supportContact}</p>
            )}
          </div>
          <div>
            <label className=" text-sm font-medium text-stone-700 mb-1 flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              Working Hours
            </label>
            {isEditing ? (
              <input
                type="text"
                value={data.workingHours}
                onChange={(e) =>
                  handleInputChange("workingHours", e.target.value)
                }
                className="w-full px-3 py-2 border border-stone-300 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent transition-colors"
                placeholder="Enter working hours"
              />
            ) : (
              <p className="text-stone-600 py-2">{data.workingHours}</p>
            )}
          </div>
        </div>

        {/* Service Areas */}
        <div className="pt-6 border-t border-stone-200">
          <label className=" text-sm font-medium text-stone-700 mb-3 flex items-center">
            <Globe className="w-4 h-4 mr-2" />
            Service Areas
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            {data.serviceAreas.map((area, index) => (
              <span
                key={index}
                className="bg-sage-100 text-sage-700 px-3 py-1 rounded-full text-sm flex items-center"
              >
                {area}
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => handleArrayRemove(index)}
                    className="ml-2 text-sage-500 hover:text-sage-700 transition-colors"
                    aria-label={`Remove ${area}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </span>
            ))}
          </div>
          {isEditing && (
            <div className="flex">
              <input
                type="text"
                placeholder="Add a service area"
                className="flex-1 px-3 py-2 border border-stone-300 rounded-l focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent transition-colors"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleArrayAdd((e.target as HTMLInputElement).value);
                    (e.target as HTMLInputElement).value = "";
                  }
                }}
              />
              <button
                type="button"
                onClick={(e) => {
                  const input = e.currentTarget
                    .previousElementSibling as HTMLInputElement;
                  handleArrayAdd(input.value);
                  input.value = "";
                }}
                className="bg-sage-600 hover:bg-sage-700 text-white px-4 py-2 rounded-r transition-colors"
                aria-label="Add service area"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Return Policy */}
        <div className="pt-6 border-t border-stone-200">
          <label className=" text-sm font-medium text-stone-700 mb-3 flex items-center">
            <Shield className="w-4 h-4 mr-2" />
            Return Policy
          </label>
          {isEditing ? (
            <textarea
              value={data.returnPolicy}
              onChange={(e) =>
                handleInputChange("returnPolicy", e.target.value)
              }
              rows={3}
              className="w-full px-3 py-2 border border-stone-300 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent transition-colors"
              placeholder="Enter your return policy"
            />
          ) : (
            <p className="text-stone-600">{data.returnPolicy}</p>
          )}
        </div>
      </div>
    </div>
  );
}
