"use client";

import { useState, useEffect, useMemo } from "react";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
  useGetWishlistQuery,
} from "@/services/api/wishlistApi";
import { useAuthModal } from "@/app/(auth)/components/auth-modal-provider";
import { useSimpleAuth } from "@/hooks/useSimpleAuth";

type WishlistButtonProps = {
  productId: string;
};

export default function WishlistButton({ productId }: WishlistButtonProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useSimpleAuth();
  const { openBuyerLogin } = useAuthModal();

  const {
    data: wishlistResponse,
    isLoading: isLoadingWishlist,
    refetch: refetchWishlist,
  } = useGetWishlistQuery(undefined, {
    skip: !isAuthenticated,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const [addToWishlist, { isLoading: isAdding }] = useAddToWishlistMutation();
  const [removeFromWishlist, { isLoading: isRemoving }] =
    useRemoveFromWishlistMutation();

  // Extract wishlist data from cache response
  const wishlistData = useMemo(() => {
    if (!wishlistResponse) return [];

    // Handle new cache format: {source: 'cache'|'db', data: [...]}
    if (
      wishlistResponse &&
      typeof wishlistResponse === "object" &&
      "data" in wishlistResponse
    ) {
      return Array.isArray(wishlistResponse.data) ? wishlistResponse.data : [];
    }

    // Handle old direct format
    return Array.isArray(wishlistResponse) ? wishlistResponse : [];
  }, [wishlistResponse]);

  useEffect(() => {
    if (wishlistData && isAuthenticated) {
      const isInWishlist = wishlistData.some(
        (item: any) => item.productId === productId
      );
      setIsWishlisted(isInWishlist);
    }
  }, [wishlistData, productId, isAuthenticated]);

  const toggleWishlist = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to your wishlist", {
        duration: 1000,
        icon: "🔒",
      });
      openBuyerLogin(); // <-- 🔑 open login modal
      return;
    }

    try {
      if (isWishlisted) {
        await removeFromWishlist(productId).unwrap();
        setIsWishlisted(false);
        toast.success("Removed from wishlist", {
          duration: 2000,
          icon: "💔",
        });
      } else {
        await addToWishlist(productId).unwrap();
        setIsWishlisted(true);
        toast.success("Added to wishlist", {
          duration: 2000,
          icon: "❤️",
        });
      }
      await refetchWishlist();
    } catch (error: any) {
      console.error("Error updating wishlist:", error);
      const errorMessage =
        error?.data?.message || error?.message || "Something went wrong";
      toast.error(errorMessage, {
        duration: 3000,
      });
    }
  };

  const isLoading = isAdding || isRemoving || isLoadingWishlist || authLoading;

  return (
    <button
      onClick={toggleWishlist}
      disabled={isLoading}
      className={`flex items-center justify-center px-6 py-3 font-medium border transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
        isAuthenticated && isWishlisted
          ? "bg-terracotta-50 border-terracotta-600 text-terracotta-600"
          : "border-stone-900 text-stone-900 hover:bg-stone-50"
      }`}
    >
      <Heart
        className={`w-5 h-5 mr-2 ${
          isAuthenticated && isWishlisted ? "fill-terracotta-600" : ""
        }`}
      />
      {isLoading
        ? isWishlisted
          ? "Removing..."
          : "Adding..."
        : isAuthenticated && isWishlisted
        ? "Wishlisted"
        : "Add to Wishlist"}
    </button>
  );
}
