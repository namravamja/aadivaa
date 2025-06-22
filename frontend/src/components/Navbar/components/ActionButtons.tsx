"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Heart, ShoppingBag, RefreshCw } from "lucide-react";
import { useGetCartQuery } from "@/services/api/cartApi";
import { useGetWishlistQuery } from "@/services/api/wishlistApi";
import { useSimpleAuth } from "@/hooks/useSimpleAuth";

interface ActionButtonsProps {
  showWishlist?: boolean;
  showCart?: boolean;
}

export default function ActionButtons({
  showWishlist = true,
  showCart = true,
}: ActionButtonsProps) {
  const { isAuthenticated } = useSimpleAuth();

  // RTK Query hooks - only run if authenticated
  const {
    data: cartResponse,
    isLoading: cartLoading,
    error: cartError,
    refetch: refetchCart,
  } = useGetCartQuery(undefined, {
    skip: !isAuthenticated,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const {
    data: wishlistResponse,
    isLoading: wishlistLoading,
    error: wishlistError,
    refetch: refetchWishlist,
  } = useGetWishlistQuery(undefined, {
    skip: !isAuthenticated,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  // Extract cart items from the response, handling both old and new API response formats
  const cartItems = useMemo(() => {
    if (!cartResponse) return [];

    // Handle new Redis cache response format: {source: 'cache', data: [...]}
    if (cartResponse.data && Array.isArray(cartResponse.data)) {
      return cartResponse.data;
    }

    // Handle old direct array format: [...]
    if (Array.isArray(cartResponse)) {
      return cartResponse;
    }

    return [];
  }, [cartResponse]);

  // Extract wishlist items from the response, handling both old and new API response formats
  const wishlistItems = useMemo(() => {
    if (!wishlistResponse) return [];

    // Handle new Redis cache response format: {source: 'cache', data: [...]}
    if (wishlistResponse.data && Array.isArray(wishlistResponse.data)) {
      return wishlistResponse.data;
    }

    // Handle old direct array format: [...]
    if (Array.isArray(wishlistResponse)) {
      return wishlistResponse;
    }

    return [];
  }, [wishlistResponse]);

  // Calculate counts safely
  const cartCount = useMemo(() => {
    if (!cartItems || cartItems.length === 0) return 0;

    return cartItems.reduce((total: number, item: any) => {
      return total + (item.quantity || 1);
    }, 0);
  }, [cartItems]);

  const wishlistCount = wishlistItems.length;

  return (
    <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4 xl:space-x-5">
      {showWishlist && (
        <>
          {wishlistError ? (
            <button
              onClick={() => refetchWishlist()}
              className="relative text-red-600 hover:text-red-700 transition-colors duration-300 p-1 rounded-md hover:bg-red-50 cursor-pointer"
              aria-label="Retry loading wishlist"
            >
              <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 md:w-4 md:h-4 lg:w-5 lg:h-5" />
            </button>
          ) : (
            <Link
              href="/Buyer/Wishlist"
              className="relative text-stone-600 hover:text-terracotta-600 transition-colors duration-300 p-1 rounded-md hover:bg-stone-50"
              aria-label={`Wishlist (${wishlistCount} items)`}
            >
              <Heart className="w-4 h-4 sm:w-5 sm:h-5 md:w-4 md:h-4 lg:w-5 lg:h-5" />
              {!wishlistLoading && isAuthenticated && wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-terracotta-600 text-white text-xs w-4 h-4 sm:w-5 sm:h-5 md:w-4 md:h-4 flex items-center justify-center rounded-full font-medium shadow-sm text-[9px] sm:text-[10px] md:text-[9px] lg:text-xs">
                  {wishlistCount > 99 ? "99+" : wishlistCount}
                </span>
              )}
            </Link>
          )}
        </>
      )}

      {showCart && (
        <>
          {cartError ? (
            <button
              onClick={() => refetchCart()}
              className="relative text-red-600 hover:text-red-700 transition-colors duration-300 p-1 rounded-md hover:bg-red-50 cursor-pointer"
              aria-label="Retry loading cart"
            >
              <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 md:w-4 md:h-4 lg:w-5 lg:h-5" />
            </button>
          ) : (
            <Link
              href="/Buyer/Cart"
              className="relative text-stone-600 hover:text-terracotta-600 transition-colors duration-300 p-1 rounded-md hover:bg-stone-50"
              aria-label={`Cart (${cartCount} items)`}
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 md:w-4 md:h-4 lg:w-5 lg:h-5" />
              {!cartLoading && isAuthenticated && cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-terracotta-600 text-white text-xs w-4 h-4 sm:w-5 sm:h-5 md:w-4 md:h-4 flex items-center justify-center rounded-full font-medium shadow-sm text-[9px] sm:text-[10px] md:text-[9px] lg:text-xs">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>
          )}
        </>
      )}
    </div>
  );
}
