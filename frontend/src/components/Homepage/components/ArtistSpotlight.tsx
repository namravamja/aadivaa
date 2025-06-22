"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useGetartistsQuery } from "@/services/api/artistApi";

interface ArtistData {
  id: string;
  accountNumber: string;
  bankName: string;
  businessLogo: string;
  businessRegistrationNumber: string;
  businessType: string;
  createdAt: string;
  digitalSignature: string;
  email: string;
  fullName: string;
  gstNumber: string;
  ifscCode: string;
  inventoryVolume: string;
  mobile: string;
  panNumber: string;
  returnPolicy: string;
  shippingType: string;
  storeName: string;
  supportContact: string;
  termsAgreed: boolean;
  updatedAt: string;
  upiId: string;
  workingHours: string;
}

export default function ArtistSpotlight() {
  const {
    data: artistsResponse,
    isLoading,
    error,
  } = useGetartistsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  // Extract artists array from the response, handling both old and new API response formats
  const artists = useMemo(() => {
    if (!artistsResponse) return [];

    // Handle new Redis cache response format: {source: 'cache', data: [...]}
    if (artistsResponse.data && Array.isArray(artistsResponse.data)) {
      return artistsResponse.data;
    }

    // Handle old direct array format: [...]
    if (Array.isArray(artistsResponse)) {
      return artistsResponse;
    }

    return [];
  }, [artistsResponse]);

  if (isLoading) {
    return (
      <section className="py-16 sm:py-20 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <div className="text-stone-500">Loading artists...</div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 sm:py-20 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <div className="text-red-500">Error loading artists</div>
          </div>
        </div>
      </section>
    );
  }

  if (!artists || artists.length === 0) {
    return (
      <section className="py-16 sm:py-20 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <div className="text-stone-500">No artists found</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 sm:py-20 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-light text-stone-900 mb-4 sm:mb-0">
            Featured Artists
          </h2>
          <Link
            href="/Artists"
            className="flex items-center text-stone-900 hover:text-terracotta-600 transition-colors"
          >
            View all <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          {artists.slice(0, 3).map((artist: ArtistData) => (
            <Link
              key={artist.id}
              href={`/Artists/${artist.id}`}
              className="group"
            >
              <div className="relative aspect-square overflow-hidden mb-4 sm:mb-6">
                <Image
                  src={artist.businessLogo || "/Profile.jpg"}
                  alt={artist.fullName}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <h3 className="font-medium text-lg sm:text-xl text-stone-900 mb-1">
                {artist.fullName}
              </h3>
              <p className="text-stone-500">
                {artist.storeName} • {artist.businessType}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
