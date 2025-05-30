"use client";

import Link from "next/link";
import { Search, Heart, ShoppingBag } from "lucide-react";

interface ActionButtonsProps {
  cartCount?: number;
  showSearch?: boolean;
  showWishlist?: boolean;
  showCart?: boolean;
}

export default function ActionButtons({
  cartCount = 3,
  showSearch = true,
  showWishlist = true,
  showCart = true,
}: ActionButtonsProps) {
  return (
    <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4 xl:space-x-5">
      {showSearch && (
        <button
          className="text-stone-600 hover:text-terracotta-600 transition-colors duration-300 p-1 rounded-md hover:bg-stone-50"
          aria-label="Search"
        >
          <Search className="w-4 h-4 sm:w-5 sm:h-5 md:w-4 md:h-4 lg:w-5 lg:h-5" />
        </button>
      )}

      {showWishlist && (
        <Link
          href="/Buyer/Wishlist"
          className="text-stone-600 hover:text-terracotta-600 transition-colors duration-300 p-1 rounded-md hover:bg-stone-50"
          aria-label="Wishlist"
        >
          <Heart className="w-4 h-4 sm:w-5 sm:h-5 md:w-4 md:h-4 lg:w-5 lg:h-5" />
        </Link>
      )}

      {showCart && (
        <Link
          href="/cart"
          className="relative text-stone-600 hover:text-terracotta-600 transition-colors duration-300 p-1 rounded-md hover:bg-stone-50"
          aria-label="Cart"
        >
          <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 md:w-4 md:h-4 lg:w-5 lg:h-5" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-terracotta-600 text-white text-xs w-4 h-4 sm:w-5 sm:h-5 md:w-4 md:h-4 flex items-center justify-center rounded-full font-medium shadow-sm text-[9px] sm:text-[10px] md:text-[9px] lg:text-xs">
              {cartCount > 99 ? "99+" : cartCount}
            </span>
          )}
        </Link>
      )}
    </div>
  );
}
