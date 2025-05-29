"use client";

import { useState } from "react";
import { ShoppingBag, Check } from "lucide-react";

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

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const addToCart = () => {
    // In a real app, this would call an API to add the product to the cart
    console.log(
      `Adding product ${productId} to cart with quantity ${quantity}`
    );

    setIsAdded(true);

    // Reset the button state after 2 seconds
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  return (
    <div className="flex flex-col w-full sm:w-auto">
      <div className="flex border border-stone-300 mb-3">
        <button
          type="button"
          onClick={decreaseQuantity}
          disabled={quantity <= 1 || disabled}
          className="px-4 py-2 text-stone-600 hover:bg-stone-100 disabled:opacity-50 disabled:cursor-not-allowed"
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
          disabled={disabled}
          className="px-4 py-2 text-stone-600 hover:bg-stone-100 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>

      <button
        onClick={addToCart}
        disabled={disabled}
        className={`flex items-center justify-center px-6 py-3 font-medium transition-colors ${
          disabled
            ? "bg-stone-300 text-stone-500 cursor-not-allowed"
            : isAdded
            ? "bg-green-600 text-white"
            : "bg-terracotta-600 text-white hover:bg-terracotta-700"
        }`}
      >
        {isAdded ? (
          <>
            <Check className="w-5 h-5 mr-2" /> Added to Cart
          </>
        ) : (
          <>
            <ShoppingBag className="w-5 h-5 mr-2" /> Add to Cart
          </>
        )}
      </button>
    </div>
  );
}
