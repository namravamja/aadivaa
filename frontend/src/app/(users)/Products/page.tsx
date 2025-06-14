"use client";

import { Suspense, use } from "react";
import ProductsGrid from "./components/ProductsGrid";
import ProductFilters from "./components/ProductFilters";
import ProductsLoading from "./loading";
import { useGetAllProductsQuery } from "@/services/api/productApi";

export default function Products({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // Unwrap searchParams using React.use()
  const params = use(searchParams);

  // Extract filter parameters from URL
  const category =
    typeof params.category === "string" ? params.category : "all";
  const priceRange = typeof params.price === "string" ? params.price : "all";
  const sort = typeof params.sort === "string" ? params.sort : "featured";
  const search = typeof params.q === "string" ? params.q : "";

  // Fetch products data
  const {
    data: productsData,
    isLoading,
    error,
  } = useGetAllProductsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  console.log(productsData);

  // Generate dynamic filter options from API data
  const categories = productsData
    ? [
        { id: "all", name: "All Products" },
        ...Array.from(
          new Set(productsData.map((product: any) => product.category))
        ).map((cat) => {
          const catStr = typeof cat === "string" ? cat : String(cat);
          return {
            id: catStr.toLowerCase().replace(/\s+/g, "-"),
            name: catStr,
          };
        }),
      ]
    : [{ id: "all", name: "All Products" }];

  // Generate price ranges based on actual product prices
  const priceRanges = [
    { id: "all", name: "All Prices" },
    { id: "under-50", name: "Under ₹50" },
    { id: "50-100", name: "₹50 - ₹100" },
    { id: "100-200", name: "₹100 - ₹200" },
    { id: "over-200", name: "Over ₹200" },
  ];

  if (isLoading) {
    return <ProductsLoading />;
  }

  if (error) {
    return (
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-stone-900 mb-2">
              Error loading products
            </h3>
            <p className="text-stone-600">Please try again later</p>
          </div>
        </div>
      </main>
    );
  }

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
              selectedCategory={category}
              selectedPriceRange={priceRange}
              searchQuery={search}
            />
          </div>

          {/* Products grid */}
          <div className="flex-1">
            <Suspense fallback={<ProductsLoading />}>
              <ProductsGrid
                products={productsData || []}
                category={category}
                priceRange={priceRange}
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
