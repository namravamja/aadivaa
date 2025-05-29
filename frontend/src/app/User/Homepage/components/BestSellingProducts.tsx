"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Plus, ArrowRight } from "lucide-react";

// Mock data - in a real app, this would come from RTK Query
const products = [
  {
    id: "1",
    name: "Beaded Necklace",
    price: 45.99,
    image: "/products/necklace.jpg",
    artist: "Maya Johnson",
  },
  {
    id: "2",
    name: "Woven Wall Hanging",
    price: 89.99,
    image: "/products/wall-hanging.jpg",
    artist: "Tomas Rivera",
  },
  {
    id: "3",
    name: "Ceramic Vase",
    price: 65.0,
    image: "/products/vase.jpg",
    artist: "Leila White",
  },
  {
    id: "4",
    name: "Leather Pouch",
    price: 35.5,
    image: "/products/pouch.jpg",
    artist: "Daniel Black",
  },
];

export default function BestSellingProducts() {
  const [wishlist, setWishlist] = useState<string[]>([]);

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  return (
    <section className="py-16 sm:py-20 md:py-24 bg-stone-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-light text-stone-900 mb-4 sm:mb-0">
            Featured Products
          </h2>
          <Link
            href="/products"
            className="flex items-center text-stone-900 hover:text-terracotta-600 transition-colors"
          >
            View all <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {products.map((product) => (
            <div key={product.id} className="group">
              <div className="relative aspect-square mb-4 bg-stone-100">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`absolute top-4 right-4 p-2 rounded-full ${
                    wishlist.includes(product.id)
                      ? "bg-terracotta-600 text-white"
                      : "bg-white text-stone-900 opacity-0 group-hover:opacity-100"
                  } transition-all duration-300`}
                  aria-label={
                    wishlist.includes(product.id)
                      ? "Remove from wishlist"
                      : "Add to wishlist"
                  }
                >
                  <Heart
                    className={`w-4 h-4 ${
                      wishlist.includes(product.id) ? "fill-white" : ""
                    }`}
                  />
                </button>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    className="bg-white text-stone-900 px-4 sm:px-6 py-2 sm:py-3 font-medium flex items-center"
                    aria-label="Add to cart"
                  >
                    <Plus className="w-4 h-4 mr-2" /> Add to Cart
                  </button>
                </div>
              </div>
              <div>
                <Link href={`/products/${product.id}`}>
                  <h3 className="font-medium text-stone-900 mb-1 hover:text-terracotta-600 transition-colors">
                    {product.name}
                  </h3>
                </Link>
                <p className="text-stone-500 text-sm mb-2">
                  By {product.artist}
                </p>
                <span className="text-stone-900">
                  ${product.price.toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
