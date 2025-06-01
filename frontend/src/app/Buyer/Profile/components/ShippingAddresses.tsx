"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import { MapPin, Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import {
  useGetBuyerQuery,
  useUpdateBuyerMutation,
} from "@/services/api/buyerApi";

// Updated Address interface to match Prisma schema
interface Address {
  id: string;
  firstName: string;
  lastName: string;
  company?: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault: boolean;
}

// Address form fields type
type AddressFormData = Address | Omit<Address, "id">;

// Field update type for better type safety
type FieldUpdate = {
  field: keyof AddressFormData;
  value: string | boolean;
};

const INITIAL_ADDRESS: Omit<Address, "id"> = {
  firstName: "",
  lastName: "",
  company: "",
  street: "",
  apartment: "",
  city: "",
  state: "",
  postalCode: "",
  country: "USA",
  phone: "",
  isDefault: false,
} as const;

const COUNTRY_OPTIONS = [
  { value: "USA", label: "United States" },
  { value: "CAN", label: "Canada" },
  { value: "MEX", label: "Mexico" },
] as const;

// Helper function to convert legacy address format to new format
const convertLegacyAddress = (address: any): Address => {
  return {
    id: address.id,
    firstName: address.firstName,
    lastName: address.lastName,
    company: address.company,
    street: address.street || address.addressLine1 || "",
    apartment: address.apartment || address.addressLine2 || undefined,
    city: address.city,
    state: address.state,
    postalCode: address.postalCode,
    country: address.country,
    phone: address.phone,
    isDefault: address.isDefault,
  };
};

// Memoized Address Form Component
const AddressForm = React.memo<{
  data: AddressFormData;
  onChange: (update: FieldUpdate) => void;
  onSave: () => void;
  onCancel: () => void;
  isNew?: boolean;
  isLoading?: boolean;
}>(({ data, onChange, onSave, onCancel, isNew = false, isLoading = false }) => {
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  // Memoized field handlers to prevent cursor jumping
  const handleFieldChange = useCallback(
    (field: keyof AddressFormData) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        onChange({ field, value: e.target.value });
      },
    [onChange]
  );

  // Validation check
  const isValid = useMemo(() => {
    return !!(
      data.firstName?.trim() &&
      data.lastName?.trim() &&
      data.street?.trim() &&
      data.city?.trim() &&
      data.state?.trim() &&
      data.postalCode?.trim() &&
      data.country?.trim()
    );
  }, [data]);

  const hasFormData = () => {
    return Object.values(data).some((value) =>
      typeof value === "string" ? value.trim() : value
    );
  };

  const handleSave = () => {
    if (isValid) {
      setShowSaveConfirm(true);
    }
  };

  const handleCancel = () => {
    if (hasFormData() && isNew) {
      setShowCancelConfirm(true);
    } else {
      onCancel();
    }
  };

  const confirmSave = () => {
    onSave();
    setShowSaveConfirm(false);
  };

  const confirmCancel = () => {
    onCancel();
    setShowCancelConfirm(false);
  };

  return (
    <div className="space-y-4">
      {/* Save Confirmation */}
      {showSaveConfirm && (
        <div className="fixed inset-0  bg-opacity-30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-stone-900 mb-2">
              {isNew ? "Add Address" : "Save Changes"}
            </h3>
            <p className="text-stone-600 mb-6">
              {isNew
                ? "Are you sure you want to add this new address?"
                : "Are you sure you want to save the changes to this address?"}
            </p>
            <div className="flex space-x-3">
              <button
                onClick={confirmSave}
                disabled={isLoading}
                className="bg-terracotta-500 hover:bg-terracotta-600 disabled:bg-terracotta-300 disabled:cursor-not-allowed text-white px-4 py-2 font-medium transition-all duration-200 cursor-pointer rounded-md flex-1"
              >
                {isLoading
                  ? "Saving..."
                  : isNew
                  ? "Add Address"
                  : "Save Changes"}
              </button>
              <button
                onClick={() => setShowSaveConfirm(false)}
                disabled={isLoading}
                className="flex-1 border border-stone-300 text-stone-700 hover:bg-stone-50 disabled:opacity-50 px-4 py-2 font-medium transition-colors rounded-md cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation */}
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
                onClick={confirmCancel}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 font-medium transition-colors rounded-md flex-1 cursor-pointer"
              >
                Discard Changes
              </button>
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="flex-1 border border-stone-300 text-stone-700 hover:bg-stone-50 px-4 py-2 font-medium transition-colors rounded-md cursor-pointer"
              >
                Keep Editing
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* First Name */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">
            First Name *
          </label>
          <input
            type="text"
            value={data.firstName || ""}
            onChange={handleFieldChange("firstName")}
            disabled={isLoading}
            className="w-full px-3 py-2 border border-stone-300 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent transition-colors disabled:bg-stone-50 disabled:text-stone-500 rounded-md"
            placeholder="First name"
            required
          />
        </div>

        {/* Last Name */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">
            Last Name *
          </label>
          <input
            type="text"
            value={data.lastName || ""}
            onChange={handleFieldChange("lastName")}
            disabled={isLoading}
            className="w-full px-3 py-2 border border-stone-300 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent transition-colors disabled:bg-stone-50 disabled:text-stone-500 rounded-md"
            placeholder="Last name"
            required
          />
        </div>

        {/* Company */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-stone-700 mb-1">
            Company (Optional)
          </label>
          <input
            type="text"
            value={data.company || ""}
            onChange={handleFieldChange("company")}
            disabled={isLoading}
            className="w-full px-3 py-2 border border-stone-300 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent transition-colors disabled:bg-stone-50 disabled:text-stone-500 rounded-md"
            placeholder="Company name"
          />
        </div>

        {/* Street Address */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-stone-700 mb-1">
            Street Address *
          </label>
          <input
            type="text"
            value={data.street || ""}
            onChange={handleFieldChange("street")}
            disabled={isLoading}
            className="w-full px-3 py-2 border border-stone-300 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent transition-colors disabled:bg-stone-50 disabled:text-stone-500 rounded-md"
            placeholder="Street address"
            required
          />
        </div>

        {/* Apartment */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-stone-700 mb-1">
            Apartment, suite, etc. (Optional)
          </label>
          <input
            type="text"
            value={data.apartment || ""}
            onChange={handleFieldChange("apartment")}
            disabled={isLoading}
            className="w-full px-3 py-2 border border-stone-300 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent transition-colors disabled:bg-stone-50 disabled:text-stone-500 rounded-md"
            placeholder="Apartment, suite, etc."
          />
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">
            City *
          </label>
          <input
            type="text"
            value={data.city || ""}
            onChange={handleFieldChange("city")}
            disabled={isLoading}
            className="w-full px-3 py-2 border border-stone-300 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent transition-colors disabled:bg-stone-50 disabled:text-stone-500 rounded-md"
            placeholder="City"
            required
          />
        </div>

        {/* State */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">
            State/Province *
          </label>
          <input
            type="text"
            value={data.state || ""}
            onChange={handleFieldChange("state")}
            disabled={isLoading}
            className="w-full px-3 py-2 border border-stone-300 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent transition-colors disabled:bg-stone-50 disabled:text-stone-500 rounded-md"
            placeholder="State/Province"
            required
          />
        </div>

        {/* Postal Code */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">
            Zip/Postal Code *
          </label>
          <input
            type="text"
            value={data.postalCode || ""}
            onChange={handleFieldChange("postalCode")}
            disabled={isLoading}
            className="w-full px-3 py-2 border border-stone-300 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent transition-colors disabled:bg-stone-50 disabled:text-stone-500 rounded-md"
            placeholder="Zip/Postal code"
            required
          />
        </div>

        {/* Country */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">
            Country *
          </label>
          <select
            value={data.country || "USA"}
            onChange={handleFieldChange("country")}
            disabled={isLoading}
            className="w-full px-3 py-2 border border-stone-300 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent transition-colors disabled:bg-stone-50 disabled:text-stone-500 rounded-md"
            required
          >
            {COUNTRY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Phone */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-stone-700 mb-1">
            Phone Number (Optional)
          </label>
          <input
            type="tel"
            value={data.phone || ""}
            onChange={handleFieldChange("phone")}
            disabled={isLoading}
            className="w-full px-3 py-2 border border-stone-300 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent transition-colors disabled:bg-stone-50 disabled:text-stone-500 rounded-md"
            placeholder="Phone number for delivery contact"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2 pt-2">
        <button
          onClick={handleSave}
          disabled={isLoading || !isValid}
          className="bg-terracotta-500 hover:bg-terracotta-600 disabled:bg-terracotta-300 disabled:cursor-not-allowed text-white px-6 py-2 font-medium transition-all duration-200 cursor-pointer rounded-md"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 mr-2 inline-block animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              Saving...
            </>
          ) : isNew ? (
            "Add Address"
          ) : (
            "Save Changes"
          )}
        </button>
        <button
          onClick={handleCancel}
          disabled={isLoading}
          className="border border-stone-300 text-stone-700 hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-2 font-medium transition-colors rounded-md cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </div>
  );
});

AddressForm.displayName = "AddressForm";

// Main Component - Now with self-contained data operations
export default function ShippingAddresses() {
  // Get buyer data directly in this component
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

  // Local state
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [editingAddress, setEditingAddress] = useState<string | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [editFormData, setEditFormData] = useState<Address | null>(null);
  const [newAddressData, setNewAddressData] =
    useState<Omit<Address, "id">>(INITIAL_ADDRESS);

  // Confirmation states
  const [deleteConfirm, setDeleteConfirm] = useState<{
    show: boolean;
    addressId: string;
    addressName: string;
  }>({
    show: false,
    addressId: "",
    addressName: "",
  });
  const [defaultConfirm, setDefaultConfirm] = useState<{
    show: boolean;
    addressId: string;
    addressName: string;
  }>({
    show: false,
    addressId: "",
    addressName: "",
  });

  // Update local state when API data changes
  useEffect(() => {
    if (buyerData?.addresses) {
      setAddresses(buyerData.addresses.map(convertLegacyAddress));
    }
  }, [buyerData]);

  // Optimized field update handlers
  const handleEditFieldChange = useCallback((update: FieldUpdate) => {
    setEditFormData((prev) =>
      prev ? { ...prev, [update.field]: update.value } : null
    );
  }, []);

  const handleNewFieldChange = useCallback((update: FieldUpdate) => {
    setNewAddressData((prev) => ({ ...prev, [update.field]: update.value }));
  }, []);

  // Action handlers
  const handleStartEdit = useCallback((address: Address) => {
    setEditingAddress(address.id);
    setEditFormData({ ...address });
  }, []);

  const handleSaveEdit = useCallback(async () => {
    if (editFormData && editingAddress) {
      try {
        const { id, ...addressDataWithoutId } = editFormData;

        // Optimistic update
        setAddresses((prev) =>
          prev.map((addr) => (addr.id === editingAddress ? editFormData : addr))
        );

        // API call - use Prisma's nested update syntax with correct field names
        await updateBuyer({
          addresses: {
            update: {
              where: { id: editingAddress },
              data: {
                firstName: addressDataWithoutId.firstName,
                lastName: addressDataWithoutId.lastName,
                company: addressDataWithoutId.company,
                street: addressDataWithoutId.street,
                apartment: addressDataWithoutId.apartment,
                city: addressDataWithoutId.city,
                state: addressDataWithoutId.state,
                postalCode: addressDataWithoutId.postalCode,
                country: addressDataWithoutId.country,
                phone: addressDataWithoutId.phone,
                isDefault: addressDataWithoutId.isDefault,
              },
            },
          },
        }).unwrap();

        setEditingAddress(null);
        setEditFormData(null);
        toast.success("Address updated successfully");

        // Refetch to ensure data consistency
        refetch();
      } catch (error: any) {
        console.error("Failed to update address:", error);

        let errorMessage = "Failed to update address. Please try again.";
        if (error?.data?.message) {
          errorMessage = error.data.message;
        } else if (error?.message) {
          errorMessage = error.message;
        }

        toast.error(errorMessage);
        refetch(); // Refetch to revert optimistic update
      }
    }
  }, [editFormData, editingAddress, updateBuyer, refetch]);

  const handleCancelEdit = useCallback(() => {
    setEditingAddress(null);
    setEditFormData(null);
  }, []);

  const handleCreateAddress = useCallback(async () => {
    try {
      // Create temporary address with ID for optimistic update
      const tempId = `temp_${Date.now()}`;
      const createdAddress: Address = {
        ...newAddressData,
        id: tempId,
      };

      // Optimistic update
      setAddresses((prev) => [...prev, createdAddress]);

      // API call - use Prisma's nested create syntax with correct field names
      await updateBuyer({
        addresses: {
          create: {
            firstName: newAddressData.firstName,
            lastName: newAddressData.lastName,
            company: newAddressData.company,
            street: newAddressData.street,
            apartment: newAddressData.apartment,
            city: newAddressData.city,
            state: newAddressData.state,
            postalCode: newAddressData.postalCode,
            country: newAddressData.country,
            phone: newAddressData.phone,
            isDefault: newAddressData.isDefault,
          },
        },
      }).unwrap();

      setShowNewForm(false);
      setNewAddressData(INITIAL_ADDRESS);
      toast.success("Address created successfully");

      // Refetch to get the real ID from the server
      refetch();
    } catch (error: any) {
      console.error("Failed to create address:", error);

      let errorMessage = "Failed to create address. Please try again.";
      if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
      refetch(); // Refetch to revert optimistic update
    }
  }, [newAddressData, updateBuyer, refetch]);

  const handleCancelNew = useCallback(() => {
    setShowNewForm(false);
    setNewAddressData(INITIAL_ADDRESS);
  }, []);

  const handleShowNewForm = useCallback(() => {
    setShowNewForm(true);
  }, []);

  const handleDelete = useCallback(
    async (addressId: string) => {
      try {
        // Optimistic update
        setAddresses((prev) => prev.filter((addr) => addr.id !== addressId));

        // API call - use Prisma's nested delete syntax
        await updateBuyer({
          addresses: {
            delete: {
              id: addressId,
            },
          },
        }).unwrap();

        toast.success("Address deleted successfully");
        setDeleteConfirm({ show: false, addressId: "", addressName: "" });
      } catch (error: any) {
        console.error("Failed to delete address:", error);

        let errorMessage = "Failed to delete address. Please try again.";
        if (error?.data?.message) {
          errorMessage = error.data.message;
        } else if (error?.message) {
          errorMessage = error.message;
        }

        toast.error(errorMessage);
        refetch(); // Refetch to revert optimistic update
        setDeleteConfirm({ show: false, addressId: "", addressName: "" });
      }
    },
    [updateBuyer, refetch]
  );

  const handleSetDefault = useCallback(
    async (addressId: string) => {
      try {
        // Optimistic update
        setAddresses((prev) =>
          prev.map((addr) => ({
            ...addr,
            isDefault: addr.id === addressId,
          }))
        );

        // For setting default, we need to update multiple addresses
        // First, set all addresses to non-default, then set the selected one as default
        const updateOperations = addresses.map((addr) => {
          const { id, ...addressData } = addr;
          return {
            where: { id: addr.id },
            data: {
              firstName: addressData.firstName,
              lastName: addressData.lastName,
              company: addressData.company,
              street: addressData.street,
              apartment: addressData.apartment,
              city: addressData.city,
              state: addressData.state,
              postalCode: addressData.postalCode,
              country: addressData.country,
              phone: addressData.phone,
              isDefault: addr.id === addressId,
            },
          };
        });

        // API call - use Prisma's nested updateMany syntax
        await updateBuyer({
          addresses: {
            updateMany: updateOperations,
          },
        }).unwrap();

        toast.success("Default address updated successfully");
        setDefaultConfirm({ show: false, addressId: "", addressName: "" });
      } catch (error: any) {
        console.error("Failed to set default address:", error);

        let errorMessage = "Failed to set default address. Please try again.";
        if (error?.data?.message) {
          errorMessage = error.data.message;
        } else if (error?.message) {
          errorMessage = error.message;
        }

        toast.error(errorMessage);
        refetch(); // Refetch to revert optimistic update
        setDefaultConfirm({ show: false, addressId: "", addressName: "" });
      }
    },
    [addresses, updateBuyer, refetch]
  );

  const handleRetry = () => {
    refetch();
  };

  // Memoize address list to prevent unnecessary re-renders
  const addressList = useMemo(() => {
    return addresses.map((address) => (
      <div
        key={address.id}
        className="border border-stone-200 p-4 hover:shadow-md hover:border-sage-300 transition-all duration-200 rounded-lg cursor-pointer"
      >
        {editingAddress === address.id && editFormData ? (
          <AddressForm
            data={editFormData}
            onChange={handleEditFieldChange}
            onSave={handleSaveEdit}
            onCancel={handleCancelEdit}
            isLoading={isUpdating}
          />
        ) : (
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="font-semibold text-stone-900">
                  {address.firstName} {address.lastName}
                </h4>
                {address.isDefault && (
                  <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-terracotta-100 text-terracotta-800">
                    Default
                  </span>
                )}
              </div>

              <div className="text-sm text-stone-600 space-y-1">
                {address.company && (
                  <p className="font-medium">{address.company}</p>
                )}
                <p>{address.street}</p>
                {address.apartment && <p>{address.apartment}</p>}
                <p>
                  {address.city}, {address.state} {address.postalCode}
                </p>
                <p>{address.country}</p>
                {address.phone && <p>{address.phone}</p>}
              </div>
            </div>

            <div className="flex items-center gap-2 ml-4">
              <button
                onClick={() => handleStartEdit(address)}
                disabled={isUpdating}
                className="p-2 text-stone-500 hover:text-stone-700 hover:bg-stone-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-md cursor-pointer"
                title="Edit address"
              >
                <Edit className="w-4 h-4" />
              </button>

              {!address.isDefault && (
                <>
                  <button
                    onClick={() =>
                      setDefaultConfirm({
                        show: true,
                        addressId: address.id,
                        addressName: `${address.firstName} ${address.lastName}`,
                      })
                    }
                    disabled={isUpdating}
                    className="px-3 py-1 text-xs font-medium text-stone-600 border border-stone-300 hover:bg-stone-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-md cursor-pointer"
                  >
                    Set Default
                  </button>
                  <button
                    onClick={() =>
                      setDeleteConfirm({
                        show: true,
                        addressId: address.id,
                        addressName: `${address.firstName} ${address.lastName}`,
                      })
                    }
                    disabled={isUpdating}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-md cursor-pointer"
                    title="Delete address"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    ));
  }, [
    addresses,
    editingAddress,
    editFormData,
    isUpdating,
    handleStartEdit,
    handleEditFieldChange,
    handleSaveEdit,
    handleCancelEdit,
  ]);

  // Error state
  if (fetchError && !buyerData) {
    return (
      <div className="bg-white border border-stone-200 shadow-sm">
        <div className="p-6 border-b border-stone-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-stone-900 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-stone-500" />
              Shipping Addresses
            </h2>
          </div>
        </div>
        <div className="p-6">
          <div className="flex flex-col items-center justify-center min-h-[200px] text-center">
            <div className="text-red-600 mb-4">
              <p className="font-medium">Failed to load shipping addresses</p>
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
              className="bg-terracotta-500 hover:bg-terracotta-600 disabled:bg-terracotta-300 disabled:cursor-not-allowed text-white px-4 py-2 font-medium transition-all duration-200 cursor-pointer rounded-md"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (isFetching && addresses.length === 0) {
    return (
      <div className="bg-white border border-stone-200 shadow-sm">
        <div className="p-6 border-b border-stone-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-stone-900 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-stone-500" />
              Shipping Addresses
            </h2>
            <div className="w-32 h-10 bg-stone-200 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {Array.from({ length: 2 }).map((_, index) => (
              <div key={index} className="border border-stone-200 p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="w-32 h-5 bg-stone-200 rounded animate-pulse mb-2"></div>
                    <div className="space-y-1">
                      <div className="w-full h-4 bg-stone-200 rounded animate-pulse"></div>
                      <div className="w-full h-4 bg-stone-200 rounded animate-pulse"></div>
                      <div className="w-3/4 h-4 bg-stone-200 rounded animate-pulse"></div>
                      <div className="w-1/2 h-4 bg-stone-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <div className="w-8 h-8 bg-stone-200 rounded animate-pulse"></div>
                    <div className="w-20 h-8 bg-stone-200 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const isLoading = isUpdating;

  return (
    <div className="bg-white border border-stone-200 shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-stone-200">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-stone-900 flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-stone-500" />
            Shipping Addresses
          </h2>
          <button
            onClick={handleShowNewForm}
            disabled={isLoading || showNewForm}
            className="inline-flex items-center px-4 py-2 border border-stone-300 text-stone-700 hover:bg-stone-50 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Address
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Delete Confirmation */}
        {deleteConfirm.show && (
          <div className="fixed inset-0  bg-opacity-30 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <h3 className="text-lg font-semibold text-stone-900 mb-2">
                Delete Address
              </h3>
              <p className="text-stone-600 mb-6">
                Are you sure you want to delete the address for{" "}
                {deleteConfirm.addressName}? This action cannot be undone.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => handleDelete(deleteConfirm.addressId)}
                  disabled={isLoading}
                  className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white px-4 py-2 font-medium transition-colors rounded-md cursor-pointer"
                >
                  {isLoading ? "Deleting..." : "Delete Address"}
                </button>
                <button
                  onClick={() =>
                    setDeleteConfirm({
                      show: false,
                      addressId: "",
                      addressName: "",
                    })
                  }
                  disabled={isLoading}
                  className="flex-1 border border-stone-300 text-stone-700 hover:bg-stone-50 disabled:opacity-50 px-4 py-2 font-medium transition-colors rounded-md cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Set Default Confirmation */}
        {defaultConfirm.show && (
          <div className="fixed inset-0  bg-opacity-30 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <h3 className="text-lg font-semibold text-stone-900 mb-2">
                Set Default Address
              </h3>
              <p className="text-stone-600 mb-6">
                Are you sure you want to set the address for{" "}
                {defaultConfirm.addressName} as your default shipping address?
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => handleSetDefault(defaultConfirm.addressId)}
                  disabled={isLoading}
                  className="bg-terracotta-500 hover:bg-terracotta-600 disabled:bg-terracotta-300 disabled:cursor-not-allowed text-white px-4 py-2 font-medium transition-colors rounded-md flex-1 cursor-pointer"
                >
                  {isLoading ? "Setting..." : "Set as Default"}
                </button>
                <button
                  onClick={() =>
                    setDefaultConfirm({
                      show: false,
                      addressId: "",
                      addressName: "",
                    })
                  }
                  disabled={isLoading}
                  className="flex-1 border border-stone-300 text-stone-700 hover:bg-stone-50 disabled:opacity-50 px-4 py-2 font-medium transition-colors rounded-md cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {addresses.length === 0 && !showNewForm ? (
          <div className="text-center py-8 text-stone-500">
            <MapPin className="w-12 h-12 mx-auto mb-4 text-stone-300" />
            <p className="text-lg font-medium mb-2">No addresses saved</p>
            <p className="text-sm">
              Add your first shipping address to get started.
            </p>
          </div>
        ) : (
          <div className="space-y-4">{addressList}</div>
        )}

        {/* New Address Form */}
        {showNewForm && (
          <div className="mt-6 border border-clay-200 p-4 bg-clay-50 rounded-lg">
            <h4 className="font-semibold text-stone-900 mb-4">
              Add New Address
            </h4>
            <AddressForm
              data={newAddressData}
              onChange={handleNewFieldChange}
              onSave={handleCreateAddress}
              onCancel={handleCancelNew}
              isNew={true}
              isLoading={isLoading}
            />
          </div>
        )}
      </div>
    </div>
  );
}
