"use client";

import Image from "next/image";
import Link from "next/link";
import { use } from "react";
import {
  ArrowLeft,
  MapPin,
  Clock,
  Phone,
  Globe,
  Instagram,
  Facebook,
  Twitter,
} from "lucide-react";
import { useGetartistsQuery } from "@/services/api/artistApi";
import { useGetProductByArtistIdQuery } from "@/services/api/productApi";

interface ProfileData {
  id: string;
  fullName: string;
  storeName: string;
  email: string;
  mobile: string;
  businessType: string;
  businessRegistrationNumber: string;
  productCategories: string[];
  businessLogo: string;
  businessAddress: {
    street: string;
    city: string;
    state: string;
    country: string;
    pinCode: string;
  };
  warehouseAddress: {
    sameAsBusiness: boolean;
    street: string;
    city: string;
    state: string;
    country: string;
    pinCode: string;
  };
  documents: {
    gstCertificate?: string;
    panCard?: string;
    businessLicense?: string;
    canceledCheque?: string;
  };
  bankAccountName: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  upiId: string;
  gstNumber: string;
  panNumber: string;
  shippingType: string;
  inventoryVolume: string;
  supportContact: string;
  workingHours: string;
  serviceAreas: string[];
  returnPolicy: string;
  socialLinks: {
    website: string;
    instagram: string;
    facebook: string;
    twitter: string;
  };
  termsAgreed: boolean;
  digitalSignature: string;
  profileProgress?: number;
}

interface ProductData {
  id: string;
  productName: string;
  category: string;
  shortDescription: string;
  sellingPrice: string;
  mrp: string;
  availableStock: string;
  skuCode: string;
  productImages: string[];
  weight: string;
  length: string;
  width: string;
  height: string;
  shippingCost: string;
  deliveryTimeEstimate: string;
  createdAt: string;
  updatedAt: string;
}

export default function ArtistDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const {
    data: products,
    isLoading: productsLoading,
    error: productsError,
  } = useGetProductByArtistIdQuery(id, {
    refetchOnMountOrArgChange: true,
  });
  console.log(products);

  const {
    data: artists,
    isLoading: artistsLoading,
    error: artistsError,
  } = useGetartistsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  // Find the specific artist
  const artist = artists?.find((a: ProfileData) => a.id === id);

  if (artistsLoading) {
    return (
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <div className="text-stone-500">Loading artist details...</div>
          </div>
        </div>
      </main>
    );
  }

  if (artistsError || !artist) {
    return (
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <div className="text-red-500">Artist not found</div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <Link
          href="/Artists"
          className="inline-flex items-center text-stone-600 hover:text-stone-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Artists
        </Link>

        {/* Artist Profile */}
        <div className="bg-white border border-stone-200 rounded-lg overflow-hidden mb-12">
          <div className="md:flex">
            {/* Artist Image */}
            <div className="md:w-1/3">
              <div className="relative aspect-square md:aspect-auto md:h-full">
                <Image
                  src={artist.businessLogo || "/Profile.jpg"}
                  alt={artist.fullName}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Artist Info */}
            <div className="md:w-2/3 p-6 md:p-8">
              <div className="mb-6">
                <h1 className="text-3xl font-light text-stone-900 mb-2">
                  {artist.fullName}
                </h1>
                <h2 className="text-xl text-stone-600 mb-4">
                  {artist.storeName}
                </h2>
                <div className="flex flex-wrap gap-2 mb-4">
                  {artist.productCategories &&
                  artist.productCategories.length > 0 ? (
                    artist.productCategories.map(
                      (category: string, index: number) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-stone-100 text-stone-700 text-sm rounded-full"
                        >
                          {category}
                        </span>
                      )
                    )
                  ) : (
                    <span className="text-stone-500 text-sm">
                      No categories available
                    </span>
                  )}
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {artist.businessAddress && (
                  <div className="flex items-center text-stone-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span className="text-sm">
                      {artist.businessAddress.city &&
                      artist.businessAddress.state
                        ? `${artist.businessAddress.city}, ${artist.businessAddress.state}`
                        : "Location not specified"}
                    </span>
                  </div>
                )}
                {artist.workingHours && (
                  <div className="flex items-center text-stone-600">
                    <Clock className="w-4 h-4 mr-2" />
                    <span className="text-sm">{artist.workingHours}</span>
                  </div>
                )}
                {artist.supportContact && (
                  <div className="flex items-center text-stone-600">
                    <Phone className="w-4 h-4 mr-2" />
                    <span className="text-sm">{artist.supportContact}</span>
                  </div>
                )}
                {artist.shippingType && (
                  <div className="flex items-center text-stone-600">
                    <span className="text-sm font-medium mr-2">Shipping:</span>
                    <span className="text-sm">{artist.shippingType}</span>
                  </div>
                )}
              </div>

              {/* Business Type */}
              {artist.businessType && (
                <div className="mb-6">
                  <h3 className="font-medium text-stone-900 mb-2">
                    Business Type
                  </h3>
                  <p className="text-stone-600">{artist.businessType}</p>
                </div>
              )}

              {/* Return Policy */}
              {artist.returnPolicy && (
                <div className="mb-6">
                  <h3 className="font-medium text-stone-900 mb-2">
                    Return Policy
                  </h3>
                  <p className="text-stone-600 text-sm">
                    {artist.returnPolicy}
                  </p>
                </div>
              )}

              {/* Social Links */}
              {artist.socialLinks &&
                (artist.socialLinks.website ||
                  artist.socialLinks.instagram ||
                  artist.socialLinks.facebook ||
                  artist.socialLinks.twitter) && (
                  <div>
                    <h3 className="font-medium text-stone-900 mb-3">Connect</h3>
                    <div className="flex gap-3">
                      {artist.socialLinks.website && (
                        <a
                          href={artist.socialLinks.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors"
                        >
                          <Globe className="w-4 h-4" />
                        </a>
                      )}
                      {artist.socialLinks.instagram && (
                        <a
                          href={artist.socialLinks.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors"
                        >
                          <Instagram className="w-4 h-4" />
                        </a>
                      )}
                      {artist.socialLinks.facebook && (
                        <a
                          href={artist.socialLinks.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors"
                        >
                          <Facebook className="w-4 h-4" />
                        </a>
                      )}
                      {artist.socialLinks.twitter && (
                        <a
                          href={artist.socialLinks.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors"
                        >
                          <Twitter className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>

        {/* Products Section */}
        <section>
          <h2 className="text-2xl font-light text-stone-900 mb-8">
            Products by {artist.fullName}
          </h2>

          {productsLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-white border border-stone-200 overflow-hidden"
                >
                  <div className="aspect-square bg-stone-200 animate-pulse"></div>
                  <div className="p-4">
                    <div className="h-4 bg-stone-200 animate-pulse mb-2"></div>
                    <div className="h-3 bg-stone-200 animate-pulse mb-2 w-2/3"></div>
                    <div className="h-4 bg-stone-200 animate-pulse w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {productsError && (
            <div className="text-center py-12">
              <p className="text-red-500">Error loading products</p>
            </div>
          )}

          {!productsLoading &&
            !productsError &&
            (!products || products.length === 0) && (
              <div className="text-center py-12">
                <p className="text-stone-500">
                  No products found for this artist
                </p>
              </div>
            )}

          {!productsLoading &&
            !productsError &&
            products &&
            products.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product: ProductData) => (
                  <Link
                    key={product.id}
                    href={`/Products/${product.id}`}
                    className="group bg-white border border-stone-200 overflow-hidden transition-all duration-300 hover:shadow-md"
                  >
                    <div className="relative aspect-square overflow-hidden">
                      <Image
                        src={product.productImages[0] || "/placeholder.svg"}
                        alt={product.productName}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      {Number.parseInt(product.availableStock) === 0 && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                          <span className="text-white font-medium">
                            Out of Stock
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-stone-900 mb-1 line-clamp-1 group-hover:text-terracotta-600 transition-colors">
                        {product.productName}
                      </h3>
                      <p className="text-stone-500 text-sm mb-2 line-clamp-1">
                        {product.category}
                      </p>
                      <p className="text-stone-600 text-sm mb-3 line-clamp-2">
                        {product.shortDescription}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-stone-900">
                            ₹{product.sellingPrice}
                          </span>
                          {product.mrp !== product.sellingPrice && (
                            <span className="text-stone-500 text-sm line-through">
                              ₹{product.mrp}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-stone-500">
                          Stock: {product.availableStock}
                        </span>
                      </div>
                      <div className="mt-2 text-xs text-stone-500">
                        Delivery: {product.deliveryTimeEstimate}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
        </section>
      </div>
    </main>
  );
}
