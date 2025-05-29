"use client";

import type React from "react";

import { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import { ChevronDown } from "lucide-react";

// Mock products data - in a real app, this would come from an API
const mockProducts = [
  {
    id: "1",
    name: "Beaded Necklace",
    price: 45.99,
    image: "/products/necklace.jpg",
    artist: "Maya Johnson",
    tribe: "navajo",
    category: "jewelry",
  },
  {
    id: "2",
    name: "Woven Wall Hanging",
    price: 89.99,
    image: "/products/wall-hanging.jpg",
    artist: "Tomas Rivera",
    tribe: "hopi",
    category: "decor",
  },
  {
    id: "3",
    name: "Ceramic Vase",
    price: 65.0,
    image: "/products/vase.jpg",
    artist: "Leila White",
    tribe: "cherokee",
    category: "pottery",
  },
  {
    id: "4",
    name: "Leather Pouch",
    price: 35.5,
    image: "/products/pouch.jpg",
    artist: "Daniel Black",
    tribe: "apache",
    category: "accessories",
  },
  {
    id: "5",
    name: "Turquoise Bracelet",
    price: 120.0,
    image: "/products/bracelet.jpg",
    artist: "Sarah Blue",
    tribe: "navajo",
    category: "jewelry",
  },
  {
    id: "6",
    name: "Handwoven Basket",
    price: 75.0,
    image: "/products/basket.jpg",
    artist: "Robert White",
    tribe: "hopi",
    category: "decor",
  },
  {
    id: "7",
    name: "Painted Pottery Bowl",
    price: 95.0,
    image: "/products/bowl.jpg",
    artist: "Maria Garcia",
    tribe: "zuni",
    category: "pottery",
  },
  {
    id: "8",
    name: "Dreamcatcher",
    price: 40.0,
    image: "/products/dreamcatcher.jpg",
    artist: "John Eagle",
    tribe: "cherokee",
    category: "decor",
  },
  {
    id: "9",
    name: "Beaded Earrings",
    price: 30.0,
    image: "/products/earrings.jpg",
    artist: "Lisa Thunder",
    tribe: "navajo",
    category: "jewelry",
  },
  {
    id: "10",
    name: "Woven Blanket",
    price: 250.0,
    image: "/products/blanket.jpg",
    artist: "Michael Cloud",
    tribe: "hopi",
    category: "textiles",
  },
  {
    id: "11",
    name: "Carved Wooden Mask",
    price: 180.0,
    image: "/products/mask.jpg",
    artist: "David Stone",
    tribe: "apache",
    category: "decor",
  },
  {
    id: "12",
    name: "Leather Moccasins",
    price: 85.0,
    image: "/products/moccasins.jpg",
    artist: "Emma River",
    tribe: "cherokee",
    category: "accessories",
  },
];

type ProductsGridProps = {
  category: string;
  priceRange: string;
  tribe: string;
  sort: string;
  search: string;
};

export default function ProductsGrid({
  category,
  priceRange,
  tribe,
  sort,
  search,
}: ProductsGridProps) {
  const [products, setProducts] = useState(mockProducts);
  const [sortOption, setSortOption] = useState(sort);

  // Filter and sort products based on the selected filters
  useEffect(() => {
    let filteredProducts = [...mockProducts];

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

    // Apply tribe filter
    if (tribe && tribe !== "all") {
      filteredProducts = filteredProducts.filter(
        (product) => product.tribe === tribe
      );
    }

    // Apply search filter
    if (search && search.trim() !== "") {
      const searchLower = search.toLowerCase();
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(searchLower) ||
          product.artist.toLowerCase().includes(searchLower) ||
          product.category.toLowerCase().includes(searchLower)
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
      case "newest":
        // In a real app, you would sort by date
        // Here we're just reversing the array as a placeholder
        filteredProducts.reverse();
        break;
      default:
        // "featured" - no specific sorting
        break;
    }

    setProducts(filteredProducts);
  }, [category, priceRange, tribe, search, sortOption]);

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
            onChange={handleSortChange}
            className="appearance-none bg-white border border-stone-300 px-4 py-2 pr-10 rounded-sm focus:outline-none focus:ring-1 focus:ring-terracotta-500 focus:border-terracotta-500"
          >
            <option value="featured">Featured</option>
            <option value="price-low-high">Price: Low to High</option>
            <option value="price-high-low">Price: High to Low</option>
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
