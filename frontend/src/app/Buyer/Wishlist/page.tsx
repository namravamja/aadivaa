"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, ShoppingBag, Heart } from "lucide-react";

// Mock wishlist data - in a real app, this would come from an API
const initialWishlistItems = [
  {
    id: "1",
    name: "Beaded Necklace",
    price: 45.99,
    image: "/products/necklace.jpg",
    artist: "Maya Johnson",
  },
  {
    id: "5",
    name: "Turquoise Bracelet",
    price: 120.0,
    image: "/products/bracelet.jpg",
    artist: "Sarah Blue",
  },
  {
    id: "9",
    name: "Beaded Earrings",
    price: 30.0,
    image: "/products/earrings.jpg",
    artist: "Lisa Thunder",
  },
];

export default function BuyerWishlist() {
  const [wishlistItems, setWishlistItems] = useState(initialWishlistItems);
  const [addedToCart, setAddedToCart] = useState<Record<string, boolean>>({});

  const removeFromWishlist = (productId: string) => {
    setWishlistItems(wishlistItems.filter((item) => item.id !== productId));
  };

  const addToCart = (productId: string) => {
    // In a real app, this would call an API to add the product to the cart
    console.log(`Adding product ${productId} to cart`);

    // Update the UI to show the item was added
    setAddedToCart((prev) => ({ ...prev, [productId]: true }));

    // Reset after 2 seconds
    setTimeout(() => {
      setAddedToCart((prev) => ({ ...prev, [productId]: false }));
    }, 2000);
  };

  return (
    <main className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-light text-stone-900 mb-2">
            My Wishlist
          </h1>
          <p className="text-stone-600">
            {wishlistItems.length}{" "}
            {wishlistItems.length === 1 ? "item" : "items"} saved to your
            wishlist
          </p>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="text-center py-16 bg-stone-50">
            <div className="mb-4">
              <Heart className="w-16 h-16 mx-auto text-stone-300" />
            </div>
            <h2 className="text-xl font-medium text-stone-900 mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-stone-600 mb-6">
              Browse our collection and add your favorite items to your
              wishlist.
            </p>
            <Link
              href="/products"
              className="inline-block px-6 py-3 bg-terracotta-600 text-white font-medium hover:bg-terracotta-700 transition-colors"
            >
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="border border-stone-200">
            {/* Header */}
            <div className="grid grid-cols-12 gap-4 p-4 bg-stone-50 border-b border-stone-200 md:grid">
              <div className="col-span-6">
                <span className="font-medium text-stone-900">Product</span>
              </div>
              <div className="col-span-2 text-center">
                <span className="font-medium text-stone-900">Price</span>
              </div>
              <div className="col-span-4 text-right">
                <span className="font-medium text-stone-900">Actions</span>
              </div>
            </div>

            {/* Wishlist Items */}
            {wishlistItems.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 border-b border-stone-200 items-center"
              >
                {/* Product */}
                <div className="col-span-1 md:col-span-6">
                  <div className="flex items-center">
                    <div className="relative w-16 h-16 mr-4">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <Link href={`/products/${item.id}`}>
                        <h3 className="font-medium text-stone-900 hover:text-terracotta-600 transition-colors">
                          {item.name}
                        </h3>
                      </Link>
                      <p className="text-stone-500 text-sm">By {item.artist}</p>
                    </div>
                  </div>
                </div>

                {/* Price */}
                <div className="col-span-1 md:col-span-2 text-left md:text-center">
                  <span className="text-stone-900">
                    ${item.price.toFixed(2)}
                  </span>
                </div>

                {/* Actions */}
                <div className="col-span-1 md:col-span-4 flex flex-col sm:flex-row gap-2 justify-end">
                  <button
                    onClick={() => addToCart(item.id)}
                    className={`flex items-center justify-center px-4 py-2 ${
                      addedToCart[item.id]
                        ? "bg-green-600 text-white"
                        : "bg-terracotta-600 text-white hover:bg-terracotta-700"
                    } transition-colors`}
                  >
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    {addedToCart[item.id] ? "Added" : "Add to Cart"}
                  </button>
                  <button
                    onClick={() => removeFromWishlist(item.id)}
                    className="flex items-center justify-center px-4 py-2 border border-stone-300 text-stone-700 hover:bg-stone-50 transition-colors"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Continue Shopping */}
        <div className="mt-8 text-center">
          <Link
            href="/products"
            className="inline-block px-6 py-3 border border-stone-900 text-stone-900 font-medium hover:bg-stone-50 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </main>
  );
}
