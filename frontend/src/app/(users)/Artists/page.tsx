"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
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

export default function ArtistsPage() {
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
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center max-w-3xl mx-auto">
            <h1 className="text-3xl sm:text-4xl font-light text-stone-900 mb-4">
              Our Artists
            </h1>
            <p className="text-stone-600">Loading our talented artisans...</p>
          </div>

          {/* Loading skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white border border-stone-200 overflow-hidden"
              >
                <div className="aspect-square bg-stone-200 animate-pulse"></div>
                <div className="p-6">
                  <div className="h-6 bg-stone-200 animate-pulse mb-2"></div>
                  <div className="h-4 bg-stone-200 animate-pulse mb-3 w-2/3"></div>
                  <div className="h-4 bg-stone-200 animate-pulse mb-1"></div>
                  <div className="h-4 bg-stone-200 animate-pulse mb-1"></div>
                  <div className="h-4 bg-stone-200 animate-pulse w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center max-w-3xl mx-auto">
            <h1 className="text-3xl sm:text-4xl font-light text-stone-900 mb-4">
              Our Artists
            </h1>
            <p className="text-red-600">
              Sorry, we couldn't load the artists at this time. Please try again
              later.
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (!artists || artists.length === 0) {
    return (
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center max-w-3xl mx-auto">
            <h1 className="text-3xl sm:text-4xl font-light text-stone-900 mb-4">
              Our Artists
            </h1>
            <p className="text-stone-600">
              No artists found. Check back soon as we add more talented artisans
              to our platform.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-light text-stone-900 mb-4">
            Our Artists
          </h1>
          <p className="text-stone-600">
            Meet the talented artisans behind our products. Each artist brings
            generations of cultural knowledge and craftsmanship to their work,
            preserving traditions while creating contemporary pieces.
          </p>
        </div>

        {/* Best Artists */}
        {artists.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-light text-stone-900 mb-6 text-center">
              Best Artists
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {artists.slice(0, 4).map((artist: ArtistData) => (
                <Link
                  key={artist.id}
                  href={`/Artists/${artist.id}`}
                  className="group"
                >
                  <div className="bg-white border border-stone-200 overflow-hidden transition-all duration-300 group-hover:shadow-md">
                    <div className="relative aspect-square overflow-hidden">
                      <Image
                        src={artist.businessLogo || "/Profile.jpg"}
                        alt={artist.fullName}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-base text-stone-900 mb-1 group-hover:text-terracotta-600 transition-colors line-clamp-1">
                        {artist.fullName}
                      </h3>
                      <p className="text-stone-500 text-sm line-clamp-1">
                        {artist.storeName}
                      </p>
                      <p className="text-stone-400 text-sm line-clamp-1">
                        {artist.businessType}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Featured Artists */}
        {artists.length > 4 && (
          <section>
            <h2 className="text-xl font-light text-stone-900 mb-6 text-center">
              Featured Artists
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {artists.slice(4).map((artist: ArtistData) => (
                <Link
                  key={artist.id}
                  href={`/Artists/${artist.id}`}
                  className="group"
                >
                  <div className="bg-white border border-stone-200 overflow-hidden transition-all duration-300 group-hover:shadow-md">
                    <div className="relative aspect-square overflow-hidden">
                      <Image
                        src={artist.businessLogo || "/Profile.jpg"}
                        alt={artist.fullName}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium text-sm text-stone-900 mb-1 group-hover:text-terracotta-600 transition-colors line-clamp-1">
                        {artist.fullName}
                      </h3>
                      <p className="text-stone-500 text-xs line-clamp-1">
                        {artist.storeName}
                      </p>
                      <p className="text-stone-400 text-xs line-clamp-1">
                        {artist.businessType}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Show all artists in a single section if there are 6 or fewer total */}
        {artists.length <= 4 && artists.length > 0 && (
          <section>
            <h2 className="text-xl font-light text-stone-900 mb-6 text-center">
              Our Artists
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {artists.map((artist: ArtistData) => (
                <Link
                  key={artist.id}
                  href={`/Artists/${artist.id}`}
                  className="group"
                >
                  <div className="bg-white border border-stone-200 overflow-hidden transition-all duration-300 group-hover:shadow-md">
                    <div className="relative aspect-square overflow-hidden">
                      <Image
                        src={artist.businessLogo || "/Profile.jpg"}
                        alt={artist.fullName}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium text-sm text-stone-900 mb-1 group-hover:text-terracotta-600 transition-colors line-clamp-1">
                        {artist.fullName}
                      </h3>
                      <p className="text-stone-500 text-xs line-clamp-1">
                        {artist.storeName}
                      </p>
                      <p className="text-stone-400 text-xs line-clamp-1">
                        {artist.businessType}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
