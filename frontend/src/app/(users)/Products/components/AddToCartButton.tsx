"use client";

import { useState } from "react";
import { ShoppingBag, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAddToCartMutation, useGetCartQuery } from "@/services/api/cartApi";
import { useAuth } from "@/hooks/useAuth";

type AddToCartButtonProps = {
  productId: string;
  disabled?: boolean;
};

export default function AddToCartButton({
  productId,
  disabled = false,
}: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

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
    setQuantity(quantity + 1);
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to your cart", {
        duration: 3000,
        icon: "🔒",
      });
      router.push("/Buyer/login");
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

      // Refetch cart data after mutation
      await refetchCart();

      // Reset the button state after 2 seconds
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
          disabled={disabled || !isAuthenticated}
          className="px-4 py-2 text-stone-600 hover:bg-stone-100 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>

      <button
        onClick={handleAddToCart}
        disabled={disabled || isLoading || !isAuthenticated}
        className={`flex items-center justify-center px-6 py-3 font-medium transition-colors cursor-pointer ${
          disabled || !isAuthenticated
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
            {!isAuthenticated ? "Login to Add to Cart" : "Add to Cart"}
          </>
        )}
      </button>
    </div>
  );
}
