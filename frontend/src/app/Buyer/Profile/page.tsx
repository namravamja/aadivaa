"use client";

import { useState, useEffect } from "react";
import { useGetBuyerQuery } from "@/services/api/buyerApi";
import ProfileProgress from "./components/ProfileProgress";
import AccountDetails from "./components/AccountDetails";
import ShippingAddresses from "./components/ShippingAddresses";
import SecuritySettings from "./components/SecuritySettings";
import AccountInfo from "./components/AccountInfo";
import { LoadingSkeleton } from "./components/loading-skeleton";

// Updated interface to match the Buyer model exactly
interface UserProfile {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
  dateOfBirth?: string;
  gender?: string;
  addresses: any[];
  createdAt: string;
  updatedAt: string;
}

// Helper function to format date for display
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

export default function BuyerProfilePage() {
  // Get buyer data for the profile progress component only
  const {
    data: buyerData,
    isLoading: isFetching,
    isError,
    error,
    refetch,
  } = useGetBuyerQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  // Local state for user profile (only used for ProfileProgress and AccountInfo)
  const [user, setUser] = useState<UserProfile | null>(null);

  // Update local state when API data changes
  useEffect(() => {
    if (buyerData) {
      // Ensure all required fields are present with defaults
      const processedData: UserProfile = {
        id: buyerData.id,
        email: buyerData.email,
        firstName: buyerData.firstName || undefined,
        lastName: buyerData.lastName || undefined,
        phone: buyerData.phone || undefined,
        avatar: buyerData.avatar || undefined,
        dateOfBirth: buyerData.dateOfBirth || undefined,
        gender: buyerData.gender || undefined,
        addresses: buyerData.addresses || [],
        createdAt: buyerData.createdAt,
        updatedAt: buyerData.updatedAt || buyerData.createdAt,
      };
      setUser(processedData);
    }
  }, [buyerData]);

  const handleRetry = () => {
    refetch();
  };

  // Error state
  if (isError && !user) {
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

          <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
            <div className="text-red-600 mb-6">
              <p className="text-lg font-medium mb-2">Failed to load profile</p>
              <p className="text-sm">
                {error && "status" in error && (
                  <span className="block">
                    Error {error.status}:{" "}
                    {typeof error.data === "object" &&
                    error.data &&
                    "message" in error.data
                      ? (error.data as { message: string }).message
                      : "Unknown error"}
                  </span>
                )}
                {!error && "Network error occurred"}
              </p>
            </div>
            <button
              onClick={handleRetry}
              className="bg-terracotta-600 hover:bg-terracotta-700 text-white px-6 py-3 font-medium transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </main>
    );
  }

  // Loading state
  if (isFetching && !user) {
    return (
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-8">
            <LoadingSkeleton height="h-8" className="mb-2 w-48" />
            <LoadingSkeleton height="h-5" className="w-80" />
          </div>

          <div className="space-y-8">
            {/* Profile Progress Loading */}
            <div className="bg-white border border-stone-200 shadow-sm">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <LoadingSkeleton height="h-6" className="mb-2 w-40" />
                    <LoadingSkeleton height="h-4" className="w-32" />
                  </div>
                  <LoadingSkeleton height="h-8" className="w-16" />
                </div>
                <LoadingSkeleton height="h-3" className="w-full mb-4" />
                <LoadingSkeleton lines={3} className="w-full" />
              </div>
            </div>

            {/* Account Details Loading */}
            <div className="bg-white border border-stone-200 shadow-sm">
              <div className="p-6 border-b border-stone-200">
                <div className="flex justify-between items-center">
                  <LoadingSkeleton height="h-6" className="w-40" />
                  <LoadingSkeleton height="h-10" className="w-32" />
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center space-x-6 mb-6">
                  <LoadingSkeleton height="h-20" className="w-20 rounded" />
                  <LoadingSkeleton height="h-8" className="w-32" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div key={index}>
                      <LoadingSkeleton height="h-4" className="mb-2 w-24" />
                      <LoadingSkeleton height="h-10" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Additional sections loading */}
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="bg-white border border-stone-200 shadow-sm"
              >
                <div className="p-6 border-b border-stone-200">
                  <LoadingSkeleton height="h-6" className="w-48" />
                </div>
                <div className="p-6">
                  <LoadingSkeleton lines={4} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  // No user data
  if (!user) {
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

          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <p className="text-stone-600 text-lg">
                No profile data available
              </p>
              <button
                onClick={handleRetry}
                className="mt-4 bg-terracotta-600 hover:bg-terracotta-700 text-white px-4 py-2 font-medium transition-colors"
              >
                Reload Profile
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

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
          {/* Profile Progress - still needs user data for progress calculation */}
          <ProfileProgress
            user={{
              ...user,
              firstName: user.firstName ?? "",
              lastName: user.lastName ?? "",
              dateOfBirth: user.dateOfBirth
                ? formatDateForDisplay(user.dateOfBirth)
                : "",
              // Map addresses to expected shape for ProfileProgress
              addresses: user.addresses.map((addr) => ({
                id: addr.id,
                firstName: addr.firstName,
                lastName: addr.lastName,
                addressLine1: addr.street || addr.addressLine1,
                city: addr.city,
                state: addr.state,
                postalCode: addr.postalCode,
                country: addr.country,
                phone: addr.phone,
                isDefault: addr.isDefault,
              })),
            }}
          />

          {/* Each component now manages its own data */}
          <AccountDetails />
          <ShippingAddresses />
          <SecuritySettings />
          <AccountInfo user={user} />
        </div>
      </div>
    </main>
  );
}
