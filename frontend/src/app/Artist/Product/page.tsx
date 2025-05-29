"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
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
    status: "active",
    stock: 12,
    sales: 45,
    createdAt: "2023-04-15",
  },
  {
    id: "2",
    name: "Ceramic Vase",
    price: 65.0,
    image: "/placeholder.svg?height=80&width=80",
    category: "Pottery",
    status: "active",
    stock: 8,
    sales: 32,
    createdAt: "2023-04-10",
  },
  {
    id: "3",
    name: "Woven Basket",
    price: 75.0,
    image: "/placeholder.svg?height=80&width=80",
    category: "Home Decor",
    status: "draft",
    stock: 5,
    sales: 18,
    createdAt: "2023-04-08",
  },
  {
    id: "4",
    name: "Turquoise Bracelet",
    price: 120.0,
    image: "/placeholder.svg?height=80&width=80",
    category: "Jewelry",
    status: "active",
    stock: 15,
    sales: 28,
    createdAt: "2023-04-05",
  },
  {
    id: "5",
    name: "Handwoven Scarf",
    price: 89.99,
    image: "/placeholder.svg?height=80&width=80",
    category: "Textiles",
    status: "active",
    stock: 20,
    sales: 67,
    createdAt: "2023-04-12",
  },
  {
    id: "6",
    name: "Leather Wallet",
    price: 55.0,
    image: "/placeholder.svg?height=80&width=80",
    category: "Accessories",
    status: "archived",
    stock: 0,
    sales: 15,
    createdAt: "2023-03-28",
  },
];

export default function ArtistProducts() {
  const [products, setProducts] = useState(mockProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Filter products based on search and filters
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || product.status === filterStatus;
    const matchesCategory =
      filterCategory === "all" || product.category === filterCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleDeleteProduct = (productId: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter((p) => p.id !== productId));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-sage-100 text-sage-800";
      case "draft":
        return "bg-clay-100 text-clay-800";
      case "archived":
        return "bg-stone-100 text-stone-800";
      default:
        return "bg-stone-100 text-stone-800";
    }
  };

  const categories = [
    "all",
    "Jewelry",
    "Pottery",
    "Home Decor",
    "Textiles",
    "Accessories",
  ];
  const statuses = ["all", "active", "draft", "archived"];

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
            Filters & Search
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
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative sm:col-span-2 lg:col-span-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-stone-300 rounded-md focus:border-terracotta-500 focus:outline-none focus:ring-1 focus:ring-terracotta-500 text-sm"
                />
              </div>

              {/* Category Filter */}
              <div>
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

              {/* Status Filter */}
              <div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2.5 border border-stone-300 rounded-md focus:border-terracotta-500 focus:outline-none focus:ring-1 focus:ring-terracotta-500 text-sm appearance-none bg-white bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-no-repeat bg-[right_0.5rem_center] pr-10"
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status === "all"
                        ? "All Statuses"
                        : status.charAt(0).toUpperCase() + status.slice(1)}
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
                <div className="absolute top-3 right-3">
                  <span
                    className={`px-2.5 py-1 text-xs rounded-full ${getStatusColor(
                      product.status
                    )}`}
                  >
                    {product.status}
                  </span>
                </div>
              </div>
              <div className="p-4 sm:p-5">
                <h3 className="font-medium text-stone-900 mb-1 truncate">
                  {product.name}
                </h3>
                <p className="text-sm text-stone-500 mb-3">
                  {product.category}
                </p>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg font-bold text-terracotta-700">
                    ${product.price.toFixed(2)}
                  </span>
                  <span
                    className={`text-sm ${
                      product.stock < 10 ? "text-red-600" : "text-stone-600"
                    }`}
                  >
                    Stock: {product.stock}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-stone-500">
                    {product.sales} sales
                  </span>
                  <div className="flex items-center space-x-3">
                    <Link
                      href={`/products/${product.id}`}
                      className="text-stone-400 hover:text-stone-600 transition-colors"
                      title="View"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <Link
                      href={`/Artist/products/${product.id}/edit`}
                      className="text-stone-400 hover:text-terracotta-600 transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="text-stone-400 hover:text-red-600 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
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
                  <th className="text-left py-3.5 px-5 xl:px-6 font-medium text-stone-900 text-sm">
                    Product
                  </th>
                  <th className="text-left py-3.5 px-5 xl:px-6 font-medium text-stone-900 text-sm">
                    Category
                  </th>
                  <th className="text-left py-3.5 px-5 xl:px-6 font-medium text-stone-900 text-sm">
                    Price
                  </th>
                  <th className="text-left py-3.5 px-5 xl:px-6 font-medium text-stone-900 text-sm">
                    Stock
                  </th>
                  <th className="text-left py-3.5 px-5 xl:px-6 font-medium text-stone-900 text-sm">
                    Sales
                  </th>
                  <th className="text-left py-3.5 px-5 xl:px-6 font-medium text-stone-900 text-sm">
                    Status
                  </th>
                  <th className="text-left py-3.5 px-5 xl:px-6 font-medium text-stone-900 text-sm">
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
                    <td className="py-4 px-5 xl:px-6">
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
                    <td className="py-4 px-5 xl:px-6 text-stone-600 text-sm">
                      {product.category}
                    </td>
                    <td className="py-4 px-5 xl:px-6 text-stone-900 font-medium text-sm">
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="py-4 px-5 xl:px-6">
                      <span
                        className={`text-sm ${
                          product.stock < 10 ? "text-red-600" : "text-stone-600"
                        }`}
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td className="py-4 px-5 xl:px-6 text-stone-600 text-sm">
                      {product.sales}
                    </td>
                    <td className="py-4 px-5 xl:px-6">
                      <span
                        className={`px-2.5 py-1 text-xs rounded-full ${getStatusColor(
                          product.status
                        )}`}
                      >
                        {product.status}
                      </span>
                    </td>
                    <td className="py-4 px-5 xl:px-6">
                      <div className="flex items-center space-x-3">
                        <Link
                          href={`/products/${product.id}`}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          title="View"
                        >
                          <Eye className="w-5 h-5" />
                        </Link>
                        <Link
                          href={`/Artist/products/${product.id}/edit`}
                          className="text-yellow-600 hover:text-yellow-700 transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-5 h-5" />
                        </Link>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-red-600 hover:text-red-700 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
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
                        <div className="ml-2 flex-shrink-0">
                          <span
                            className={`px-2.5 py-1 text-xs rounded-full ${getStatusColor(
                              product.status
                            )}`}
                          >
                            {product.status}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 text-xs sm:text-sm mb-3">
                        <div>
                          <span className="text-stone-500">Price:</span>
                          <span className="ml-1 font-medium text-terracotta-700">
                            ${product.price.toFixed(2)}
                          </span>
                        </div>
                        <div>
                          <span className="text-stone-500">Stock:</span>
                          <span
                            className={`ml-1 ${
                              product.stock < 10
                                ? "text-red-600"
                                : "text-stone-600"
                            }`}
                          >
                            {product.stock}
                          </span>
                        </div>
                        <div>
                          <span className="text-stone-500">Sales:</span>
                          <span className="ml-1 text-stone-600">
                            {product.sales}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-xs text-stone-500">
                          ID: {product.id}
                        </div>
                        <div className="flex items-center space-x-4">
                          <Link
                            href={`/products/${product.id}`}
                            className="text-blue-600 hover:text-blue-800 transition-colors"
                            title="View"
                          >
                            <Eye className="w-5 h-5" />
                          </Link>
                          <Link
                            href={`/Artist/products/${product.id}/edit`}
                            className="text-yellow-600 hover:text-yellow-700 transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-5 h-5" />
                          </Link>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-red-600 hover:text-red-700 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
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
              {searchTerm || filterStatus !== "all" || filterCategory !== "all"
                ? "Try adjusting your search or filter criteria"
                : "Get started by adding your first product to the catalog"}
            </p>
            <Link
              href="/Artist/Product/AddProduct"
              className="inline-flex items-center px-5 py-2.5 bg-terracotta-600 text-white rounded-md hover:bg-terracotta-700 transition-colors text-sm sm:text-base"
            >
              <Plus className="w-4 h-4 mr-2" />
              {searchTerm || filterStatus !== "all" || filterCategory !== "all"
                ? "Add Product"
                : "Add Your First Product"}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
