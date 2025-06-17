"use client";

import type React from "react";
import { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import { ChevronDown } from "lucide-react";

// Product type based on API response
type Product = {
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
  artist: {
    fullName: string;
  };
};

type ProductsGridProps = {
  products: Product[];
  category: string;
  priceRange: string;
  sort: string;
  search: string;
};

export default function ProductsGrid({
  products: apiProducts,
  category,
  priceRange,
  sort,
  search,
}: ProductsGridProps) {
  const [products, setProducts] = useState<any[]>([]);
  const [sortOption, setSortOption] = useState(sort);

  // Transform API products to match the expected format
  const transformedProducts = apiProducts.map((product) => ({
    id: product.id,
    name: product.productName,
    price: Number.parseFloat(product.sellingPrice),
    originalPrice: Number.parseFloat(product.mrp),
    image: product.productImages[0] || "/Profile.jpg?height=300&width=300",
    images: product.productImages,
    artist: product.artist.fullName || "Unknown Artist",
    category: product.category.toLowerCase().replace(/\s+/g, "-"),
    description: product.shortDescription,
    stock: Number.parseInt(product.availableStock),
    sku: product.skuCode,
    weight: product.weight,
    dimensions: {
      length: product.length,
      width: product.width,
      height: product.height,
    },
    shipping: {
      cost: Number.parseFloat(product.shippingCost),
      estimatedDelivery: product.deliveryTimeEstimate,
    },
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  }));

  // Filter and sort products based on the selected filters
  useEffect(() => {
    let filteredProducts = [...transformedProducts];

    // Apply category filter
    if (category && category !== "all") {
      filteredProducts = filteredProducts.filter(
        (product) => product.category === category
      );
    }

    // Apply price range filter
    if (priceRange && priceRange !== "all") {
      switch (priceRange) {
        case "under-50":
          filteredProducts = filteredProducts.filter(
            (product) => product.price < 50
          );
          break;
        case "50-100":
          filteredProducts = filteredProducts.filter(
            (product) => product.price >= 50 && product.price <= 100
          );
          break;
        case "100-200":
          filteredProducts = filteredProducts.filter(
            (product) => product.price > 100 && product.price <= 200
          );
          break;
        case "over-200":
          filteredProducts = filteredProducts.filter(
            (product) => product.price > 200
          );
          break;
      }
    }

    // Apply search filter
    if (search && search.trim() !== "") {
      const searchLower = search.toLowerCase();
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(searchLower) ||
          product.artist.toLowerCase().includes(searchLower) ||
          product.category.toLowerCase().includes(searchLower) ||
          product.description.toLowerCase().includes(searchLower)
      );
    }

    // Apply sorting
    switch (sortOption) {
      case "price-low-high":
        filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case "price-high-low":
        filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case "category-az":
        filteredProducts.sort((a, b) => a.category.localeCompare(b.category));
        break;
      case "category-za":
        filteredProducts.sort((a, b) => b.category.localeCompare(a.category));
        break;
      case "newest":
        filteredProducts.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      default:
        // "featured" - no specific sorting
        break;
    }

    setProducts(filteredProducts);
  }, [category, priceRange, search, sortOption, apiProducts]);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <p className="text-stone-600">
          Showing <span className="font-medium">{products.length}</span>{" "}
          products
        </p>
        <div className="relative">
          <select
            value={sortOption}
            onChange={(e) => {
              const newSort = e.target.value;
              setSortOption(newSort);

              // Update URL with new sort parameter
              const params = new URLSearchParams(window.location.search);
              if (newSort !== "featured") {
                params.set("sort", newSort);
              } else {
                params.delete("sort");
              }

              const newUrl = `${window.location.pathname}?${params.toString()}`;
              window.history.replaceState({}, "", newUrl);
            }}
            className="appearance-none bg-white border border-stone-300 px-4 py-2 pr-10 rounded-sm focus:outline-none focus:ring-1 focus:ring-terracotta-500 focus:border-terracotta-500"
          >
            <option value="featured">Featured</option>
            <option value="price-low-high">Price: Low to High</option>
            <option value="price-high-low">Price: High to Low</option>
            <option value="category-az">Category: A to Z</option>
            <option value="category-za">Category: Z to A</option>
            <option value="newest">Newest</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none text-stone-500" />
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-stone-900 mb-2">
            No products found
          </h3>
          <p className="text-stone-600">
            Try adjusting your filters or search term
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
