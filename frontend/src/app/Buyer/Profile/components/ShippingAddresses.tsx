"use client";

import { useState } from "react";
import { MapPin, Plus, Edit, Trash2 } from "lucide-react";

interface Address {
  id: string;
  firstName: string;
  lastName: string;
  company?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault: boolean;
}

interface ShippingAddressesProps {
  addresses: Address[];
  onUpdate: (addressId: string, address: Address) => void;
  onCreate: (address: Omit<Address, "id">) => void;
  onDelete: (addressId: string) => void;
  onSetDefault: (addressId: string) => void;
  isLoading: boolean;
}

const emptyAddress: Omit<Address, "id"> = {
  firstName: "",
  lastName: "",
  company: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "USA",
  phone: "",
  isDefault: false,
};

export default function ShippingAddresses({
  addresses,
  onUpdate,
  onCreate,
  onDelete,
  onSetDefault,
  isLoading,
}: ShippingAddressesProps) {
  const [editingAddress, setEditingAddress] = useState<string | null>(null);
  const [newAddress, setNewAddress] = useState<Omit<Address, "id"> | null>(
    null
  );
  const [editFormData, setEditFormData] = useState<Address | null>(null);

  const handleEdit = (address: Address) => {
    setEditingAddress(address.id);
    setEditFormData({ ...address });
  };

  const handleSaveEdit = async () => {
    if (editFormData && editingAddress) {
      await onUpdate(editingAddress, editFormData);
      setEditingAddress(null);
      setEditFormData(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingAddress(null);
    setEditFormData(null);
  };

  const handleCreateAddress = async () => {
    if (newAddress) {
      await onCreate(newAddress);
      setNewAddress(null);
    }
  };

  const AddressForm = ({
    data,
    onChange,
    onSave,
    onCancel,
    isNew = false,
  }: {
    data: Address | Omit<Address, "id">;
    onChange: (data: any) => void;
    onSave: () => void;
    onCancel: () => void;
    isNew?: boolean;
  }) => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">
            First Name *
          </label>
          <input
            type="text"
            value={data.firstName}
            onChange={(e) => onChange({ ...data, firstName: e.target.value })}
            className="w-full px-3 py-2 border border-stone-300 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent"
            placeholder="First name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">
            Last Name *
          </label>
          <input
            type="text"
            value={data.lastName}
            onChange={(e) => onChange({ ...data, lastName: e.target.value })}
            className="w-full px-3 py-2 border border-stone-300 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent"
            placeholder="Last name"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-stone-700 mb-1">
            Company (Optional)
          </label>
          <input
            type="text"
            value={data.company || ""}
            onChange={(e) => onChange({ ...data, company: e.target.value })}
            className="w-full px-3 py-2 border border-stone-300 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent"
            placeholder="Company name"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-stone-700 mb-1">
            Street Address *
          </label>
          <input
            type="text"
            value={data.addressLine1}
            onChange={(e) =>
              onChange({ ...data, addressLine1: e.target.value })
            }
            className="w-full px-3 py-2 border border-stone-300 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent"
            placeholder="Street address"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-stone-700 mb-1">
            Apartment, suite, etc. (Optional)
          </label>
          <input
            type="text"
            value={data.addressLine2 || ""}
            onChange={(e) =>
              onChange({ ...data, addressLine2: e.target.value })
            }
            className="w-full px-3 py-2 border border-stone-300 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent"
            placeholder="Apartment, suite, etc."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">
            City *
          </label>
          <input
            type="text"
            value={data.city}
            onChange={(e) => onChange({ ...data, city: e.target.value })}
            className="w-full px-3 py-2 border border-stone-300 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent"
            placeholder="City"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">
            State/Province *
          </label>
          <input
            type="text"
            value={data.state}
            onChange={(e) => onChange({ ...data, state: e.target.value })}
            className="w-full px-3 py-2 border border-stone-300 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent"
            placeholder="State/Province"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">
            Zip/Postal Code *
          </label>
          <input
            type="text"
            value={data.postalCode}
            onChange={(e) => onChange({ ...data, postalCode: e.target.value })}
            className="w-full px-3 py-2 border border-stone-300 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent"
            placeholder="Zip/Postal code"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">
            Country *
          </label>
          <select
            value={data.country}
            onChange={(e) => onChange({ ...data, country: e.target.value })}
            className="w-full px-3 py-2 border border-stone-300 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent"
          >
            <option value="USA">United States</option>
            <option value="CAN">Canada</option>
            <option value="MEX">Mexico</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-stone-700 mb-1">
            Phone Number *
          </label>
          <input
            type="tel"
            value={data.phone || ""}
            onChange={(e) => onChange({ ...data, phone: e.target.value })}
            className="w-full px-3 py-2 border border-stone-300 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent"
            placeholder="Phone number for delivery contact"
          />
        </div>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={onSave}
          disabled={isLoading}
          className="bg-terracotta-600 hover:bg-terracotta-700 text-white px-4 py-2 font-medium transition-colors disabled:opacity-50"
        >
          {isNew ? "Add Address" : "Save Address"}
        </button>
        <button
          onClick={onCancel}
          className="border border-stone-300 text-stone-700 hover:bg-stone-50 px-4 py-2 font-medium transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-white border border-stone-200 shadow-sm">
      <div className="p-6 border-b border-stone-200">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-medium text-stone-900 flex items-center">
            <MapPin className="w-5 h-5 mr-2" />
            Shipping Addresses
          </h2>
          <button
            onClick={() => setNewAddress(emptyAddress)}
            className="border border-stone-300 text-stone-700 hover:bg-stone-50 px-4 py-2 font-medium transition-colors"
          >
            <Plus className="w-4 h-4 mr-2 inline" />
            Add Address
          </button>
        </div>
      </div>

      <div className="p-6 space-y-4">
        {addresses.map((address) => (
          <div key={address.id} className="border border-stone-200 p-4">
            {editingAddress === address.id && editFormData ? (
              <AddressForm
                data={editFormData}
                onChange={setEditFormData}
                onSave={handleSaveEdit}
                onCancel={handleCancelEdit}
              />
            ) : (
              <div>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium text-stone-900">
                        {address.firstName} {address.lastName}
                      </h4>
                      {address.isDefault && (
                        <span className="inline-block bg-stone-100 text-stone-800 text-xs px-2 py-1">
                          Default
                        </span>
                      )}
                    </div>
                    {address.company && (
                      <p className="text-sm text-stone-600">
                        {address.company}
                      </p>
                    )}
                    <p className="text-sm text-stone-600">
                      {address.addressLine1}
                    </p>
                    {address.addressLine2 && (
                      <p className="text-sm text-stone-600">
                        {address.addressLine2}
                      </p>
                    )}
                    <p className="text-sm text-stone-600">
                      {address.city}, {address.state} {address.postalCode}
                    </p>
                    <p className="text-sm text-stone-600">{address.country}</p>
                    {address.phone && (
                      <p className="text-sm text-stone-600">{address.phone}</p>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(address)}
                      className="border border-stone-300 text-stone-700 hover:bg-stone-50 p-1 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    {!address.isDefault && (
                      <>
                        <button
                          onClick={() => onSetDefault(address.id)}
                          className="border border-stone-300 text-stone-700 hover:bg-stone-50 px-2 py-1 text-xs font-medium transition-colors"
                        >
                          Set Default
                        </button>
                        <button
                          onClick={() => onDelete(address.id)}
                          className="border border-red-200 text-red-600 hover:bg-red-50 p-1 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* New Address Form */}
        {newAddress && (
          <div className="border border-stone-200 p-4 bg-stone-50">
            <h4 className="font-medium text-stone-900 mb-4">Add New Address</h4>
            <AddressForm
              data={newAddress}
              onChange={setNewAddress}
              onSave={handleCreateAddress}
              onCancel={() => setNewAddress(null)}
              isNew={true}
            />
          </div>
        )}
      </div>
    </div>
  );
}
