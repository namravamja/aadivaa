"use client";

import { useState } from "react";
import { Heart } from "lucide-react";

type WishlistButtonProps = {
  productId: string;
};

export default function WishlistButton({ productId }: WishlistButtonProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const toggleWishlist = () => {
    // In a real app, this would call an API to update the wishlist
    console.log(
      `${isWishlisted ? "Removing" : "Adding"} product ${productId} ${
        isWishlisted ? "from" : "to"
      } wishlist`
    );
    setIsWishlisted(!isWishlisted);
  };

  return (
    <button
      onClick={toggleWishlist}
      className={`flex items-center justify-center px-6 py-3 font-medium border transition-colors ${
        isWishlisted
          ? "bg-terracotta-50 border-terracotta-600 text-terracotta-600"
          : "border-stone-900 text-stone-900 hover:bg-stone-50"
      }`}
    >
      <Heart
        className={`w-5 h-5 mr-2 ${isWishlisted ? "fill-terracotta-600" : ""}`}
      />
      {isWishlisted ? "Wishlisted" : "Add to Wishlist"}
    </button>
  );
}
