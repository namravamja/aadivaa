"use client";

import type React from "react";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Search, X, ChevronDown } from "lucide-react";

type FilterOption = {
  id: string;
  name: string;
};

type ProductFiltersProps = {
  categories: FilterOption[];
  priceRanges: FilterOption[];
  tribes: FilterOption[];
  selectedCategory: string;
  selectedPriceRange: string;
  selectedTribe: string;
  searchQuery: string;
};

export default function ProductFilters({
  categories,
  priceRanges,
  tribes,
  selectedCategory,
  selectedPriceRange,
  selectedTribe,
  searchQuery,
}: ProductFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [search, setSearch] = useState(searchQuery);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Filter sections for mobile toggle
  const [openSections, setOpenSections] = useState({
    category: true,
    price: true,
    tribe: true,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const applyFilter = (type: string, value: string) => {
    // Create a URLSearchParams object with the current search parameters
    const params = new URLSearchParams();

    // Set the selected filters
    if (selectedCategory !== "all" && type !== "category")
      params.set("category", selectedCategory);
    if (selectedPriceRange !== "all" && type !== "price")
      params.set("price", selectedPriceRange);
    if (selectedTribe !== "all" && type !== "tribe")
      params.set("tribe", selectedTribe);
    if (search && search.trim() !== "") params.set("q", search);

    // Update the filter that was changed
    if (value !== "all") {
      params.set(type, value);
    }

    // Navigate to the new URL
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams();
    if (selectedCategory !== "all") params.set("category", selectedCategory);
    if (selectedPriceRange !== "all") params.set("price", selectedPriceRange);
    if (selectedTribe !== "all") params.set("tribe", selectedTribe);
    if (search && search.trim() !== "") params.set("q", search);

    router.push(`${pathname}?${params.toString()}`);
  };

  const clearAllFilters = () => {
    setSearch("");
    router.push(pathname);
  };

  const hasActiveFilters =
    selectedCategory !== "all" ||
    selectedPriceRange !== "all" ||
    selectedTribe !== "all" ||
    search !== "";

  return (
    <div className="sticky top-24">
      {/* Mobile filter toggle */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
          className="w-full flex items-center justify-between bg-white border border-stone-200 px-4 py-3"
        >
          <span className="font-medium">Filters</span>
          <ChevronDown
            className={`h-5 w-5 transition-transform ${
              mobileFiltersOpen ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      <div
        className={`space-y-6 ${
          mobileFiltersOpen ? "block" : "hidden lg:block"
        }`}
      >
        {/* Search */}
        <div>
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-stone-300 px-4 py-2 pr-10 focus:outline-none focus:ring-1 focus:ring-terracotta-500 focus:border-terracotta-500"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
            >
              <Search className="h-5 w-5" />
            </button>
          </form>
        </div>

        {/* Clear all filters */}
        {hasActiveFilters && (
          <div>
            <button
              onClick={clearAllFilters}
              className="flex items-center text-sm text-terracotta-600 hover:text-terracotta-700"
            >
              <X className="h-4 w-4 mr-1" />
              Clear all filters
            </button>
          </div>
        )}

        {/* Category filter */}
        <div>
          <div
            className="flex items-center justify-between cursor-pointer lg:cursor-default mb-2"
            onClick={() => toggleSection("category")}
          >
            <h3 className="font-medium text-stone-900">Category</h3>
            <ChevronDown
              className={`h-5 w-5 lg:hidden transition-transform ${
                openSections.category ? "rotate-180" : ""
              }`}
            />
          </div>
          {openSections.category && (
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center">
                  <button
                    onClick={() => applyFilter("category", category.id)}
                    className={`text-sm ${
                      selectedCategory === category.id
                        ? "text-terracotta-600 font-medium"
                        : "text-stone-600 hover:text-stone-900"
                    }`}
                  >
                    {category.name}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Price filter */}
        <div>
          <div
            className="flex items-center justify-between cursor-pointer lg:cursor-default mb-2"
            onClick={() => toggleSection("price")}
          >
            <h3 className="font-medium text-stone-900">Price Range</h3>
            <ChevronDown
              className={`h-5 w-5 lg:hidden transition-transform ${
                openSections.price ? "rotate-180" : ""
              }`}
            />
          </div>
          {openSections.price && (
            <div className="space-y-2">
              {priceRanges.map((price) => (
                <div key={price.id} className="flex items-center">
                  <button
                    onClick={() => applyFilter("price", price.id)}
                    className={`text-sm ${
                      selectedPriceRange === price.id
                        ? "text-terracotta-600 font-medium"
                        : "text-stone-600 hover:text-stone-900"
                    }`}
                  >
                    {price.name}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tribe filter */}
        <div>
          <div
            className="flex items-center justify-between cursor-pointer lg:cursor-default mb-2"
            onClick={() => toggleSection("tribe")}
          >
            <h3 className="font-medium text-stone-900">Tribe</h3>
            <ChevronDown
              className={`h-5 w-5 lg:hidden transition-transform ${
                openSections.tribe ? "rotate-180" : ""
              }`}
            />
          </div>
          {openSections.tribe && (
            <div className="space-y-2">
              {tribes.map((tribe) => (
                <div key={tribe.id} className="flex items-center">
                  <button
                    onClick={() => applyFilter("tribe", tribe.id)}
                    className={`text-sm ${
                      selectedTribe === tribe.id
                        ? "text-terracotta-600 font-medium"
                        : "text-stone-600 hover:text-stone-900"
                    }`}
                  >
                    {tribe.name}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
