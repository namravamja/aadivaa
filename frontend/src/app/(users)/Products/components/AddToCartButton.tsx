"use client";

import { useState } from "react";
import { ShoppingBag, Check } from "lucide-react";
import toast from "react-hot-toast";
import { useAddToCartMutation, useGetCartQuery } from "@/services/api/cartApi";
import { useAuthModal } from "@/app/(auth)/components/auth-modal-provider";
import { useSimpleAuth } from "@/hooks/useSimpleAuth";

type AddToCartButtonProps = {
  productId: string;
  stockCount: number;
  disabled?: boolean;
};

export default function AddToCartButton({
  productId,
  stockCount,
  disabled = false,
}: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const { isAuthenticated, isLoading: authLoading } = useSimpleAuth();
  const { openBuyerLogin } = useAuthModal();

  const { refetch: refetchCart } = useGetCartQuery(undefined, {
    skip: !isAuthenticated,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const [addToCart, { isLoading: isAdding }] = useAddToCartMutation();

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    if (quantity < stockCount) {
      setQuantity(quantity + 1);
    } else {
      toast.error(`Only ${stockCount} items available in stock`, {
        duration: 2000,
        icon: "⚠️",
      });
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to your cart", {
        duration: 1000,
        icon: "🔒",
      });
      openBuyerLogin(); // 👈 Show login modal too
      return;
    }

    if (quantity > stockCount) {
      toast.error(`Cannot add more than ${stockCount} items`, {
        duration: 2000,
        icon: "⚠️",
      });
      return;
    }

    try {
      await addToCart({ productId, quantity }).unwrap();
      setIsAdded(true);
      toast.success(
        `Added ${quantity} item${quantity > 1 ? "s" : ""} to cart`,
        {
          duration: 2000,
          icon: "🛒",
        }
      );
      await refetchCart();
      setTimeout(() => {
        setIsAdded(false);
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

  const isLoading = isAdding || authLoading;

  return (
    <div className="flex flex-col w-full sm:w-auto">
      <div className="flex border border-stone-300 mb-3">
        <button
          type="button"
          onClick={decreaseQuantity}
          disabled={quantity <= 1 || disabled || !isAuthenticated}
          className="px-4 py-2 text-stone-600 hover:bg-stone-100 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Decrease quantity"
        >
          -
        </button>
        <div className="flex-1 flex items-center justify-center min-w-[3rem] px-2 border-x border-stone-300">
          {quantity}
        </div>
        <button
          type="button"
          onClick={increaseQuantity}
          disabled={disabled || !isAuthenticated || quantity >= stockCount}
          className="px-4 py-2 text-stone-600 hover:bg-stone-100 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>

      <div className="text-xs text-stone-500 mb-2">
        {stockCount > 0 ? `${stockCount} in stock` : "Out of stock"}
      </div>

      <button
        onClick={handleAddToCart}
        disabled={disabled || isLoading || stockCount === 0}
        className={`flex items-center justify-center px-6 py-3 font-medium transition-colors cursor-pointer ${
          disabled || stockCount === 0
            ? "bg-stone-300 text-stone-500 cursor-not-allowed"
            : isAdded
            ? "bg-green-600 text-white"
            : "bg-terracotta-600 text-white hover:bg-terracotta-700"
        }`}
      >
        {isLoading ? (
          <>
            <ShoppingBag className="w-5 h-5 mr-2 animate-pulse" /> Adding...
          </>
        ) : isAdded ? (
          <>
            <Check className="w-5 h-5 mr-2" /> Added to Cart
          </>
        ) : (
          <>
            <ShoppingBag className="w-5 h-5 mr-2" />
            {!isAuthenticated
              ? "Login to Add to Cart"
              : stockCount === 0
              ? "Out of Stock"
              : "Add to Cart"}
          </>
        )}
      </button>
    </div>
  );
}
