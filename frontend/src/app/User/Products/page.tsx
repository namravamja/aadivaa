import { Suspense } from "react";
import ProductsGrid from "./components/ProductsGrid";
import ProductFilters from "./components/ProductFilters";
import ProductsLoading from "./loading";

// Mock categories for the filter
const categories = [
  { id: "all", name: "All Products" },
  { id: "jewelry", name: "Jewelry" },
  { id: "textiles", name: "Textiles" },
  { id: "decor", name: "Home Decor" },
  { id: "accessories", name: "Accessories" },
  { id: "pottery", name: "Pottery" },
];

// Mock price ranges for the filter
const priceRanges = [
  { id: "all", name: "All Prices" },
  { id: "under-50", name: "Under $50" },
  { id: "50-100", name: "$ 50 - 100" },
  { id: "100-200", name: "$ 100 - 200" },
  { id: "over-200", name: "Over $200" },
];

// Mock tribes for the filter
const tribes = [
  { id: "all", name: "All Tribes" },
  { id: "navajo", name: "Navajo" },
  { id: "hopi", name: "Hopi" },
  { id: "cherokee", name: "Cherokee" },
  { id: "zuni", name: "Zuni" },
  { id: "apache", name: "Apache" },
];

export default function Products({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // Extract filter parameters from URL
  const category =
    typeof searchParams.category === "string" ? searchParams.category : "all";
  const priceRange =
    typeof searchParams.price === "string" ? searchParams.price : "all";
  const tribe =
    typeof searchParams.tribe === "string" ? searchParams.tribe : "all";
  const sort =
    typeof searchParams.sort === "string" ? searchParams.sort : "featured";
  const search = typeof searchParams.q === "string" ? searchParams.q : "";

  return (
    <main className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-light text-stone-900 mb-2">
            Shop Our Collection
          </h1>
          <p className="text-stone-600">
            Discover authentic handcrafted items from tribal communities across
            the globe.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters sidebar */}
          <div className="w-full lg:w-64 shrink-0">
            <ProductFilters
              categories={categories}
              priceRanges={priceRanges}
              tribes={tribes}
              selectedCategory={category}
              selectedPriceRange={priceRange}
              selectedTribe={tribe}
              searchQuery={search}
            />
          </div>

          {/* Products grid */}
          <div className="flex-1">
            <Suspense fallback={<ProductsLoading />}>
              <ProductsGrid
                category={category}
                priceRange={priceRange}
                tribe={tribe}
                sort={sort}
                search={search}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  );
}
