"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Plus,
  Filter,
  Eye,
  Package,
  Grid,
  List,
  ChevronDown,
  SlidersHorizontal,
} from "lucide-react";

// Mock products data
const mockProducts = [
  {
    id: "1",
    name: "Beaded Necklace",
    price: 45.99,
    image: "/placeholder.svg?height=80&width=80",
    category: "Jewelry",
    createdAt: "2023-04-15",
  },
  {
    id: "2",
    name: "Ceramic Vase",
    price: 65.0,
    image: "/placeholder.svg?height=80&width=80",
    category: "Pottery",
    createdAt: "2023-04-10",
  },
  {
    id: "3",
    name: "Woven Basket",
    price: 75.0,
    image: "/placeholder.svg?height=80&width=80",
    category: "Home Decor",
    createdAt: "2023-04-08",
  },
  {
    id: "4",
    name: "Turquoise Bracelet",
    price: 120.0,
    image: "/placeholder.svg?height=80&width=80",
    category: "Jewelry",
    createdAt: "2023-04-05",
  },
  {
    id: "5",
    name: "Handwoven Scarf",
    price: 89.99,
    image: "/placeholder.svg?height=80&width=80",
    category: "Textiles",
    createdAt: "2023-04-12",
  },
  {
    id: "6",
    name: "Leather Wallet",
    price: 55.0,
    image: "/placeholder.svg?height=80&width=80",
    category: "Accessories",
    createdAt: "2023-03-28",
  },
];

export default function ArtistProducts() {
  const [products, setProducts] = useState(mockProducts);
  const [filterCategory, setFilterCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Filter products based on category filter
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      filterCategory === "all" || product.category === filterCategory;
    return matchesCategory;
  });

  const categories = [
    "all",
    "Jewelry",
    "Pottery",
    "Home Decor",
    "Textiles",
    "Accessories",
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-light text-stone-900 mb-1 sm:mb-2">
            Products
          </h1>
          <p className="text-sm sm:text-base text-stone-600">
            Manage your product catalog
          </p>
        </div>
        <Link
          href="/Artist/Product/AddProduct"
          className="w-full sm:w-auto bg-terracotta-600 text-white rounded-md px-4 py-2.5 hover:bg-terracotta-700 transition-colors flex items-center justify-center text-sm sm:text-base"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Link>
      </div>

      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="w-full bg-white border border-stone-200 p-3.5 rounded-md flex items-center justify-between text-stone-700"
        >
          <span className="flex items-center">
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Filters
          </span>
          <span className="flex items-center text-sm text-stone-500">
            {filteredProducts.length} products
            <ChevronDown
              className={`w-4 h-4 ml-1 transition-transform ${
                showMobileFilters ? "rotate-180" : ""
              }`}
            />
          </span>
        </button>
      </div>

      {/* Filters */}
      <div
        className={`bg-white border border-stone-200 rounded-md shadow-sm mb-6 ${
          showMobileFilters ? "block" : "hidden lg:block"
        }`}
      >
        <div className="p-5 sm:p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              {/* Category Filter */}
              <div className="max-w-xs">
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full px-3 py-2.5 border border-stone-300 rounded-md focus:border-terracotta-500 focus:outline-none focus:ring-1 focus:ring-terracotta-500 text-sm appearance-none bg-white bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-no-repeat bg-[right_0.5rem_center] pr-10"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category === "all" ? "All Categories" : category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Right side with view toggle and count */}
            <div className="flex items-center justify-between lg:justify-end gap-4">
              {/* View Mode Toggle */}
              <div className="flex items-center">
                <div className="bg-stone-100 rounded-md p-1 flex">
                  <button
                    onClick={() => setViewMode("table")}
                    className={`p-2 rounded ${
                      viewMode === "table"
                        ? "bg-white shadow-sm text-terracotta-600"
                        : "text-stone-500"
                    }`}
                    title="Table view"
                  >
                    <List className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded ${
                      viewMode === "grid"
                        ? "bg-white shadow-sm text-terracotta-600"
                        : "text-stone-500"
                    }`}
                    title="Grid view"
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Results Count */}
              <div className="flex items-center text-stone-600 text-sm">
                <Filter className="w-4 h-4 mr-2" />
                {filteredProducts.length} product
                {filteredProducts.length !== 1 ? "s" : ""}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Display */}
      {viewMode === "grid" ? (
        /* Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white border border-stone-200 rounded-md shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="aspect-square relative">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4 sm:p-5">
                <h3 className="font-medium text-stone-900 mb-1 truncate">
                  {product.name}
                </h3>
                <p className="text-sm text-stone-500 mb-3">
                  {product.category}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-terracotta-700">
                    ${product.price.toFixed(2)}
                  </span>
                  <Link
                    href={`/Artist/Product/${product.id}`}
                    className="text-stone-400 hover:text-stone-600 transition-colors"
                    title="View"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white border border-stone-200 rounded-md shadow-sm overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-stone-50 border-b border-stone-200">
                <tr>
                  <th className="text-left py-3.5 px-5 xl:px-6 font-medium text-stone-900 text-sm w-1/2">
                    Product
                  </th>
                  <th className="text-left py-3.5 px-5 xl:px-6 font-medium text-stone-900 text-sm w-1/4">
                    Category
                  </th>
                  <th className="text-left py-3.5 px-5 xl:px-6 font-medium text-stone-900 text-sm w-1/6">
                    Price
                  </th>
                  <th className="text-center py-3.5 px-5 xl:px-6 font-medium text-stone-900 text-sm w-1/12">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-stone-100 hover:bg-stone-50 transition-colors"
                  >
                    <td className="py-4 px-5 xl:px-6 w-1/2">
                      <div className="flex items-center">
                        <div className="relative w-12 h-12 xl:w-14 xl:h-14 mr-4 flex-shrink-0">
                          <Image
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium text-stone-900 text-sm xl:text-base truncate">
                            {product.name}
                          </div>
                          <div className="text-xs xl:text-sm text-stone-500">
                            ID: {product.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-5 xl:px-6 text-stone-600 text-sm w-1/4">
                      {product.category}
                    </td>
                    <td className="py-4 px-5 xl:px-6 text-stone-900 font-medium text-sm w-1/6">
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="py-4 px-5 xl:px-6 text-center w-1/12">
                      <Link
                        href={`/Artist/Product/${product.id}`}
                        className="inline-flex items-center justify-center text-blue-600 hover:text-blue-800 transition-colors"
                        title="View"
                      >
                        <Eye className="w-5 h-5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile/Tablet Card View */}
          <div className="lg:hidden">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="border-b border-stone-100 last:border-b-0"
              >
                <div className="p-5 hover:bg-stone-50 transition-colors">
                  <div className="flex items-start space-x-4">
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="min-w-0 flex-1">
                          <h3 className="font-medium text-stone-900 text-sm sm:text-base truncate">
                            {product.name}
                          </h3>
                          <p className="text-xs sm:text-sm text-stone-500">
                            {product.category}
                          </p>
                        </div>
                      </div>

                      <div className="mb-3">
                        <span className="text-stone-500 text-xs sm:text-sm">
                          Price:
                        </span>
                        <span className="ml-1 font-medium text-terracotta-700 text-sm sm:text-base">
                          ${product.price.toFixed(2)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-xs text-stone-500">
                          ID: {product.id}
                        </div>
                        <Link
                          href={`/Artist/Product/${product.id}`}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          title="View"
                        >
                          <Eye className="w-5 h-5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="bg-white border border-stone-200 rounded-md shadow-sm">
          <div className="text-center py-16 px-6">
            <div className="text-stone-400 mb-6">
              <Package className="w-16 h-16 sm:w-20 sm:h-20 mx-auto" />
            </div>
            <h3 className="text-xl sm:text-2xl font-medium text-stone-900 mb-3">
              No products found
            </h3>
            <p className="text-stone-600 mb-8 text-sm sm:text-base max-w-md mx-auto">
              {filterCategory !== "all"
                ? "Try adjusting your filter criteria"
                : "Get started by adding your first product to the catalog"}
            </p>
            <Link
              href="/Artist/Product/AddProduct"
              className="inline-flex items-center px-5 py-2.5 bg-terracotta-600 text-white rounded-md hover:bg-terracotta-700 transition-colors text-sm sm:text-base"
            >
              <Plus className="w-4 h-4 mr-2" />
              {filterCategory !== "all"
                ? "Add Product"
                : "Add Your First Product"}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
