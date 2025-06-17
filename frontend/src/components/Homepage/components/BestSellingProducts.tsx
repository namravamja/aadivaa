"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart, Plus, Check, Share2 } from "lucide-react";
import toast from "react-hot-toast";
import { useGetAllProductsQuery } from "@/services/api/productApi";
import {
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
  useGetWishlistQuery,
} from "@/services/api/wishlistApi";
import { useAddToCartMutation, useGetCartQuery } from "@/services/api/cartApi";
import { useAuth } from "@/hooks/useAuth";
import { useAuthModal } from "@/app/(auth)/components/auth-modal-provider";

interface Product {
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

interface ProductCardState {
  isWishlisted: boolean;
  isAddedToCart: boolean;
}

export default function BestSellingProducts() {
  const [productStates, setProductStates] = useState<
    Record<string, ProductCardState>
  >({});
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { openBuyerLogin } = useAuthModal();

  const {
    data: products = [],
    isLoading,
    error,
  } = useGetAllProductsQuery(undefined);

  const { data: wishlistData, refetch: refetchWishlist } = useGetWishlistQuery(
    undefined,
    {
      skip: !isAuthenticated,
      refetchOnFocus: true,
      refetchOnReconnect: true,
    }
  );

  const { refetch: refetchCart } = useGetCartQuery(undefined, {
    skip: !isAuthenticated,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const [addToWishlist] = useAddToWishlistMutation();
  const [removeFromWishlist] = useRemoveFromWishlistMutation();
  const [addToCart] = useAddToCartMutation();

  const featuredProducts = useMemo(() => products.slice(0, 4), [products]);

  useEffect(() => {
    if (wishlistData && isAuthenticated && featuredProducts.length) {
      setProductStates((prev) => {
        const newStates: Record<string, ProductCardState> = { ...prev };
        featuredProducts.forEach((product: Product) => {
          const isInWishlist = wishlistData.some(
            (item: any) => item.productId === product.id
          );
          newStates[product.id] = {
            isWishlisted: isInWishlist,
            isAddedToCart: prev[product.id]?.isAddedToCart || false,
          };
        });
        return newStates;
      });
    }
  }, [wishlistData, isAuthenticated, featuredProducts]);

  const toggleWishlist = async (e: React.MouseEvent, productId: string) => {
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
      const currentState = productStates[productId];
      if (currentState?.isWishlisted) {
        await removeFromWishlist(productId).unwrap();
        setProductStates((prev) => ({
          ...prev,
          [productId]: { ...prev[productId], isWishlisted: false },
        }));
        toast.success("Removed from wishlist", {
          duration: 2000,
          icon: "💔",
        });
      } else {
        await addToWishlist(productId).unwrap();
        setProductStates((prev) => ({
          ...prev,
          [productId]: { ...prev[productId], isWishlisted: true },
        }));
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

  const handleAddToCart = async (e: React.MouseEvent, productId: string) => {
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
      await addToCart({ productId, quantity: 1 }).unwrap();
      setProductStates((prev) => ({
        ...prev,
        [productId]: { ...prev[productId], isAddedToCart: true },
      }));
      toast.success("Added to cart", {
        duration: 2000,
        icon: "🛒",
      });
      await refetchCart();
      setTimeout(() => {
        setProductStates((prev) => ({
          ...prev,
          [productId]: { ...prev[productId], isAddedToCart: false },
        }));
      }, 2000);
    } catch (error: any) {
      const errorMessage =
        error?.data?.message || error?.message || "Something went wrong";
      toast.error(errorMessage, { duration: 3000 });
      setTimeout(() => {
        setProductStates((prev) => ({
          ...prev,
          [productId]: { ...prev[productId], isAddedToCart: false },
        }));
      }, 2000);
    }
  };

  const handleShare = async (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    try {
      const productUrl = `https://aadivaa.shop/Products/${productId}`;
      await navigator.clipboard.writeText(productUrl);
      toast.success("Link copied to clipboard", {
        duration: 2000,
        icon: "🔗",
      });
    } catch (error) {
      toast.error("Failed to copy link", { duration: 2000 });
    }
  };

  if (isLoading) {
    return (
      <section className="py-16 sm:py-20 md:py-24 bg-stone-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <div className="text-stone-600">Loading products...</div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 sm:py-20 md:py-24 bg-stone-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <div className="text-red-600">Error loading products</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 sm:py-20 md:py-24 bg-stone-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-light text-stone-900 mb-4 sm:mb-0">
            Featured Products
          </h2>
          <Link
            href="/Products"
            className="flex items-center text-stone-900 hover:text-terracotta-600 transition-colors"
          >
            View all <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {featuredProducts.map((product: Product) => {
            const currentState = productStates[product.id] || {
              isWishlisted: false,
              isAddedToCart: false,
            };
            const isOutOfStock = parseInt(product.availableStock) === 0;

            return (
              <div key={product.id} className="group">
                <Link href={`/Products/${product.id}`} className="block">
                  <div className="relative aspect-square mb-4 bg-stone-100 overflow-hidden">
                    <Image
                      src={product.productImages[0] || "/Profile.jpg"}
                      alt={product.productName}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
                      <button
                        onClick={(e) => toggleWishlist(e, product.id)}
                        className={`p-2 rounded-full cursor-pointer ${
                          isAuthenticated && currentState.isWishlisted
                            ? "bg-terracotta-600 text-white"
                            : "bg-white text-stone-900 sm:opacity-0 sm:group-hover:opacity-100"
                        } transition-all duration-300`}
                        aria-label="Toggle wishlist"
                      >
                        <Heart
                          className={`w-4 h-4 ${
                            isAuthenticated && currentState.isWishlisted
                              ? "fill-white"
                              : ""
                          }`}
                        />
                      </button>

                      <button
                        onClick={(e) => handleShare(e, product.id)}
                        className="p-2 rounded-full bg-white text-stone-900 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 cursor-pointer"
                        aria-label="Share product"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>

                    {!isOutOfStock && (
                      <div className="absolute inset-0 flex items-center justify-center sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
                        <button
                          onClick={(e) => handleAddToCart(e, product.id)}
                          disabled={authLoading}
                          className="bg-white text-stone-900 px-4 sm:px-6 py-2 sm:py-3 font-medium flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                          aria-label="Add to cart"
                        >
                          {currentState.isAddedToCart ? (
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
                    )}
                  </div>
                </Link>
                <div>
                  <h3 className="font-medium text-stone-900 mb-1 group-hover:text-terracotta-600 transition-colors">
                    {product.productName}
                  </h3>
                  <p className="text-stone-500 text-sm mb-1">
                    {product.category}
                  </p>
                  <p className="text-stone-400 text-xs mb-2 line-clamp-2">
                    {product.shortDescription}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-stone-900 font-medium">
                      ₹{parseFloat(product.sellingPrice).toFixed(2)}
                    </span>
                    {product.mrp !== product.sellingPrice && (
                      <span className="text-stone-400 text-sm line-through">
                        ₹{parseFloat(product.mrp).toFixed(2)}
                      </span>
                    )}
                  </div>
                  {isOutOfStock && (
                    <p className="text-red-500 text-xs mt-1">Out of Stock</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
