"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, ShoppingBag, Heart, ArrowLeft, User } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  useGetWishlistQuery,
  useRemoveFromWishlistMutation,
} from "@/services/api/wishlistApi";
import { useAddToCartMutation, useGetCartQuery } from "@/services/api/cartApi";
import { useAuth } from "@/hooks/useAuth";

export default function BuyerWishlist() {
  const [addedToCart, setAddedToCart] = useState<Record<string, boolean>>({});
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  // RTK Query hooks - only run if authenticated
  const {
    data: wishlistData,
    isLoading,
    error,
    refetch: refetchWishlist,
  } = useGetWishlistQuery(undefined, {
    skip: !isAuthenticated,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const { refetch: refetchCart } = useGetCartQuery(undefined, {
    skip: !isAuthenticated,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const [removeFromWishlist] = useRemoveFromWishlistMutation();
  const [addToCart, { isLoading: isAddingToCart }] = useAddToCartMutation();

  const wishlistItems = wishlistData || [];

  const handleRemoveFromWishlist = async (productId: string) => {
    try {
      await removeFromWishlist(productId).unwrap();
      toast.success("Removed from wishlist", {
        duration: 2000,
        icon: "💔",
      });
      // Refetch wishlist data after mutation
      await refetchWishlist();
    } catch (error: any) {
      console.error("Error removing from wishlist:", error);
      const errorMessage =
        error?.data?.message || error?.message || "Something went wrong";
      toast.error(errorMessage, {
        duration: 3000,
      });
    }
  };

  const handleAddToCart = async (productId: string) => {
    try {
      await addToCart({ productId, quantity: 1 }).unwrap();

      // Update the UI to show the item was added
      setAddedToCart((prev) => ({ ...prev, [productId]: true }));
      toast.success("Added to cart", {
        duration: 2000,
        icon: "🛒",
      });

      // Refetch cart data after mutation
      await refetchCart();

      // Reset after 2 seconds
      setTimeout(() => {
        setAddedToCart((prev) => ({ ...prev, [productId]: false }));
      }, 2000);
    } catch (error: any) {
      console.error(`Error adding product ${productId} to cart:`, error);
      const errorMessage =
        error?.data?.message || error?.message || "Something went wrong";
      toast.error(errorMessage, {
        duration: 3000,
      });
    }
  };

  // Show login prompt if not authenticated
  if (!authLoading && !isAuthenticated) {
    return (
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center py-16 bg-stone-50">
            <User className="w-16 h-16 mx-auto text-stone-300 mb-4" />
            <h2 className="text-xl font-medium text-stone-900 mb-2">
              Login Required
            </h2>
            <p className="text-stone-600 mb-6">
              Please login to view your wishlist.
            </p>
            <Link
              href="/Buyer/login"
              className="inline-block px-6 py-3 bg-terracotta-600 text-white font-medium hover:bg-terracotta-700 transition-colors"
            >
              Login to Continue
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (authLoading || isLoading) {
    return (
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-stone-200 rounded w-48 mb-2"></div>
            <div className="h-4 bg-stone-200 rounded w-64 mb-8"></div>
            <div className="border border-stone-200">
              <div className="grid grid-cols-12 gap-4 p-4 bg-stone-50 border-b border-stone-200">
                <div className="col-span-6 h-4 bg-stone-200 rounded"></div>
                <div className="col-span-2 h-4 bg-stone-200 rounded"></div>
                <div className="col-span-4 h-4 bg-stone-200 rounded"></div>
              </div>
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="grid grid-cols-12 gap-4 p-4 border-b border-stone-200 items-center"
                >
                  <div className="col-span-6 flex items-center">
                    <div className="w-16 h-16 bg-stone-200 rounded mr-4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-stone-200 rounded w-32"></div>
                      <div className="h-3 bg-stone-200 rounded w-24"></div>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <div className="h-4 bg-stone-200 rounded w-16"></div>
                  </div>
                  <div className="col-span-4 flex gap-2 justify-end">
                    <div className="h-8 bg-stone-200 rounded w-24"></div>
                    <div className="h-8 bg-stone-200 rounded w-20"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center py-16 bg-stone-50">
            <h2 className="text-xl font-medium text-stone-900 mb-2">
              Error loading wishlist
            </h2>
            <p className="text-stone-600 mb-6">Please try again later.</p>
            <button
              onClick={() => refetchWishlist()}
              className="inline-block px-6 py-3 bg-terracotta-600 text-white font-medium hover:bg-terracotta-700 transition-colors mr-4 cursor-pointer"
            >
              Retry
            </button>
            <Link
              href="/Products"
              className="inline-block px-6 py-3 border border-stone-300 text-stone-700 hover:bg-stone-50 font-medium transition-colors"
            >
              Explore Products
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/products"
            className="flex items-center text-stone-600 hover:text-terracotta-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to products
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-light text-stone-900 mb-2">
            My Wishlist
          </h1>
          <p className="text-stone-600">
            {wishlistItems.length}{" "}
            {wishlistItems.length === 1 ? "item" : "items"} saved to your
            wishlist
          </p>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="text-center py-16 bg-stone-50">
            <div className="mb-4">
              <Heart className="w-16 h-16 mx-auto text-stone-300" />
            </div>
            <h2 className="text-xl font-medium text-stone-900 mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-stone-600 mb-6">
              Browse our collection and add your favorite items to your
              wishlist.
            </p>
            <Link
              href="/Products"
              className="inline-block px-6 py-3 bg-terracotta-600 text-white font-medium hover:bg-terracotta-700 transition-colors"
            >
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="border border-stone-200">
            {/* Header */}
            <div className="grid grid-cols-12 gap-4 p-4 bg-stone-50 border-b border-stone-200 md:grid">
              <div className="col-span-6">
                <span className="font-medium text-stone-900">Product</span>
              </div>
              <div className="col-span-2 text-center">
                <span className="font-medium text-stone-900">Price</span>
              </div>
              <div className="col-span-4 text-right">
                <span className="font-medium text-stone-900">Actions</span>
              </div>
            </div>

            {/* Wishlist Items */}
            {wishlistItems.map((item: any) => (
              <div
                key={item.id}
                className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 border-b border-stone-200 items-center"
              >
                {/* Product */}
                <div className="col-span-1 md:col-span-6">
                  <div className="flex items-center">
                    <div className="relative w-16 h-16 mr-4">
                      <Image
                        src={
                          item.product.productImages?.[0] || "/placeholder.svg"
                        }
                        alt={item.product.productName}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <Link href={`/products/${item.product.id}`}>
                        <h3 className="font-medium text-stone-900 hover:text-terracotta-600 transition-colors">
                          {item.product.productName}
                        </h3>
                      </Link>
                      <p className="text-stone-500 text-sm">
                        By {item.product.artist?.fullName || "Unknown Artist"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Price */}
                <div className="col-span-1 md:col-span-2 text-left md:text-center">
                  <span className="text-stone-900">
                    ₹{Number.parseFloat(item.product.sellingPrice).toFixed(2)}
                  </span>
                </div>

                {/* Actions */}
                <div className="col-span-1 md:col-span-4 flex flex-col sm:flex-row gap-2 justify-end">
                  <button
                    onClick={() => handleAddToCart(item.product.id)}
                    disabled={isAddingToCart && addedToCart[item.product.id]}
                    className={`flex items-center justify-center px-4 py-2 cursor-pointer ${
                      addedToCart[item.product.id]
                        ? "bg-green-600 text-white"
                        : "bg-terracotta-600 text-white hover:bg-terracotta-700"
                    } transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <ShoppingBag
                      className={`w-4 h-4 mr-2 ${
                        isAddingToCart && addedToCart[item.product.id]
                          ? "animate-pulse"
                          : ""
                      }`}
                    />
                    {isAddingToCart && addedToCart[item.product.id]
                      ? "Adding..."
                      : addedToCart[item.product.id]
                      ? "Added"
                      : "Add to Cart"}
                  </button>
                  <button
                    onClick={() => handleRemoveFromWishlist(item.productId)}
                    className="flex items-center justify-center px-4 py-2 border border-stone-300 text-stone-700 hover:bg-stone-50 transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Continue Shopping */}
        <div className="mt-8 text-center">
          <Link
            href="/products"
            className="inline-block px-6 py-3 border border-stone-900 text-stone-900 font-medium hover:bg-stone-50 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </main>
  );
}
