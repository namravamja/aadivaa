"use client";

import type React from "react";
import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Plus, Check, ShoppingBag, Share2 } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
  useGetWishlistQuery,
} from "@/services/api/wishlistApi";
import { useAddToCartMutation, useGetCartQuery } from "@/services/api/cartApi";
import { useAuthModal } from "@/app/(auth)/components/auth-modal-provider";
import { useSimpleAuth } from "@/hooks/useSimpleAuth";

type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  artist: string;
  category?: string;
  tribe?: string;
};

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useSimpleAuth();
  const { openBuyerLogin } = useAuthModal();

  const { data: wishlistResponse, refetch: refetchWishlist } =
    useGetWishlistQuery(undefined, {
      skip: !isAuthenticated,
      refetchOnFocus: true,
      refetchOnReconnect: true,
    });

  const { refetch: refetchCart } = useGetCartQuery(undefined, {
    skip: !isAuthenticated,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const [addToWishlist] = useAddToWishlistMutation();
  const [removeFromWishlist] = useRemoveFromWishlistMutation();
  const [addToCart, { isLoading: isAddingToCart }] = useAddToCartMutation();

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
        (item: any) => item.productId === product.id
      );
      setIsWishlisted(isInWishlist);
    }
  }, [wishlistData, product.id, isAuthenticated]);

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error("Please login to add items to your wishlist", {
        duration: 1000,
        icon: "🔒",
      });
      openBuyerLogin();
      return;
    }

    try {
      if (isWishlisted) {
        await removeFromWishlist(product.id).unwrap();
        setIsWishlisted(false);
        toast.success("Removed from wishlist", {
          duration: 2000,
          icon: "💔",
        });
      } else {
        await addToWishlist(product.id).unwrap();
        setIsWishlisted(true);
        toast.success("Added to wishlist", {
          duration: 2000,
          icon: "❤️",
        });
      }
      await refetchWishlist();
    } catch (error: any) {
      const errorMessage =
        error?.data?.message || error?.message || "Something went wrong";
      toast.error(errorMessage, { duration: 3000 });
    }
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error("Please login to add items to your cart", {
        duration: 1000,
        icon: "🔒",
      });
      openBuyerLogin();
      return;
    }

    try {
      await addToCart({ productId: product.id, quantity: 1 }).unwrap();
      setIsAddedToCart(true);
      toast.success("Added to cart", {
        duration: 2000,
        icon: "🛒",
      });
      await refetchCart();
      setTimeout(() => setIsAddedToCart(false), 2000);
    } catch (error: any) {
      const errorMessage =
        error?.data?.message || error?.message || "Something went wrong";
      toast.error(errorMessage, { duration: 3000 });
      setTimeout(() => setIsAddedToCart(false), 2000);
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();

    try {
      const productUrl = `https://aadivaa.shop/Products/${product.id}`;
      await navigator.clipboard.writeText(productUrl);
      toast.success("Link copied to clipboard", {
        duration: 2000,
        icon: "🔗",
      });
    } catch (error) {
      toast.error("Failed to copy link", { duration: 2000 });
    }
  };

  return (
    <div className="group">
      <Link href={`/Products/${product.id}`} className="block">
        <div className="relative aspect-square mb-4 bg-stone-100 overflow-hidden">
          <Image
            src={product.image || "/Profile.jpg"}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />

          <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
            <button
              onClick={toggleWishlist}
              className={`p-2 rounded-full cursor-pointer ${
                isAuthenticated && isWishlisted
                  ? "bg-terracotta-600 text-white"
                  : "bg-white text-stone-900 sm:opacity-0 sm:group-hover:opacity-100"
              } transition-all duration-300`}
              aria-label={
                isAuthenticated && isWishlisted
                  ? "Remove from wishlist"
                  : "Add to wishlist"
              }
            >
              <Heart
                className={`w-4 cursor-pointer h-4 ${
                  isAuthenticated && isWishlisted ? "fill-white" : ""
                }`}
              />
            </button>

            <button
              onClick={handleShare}
              className="p-2 rounded-full bg-white text-stone-900 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 cursor-pointer"
              aria-label="Share product"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          <div className="absolute inset-0 flex items-center justify-center sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart || authLoading}
              className="bg-white text-stone-900 px-4 cursor-pointer sm:px-6 py-2 sm:py-3 font-medium flex items-center disabled:opacity-50 disabled:cursor-not-allowed sm:flex"
              aria-label="Add to cart"
            >
              {isAddingToCart ? (
                <>
                  <ShoppingBag className="w-4 h-4 mr-2 animate-pulse" />{" "}
                  Adding...
                </>
              ) : isAddedToCart ? (
                <>
                  <Check className="w-4 h-4 mr-2" /> Added
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" /> Add to Cart
                </>
              )}
            </button>
          </div>
        </div>

        <div>
          <h3 className="font-medium text-stone-900 mb-1 group-hover:text-terracotta-600 transition-colors">
            {product.name}
          </h3>
          <p className="text-stone-500 text-sm mb-2">By {product.artist}</p>
          <span className="text-stone-900">₹{product.price.toFixed(2)}</span>
        </div>
      </Link>
    </div>
  );
}
