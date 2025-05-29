"use client";

import type React from "react";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Plus, Check } from "lucide-react";

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

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsWishlisted(!isWishlisted);
    // In a real app, this would call an API to update the wishlist
  };

  const addToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsAddedToCart(true);
    // In a real app, this would call an API to add the product to the cart

    // Reset the button state after 2 seconds
    setTimeout(() => {
      setIsAddedToCart(false);
    }, 2000);
  };

  return (
    <div className="group">
      <Link href={`/products/${product.id}`} className="block">
        <div className="relative aspect-square mb-4 bg-stone-100 overflow-hidden">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />

          <button
            onClick={toggleWishlist}
            className={`absolute top-4 right-4 p-2 rounded-full z-10 ${
              isWishlisted
                ? "bg-terracotta-600 text-white"
                : "bg-white text-stone-900 opacity-0 group-hover:opacity-100"
            } transition-all duration-300`}
            aria-label={
              isWishlisted ? "Remove from wishlist" : "Add to wishlist"
            }
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? "fill-white" : ""}`} />
          </button>

          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={addToCart}
              className="bg-white text-stone-900 px-4 sm:px-6 py-2 sm:py-3 font-medium flex items-center"
              aria-label="Add to cart"
            >
              {isAddedToCart ? (
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
          <span className="text-stone-900">${product.price.toFixed(2)}</span>
        </div>
      </Link>
    </div>
  );
}
