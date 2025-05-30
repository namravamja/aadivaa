"use client";

import { useState } from "react";
import ProfileProgress from "./components/ProfileProgress";
import AccountDetails from "./components/AccountDetails";
import ShippingAddresses from "./components/ShippingAddresses";
import SecuritySettings from "./components/SecuritySettings";
import AccountInfo from "./components/AccountInfo";

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

interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  dateOfBirth?: string;
  gender?: string;
  addresses: Address[];
  createdAt: string;
}

// Mock user data
const mockUser: UserProfile = {
  id: "user1",
  email: "john.doe@example.com",
  firstName: "John",
  lastName: "Doe",
  phone: "+1 (555) 123-4567",
  avatar: "/placeholder.svg?height=100&width=100",
  dateOfBirth: "1990-05-15",
  gender: "male",
  addresses: [
    {
      id: "addr1",
      firstName: "John",
      lastName: "Doe",
      company: "Tech Corp",
      addressLine1: "123 Main Street",
      addressLine2: "Apt 4B",
      city: "New York",
      state: "NY",
      postalCode: "10001",
      country: "USA",
      phone: "+1 (555) 123-4567",
      isDefault: true,
    },
    {
      id: "addr2",
      firstName: "John",
      lastName: "Doe",
      addressLine1: "456 Oak Avenue",
      city: "Brooklyn",
      state: "NY",
      postalCode: "11201",
      country: "USA",
      phone: "+1 (555) 987-6543",
      isDefault: false,
    },
  ],
  createdAt: "2023-01-15T10:30:00Z",
};

export default function BuyerProfilePage() {
  const [user, setUser] = useState<UserProfile>(mockUser);
  const [isLoading, setIsLoading] = useState(false);

  const handleProfileUpdate = async (profileData: Partial<UserProfile>) => {
    setIsLoading(true);
    try {
      // API call would go here
      console.log("Updating profile:", profileData);
      setUser((prev) => ({ ...prev, ...profileData }));
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddressUpdate = async (
    addressId: string,
    updatedAddress: Address
  ) => {
    setIsLoading(true);
    try {
      // API call would go here
      setUser((prev) => ({
        ...prev,
        addresses: prev.addresses.map((addr) =>
          addr.id === addressId ? updatedAddress : addr
        ),
      }));
    } catch (error) {
      console.error("Failed to update address:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddressCreate = async (newAddress: Omit<Address, "id">) => {
    setIsLoading(true);
    try {
      // API call would go here
      const createdAddress: Address = {
        ...newAddress,
        id: `addr${Date.now()}`,
      };

      setUser((prev) => ({
        ...prev,
        addresses: [...prev.addresses, createdAddress],
      }));
    } catch (error) {
      console.error("Failed to create address:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddressDelete = async (addressId: string) => {
    setIsLoading(true);
    try {
      // API call would go here
      setUser((prev) => ({
        ...prev,
        addresses: prev.addresses.filter((addr) => addr.id !== addressId),
      }));
    } catch (error) {
      console.error("Failed to delete address:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetDefaultAddress = async (addressId: string) => {
    setIsLoading(true);
    try {
      // API call would go here
      setUser((prev) => ({
        ...prev,
        addresses: prev.addresses.map((addr) => ({
          ...addr,
          isDefault: addr.id === addressId,
        })),
      }));
    } catch (error) {
      console.error("Failed to set default address:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (passwords: {
    current: string;
    new: string;
    confirm: string;
  }) => {
    setIsLoading(true);
    try {
      // API call would go here
      console.log("Changing password");
    } catch (error) {
      console.error("Failed to change password:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-light text-stone-900 mb-2">
            My Profile
          </h1>
          <p className="text-stone-600">
            Manage your account information and preferences
          </p>
        </div>

        <div className="space-y-8">
          {/* Profile Progress */}
          <ProfileProgress user={user} />

          {/* Account Details */}
          <AccountDetails
            user={user}
            onUpdate={handleProfileUpdate}
            isLoading={isLoading}
          />

          {/* Shipping Addresses */}
          <ShippingAddresses
            addresses={user.addresses}
            onUpdate={handleAddressUpdate}
            onCreate={handleAddressCreate}
            onDelete={handleAddressDelete}
            onSetDefault={handleSetDefaultAddress}
            isLoading={isLoading}
          />

          {/* Security Settings */}
          <SecuritySettings
            onPasswordChange={handlePasswordChange}
            isLoading={isLoading}
          />

          {/* Account Info */}
          <AccountInfo user={user} />
        </div>
      </div>
    </main>
  );
}
