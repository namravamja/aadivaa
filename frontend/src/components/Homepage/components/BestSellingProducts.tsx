"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useGetAllProductsQuery } from "@/services/api/productApi"; // Update with your actual API path

// Define the product type based on your API response
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

export default function BestSellingProducts() {
  // Fetch products using RTK Query
  const {
    data: products = [],
    isLoading,
    error,
  } = useGetAllProductsQuery(undefined);

  // Display only first 4 products for featured section
  const featuredProducts = products.slice(0, 4);

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
          {featuredProducts.map((product: Product) => (
            <Link
              key={product.id}
              href={`/Products/${product.id}`}
              className="group cursor-pointer"
            >
              <div className="relative aspect-square mb-4 bg-stone-100">
                <Image
                  src={product.productImages[0] || "/placeholder.svg"}
                  alt={product.productName}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
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
                    ${parseFloat(product.sellingPrice).toFixed(2)}
                  </span>
                  {product.mrp !== product.sellingPrice && (
                    <span className="text-stone-400 text-sm line-through">
                      ${parseFloat(product.mrp).toFixed(2)}
                    </span>
                  )}
                </div>
                {parseInt(product.availableStock) === 0 && (
                  <p className="text-red-500 text-xs mt-1">Out of Stock</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
