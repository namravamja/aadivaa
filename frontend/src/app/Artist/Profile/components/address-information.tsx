"use client";

import { MapPin } from "lucide-react";

interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  pinCode: string;
}

interface ArtistData {
  businessAddress: Address;
  warehouseAddress: {
    sameAsBusiness: boolean;
  } & Address;
}

interface AddressInformationProps {
  artistData: ArtistData;
}

export default function AddressInformation({
  artistData,
}: AddressInformationProps) {
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
          <div className="text-stone-600 space-y-1">
            <p>{artistData.businessAddress.street}</p>
            <p>
              {artistData.businessAddress.city},{" "}
              {artistData.businessAddress.state}{" "}
              {artistData.businessAddress.pinCode}
            </p>
            <p>{artistData.businessAddress.country}</p>
          </div>
        </div>

        {/* Warehouse Address */}
        <div className="pt-6 border-t border-stone-200">
          <h3 className="text-sm font-medium text-stone-700 mb-3">
            Warehouse Address
          </h3>
          {artistData.warehouseAddress.sameAsBusiness ? (
            <p className="text-stone-600">Same as Business Address</p>
          ) : (
            <div className="text-stone-600 space-y-1">
              <p>{artistData.warehouseAddress.street}</p>
              <p>
                {artistData.warehouseAddress.city},{" "}
                {artistData.warehouseAddress.state}{" "}
                {artistData.warehouseAddress.pinCode}
              </p>
              <p>{artistData.warehouseAddress.country}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
