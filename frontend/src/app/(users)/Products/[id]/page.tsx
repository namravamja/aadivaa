"use client";

import { use, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Star, Share2 } from "lucide-react";
import toast from "react-hot-toast";
import AddToCartButton from "../components/AddToCartButton";
import WishlistButton from "../components/WishlistButton";
import ProductReviews from "../components/ProductReviews";
import { useGetProductByIdQuery } from "@/services/api/productApi";
import { useGetReviewsByProductQuery } from "@/services/api/buyerApi";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Unwrap params using React.use()
  const { id } = use(params);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Fetch specific product data by ID
  const {
    data: productResponse,
    isLoading,
    error,
  } = useGetProductByIdQuery(id, {
    refetchOnMountOrArgChange: true,
  });

  // Fetch review statistics
  const { data: reviewsResponse, isLoading: reviewsLoading } =
    useGetReviewsByProductQuery(id, {
      refetchOnMountOrArgChange: true,
    });

  // Extract product data from the response
  const apiProduct = useMemo(() => {
    if (!productResponse) return null;

    // Handle new Redis cache response format: {source: 'cache', data: {...}}
    if (productResponse.data && typeof productResponse.data === "object") {
      return productResponse.data;
    }

    // Handle old direct object format: {...}
    if (productResponse.id) {
      return productResponse;
    }

    return null;
  }, [productResponse]);

  // Extract reviews data from the response
  const reviews = useMemo(() => {
    if (!reviewsResponse) return [];

    // Handle new Redis cache response format: {source: 'cache', data: [...]}
    if (reviewsResponse.data && Array.isArray(reviewsResponse.data)) {
      return reviewsResponse.data;
    }

    // Handle old direct array format: [...]
    if (Array.isArray(reviewsResponse)) {
      return reviewsResponse;
    }

    return [];
  }, [reviewsResponse]);

  // Calculate review statistics
  const reviewStats = {
    averageRating:
      reviews.length > 0
        ? reviews.reduce((acc: number, review: any) => acc + review.rating, 0) /
          reviews.length
        : 0,
    reviewCount: reviews.length,
  };

  // Transform API product to match component format
  const product = apiProduct
    ? {
        id: apiProduct.id,
        name: apiProduct.productName,
        price: Number.parseFloat(apiProduct.sellingPrice),
        originalPrice: Number.parseFloat(apiProduct.mrp),
        description: apiProduct.shortDescription,
        images:
          apiProduct.productImages.length > 0 ? apiProduct.productImages : [""],
        artist: {
          id: apiProduct.artist.id,
          name: apiProduct.artist.fullName,
          email: apiProduct.artist.email,
          storeName: apiProduct.artist.storeName,
        },
        category: apiProduct.category,
        dimensions: `${apiProduct.length}" × ${apiProduct.width}" × ${apiProduct.height}"`,
        weight: `${apiProduct.weight}`,
        inStock: Number.parseInt(apiProduct.availableStock) > 0,
        stockCount: Number.parseInt(apiProduct.availableStock),
        rating: reviewStats.averageRating,
        reviewCount: reviewStats.reviewCount,
        sku: apiProduct.skuCode,
        shippingCost: Number.parseFloat(apiProduct.shippingCost),
        deliveryTime: apiProduct.deliveryTimeEstimate,
        createdAt: apiProduct.createdAt,
        updatedAt: apiProduct.updatedAt,
      }
    : null;

  const handleShare = async () => {
    const currentUrl = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.name || "Check out this product",
          text: `Check out ${product?.name} by ${product?.artist.name}`,
          url: currentUrl,
        });
        toast.success("Shared Open!", { duration: 2000 });
      } catch (error) {
        // User cancelled sharing or error occurred
        fallbackShare(currentUrl);
      }
    } else {
      fallbackShare(currentUrl);
    }
  };

  const fallbackShare = (url: string) => {
    navigator.clipboard
      .writeText(url)
      .then(() => {
        toast.success("Link copied to clipboard!", { duration: 2000 });
      })
      .catch(() => {
        toast.error("Failed to copy link", { duration: 2000 });
      });
  };

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  if (isLoading || reviewsLoading) {
    return (
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-4 bg-stone-200 rounded w-32 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="space-y-4">
                <div className="aspect-square bg-stone-200 rounded"></div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="aspect-square bg-stone-200 rounded"></div>
                  <div className="aspect-square bg-stone-200 rounded"></div>
                  <div className="aspect-square bg-stone-200 rounded"></div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-8 bg-stone-200 rounded w-3/4"></div>
                <div className="h-4 bg-stone-200 rounded w-1/2"></div>
                <div className="h-6 bg-stone-200 rounded w-1/4"></div>
                <div className="h-20 bg-stone-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-stone-900 mb-2">
              Product not found
            </h3>
            <p className="text-stone-600 mb-4">
              The product you're looking for doesn't exist.
            </p>
            <Link
              href="/Products"
              className="inline-flex items-center text-terracotta-600 hover:text-terracotta-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to products
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/Products"
            className="flex items-center text-stone-600 hover:text-terracotta-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to products
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-stone-100 rounded-lg overflow-hidden">
              <Image
                src={product.images[selectedImageIndex] || "/Profile.jpg"}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image: string, index: number) => (
                  <div
                    key={index}
                    className={`relative aspect-square bg-stone-100 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                      selectedImageIndex === index
                        ? "border-terracotta-600"
                        : "border-transparent hover:border-stone-300"
                    }`}
                    onClick={() => handleImageClick(index)}
                  >
                    <Image
                      src={image || "/Profile.jpg"}
                      alt={`${product.name} view ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-3xl font-light text-stone-900">
                {product.name}
              </h1>
              <button
                onClick={handleShare}
                className="p-2 rounded-full cursor-pointer bg-stone-100 hover:bg-stone-200 transition-colors"
                aria-label="Share product"
              >
                <Share2 className="w-5 h-5 text-stone-600" />
              </button>
            </div>

            {/* Artist Info */}
            <div className="flex items-center mb-4">
              <div className="flex flex-col">
                <span className="text-stone-600">
                  By{" "}
                  <span className="text-terracotta-600">
                    {product.artist.name}
                  </span>
                </span>
                {product.artist.storeName && (
                  <span className="text-xs text-stone-500">
                    Store: {product.artist.storeName}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center mb-4">
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating)
                        ? "text-yellow-400 fill-current"
                        : "text-stone-300"
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm text-stone-600">
                  {product.rating} ({product.reviewCount} reviews)
                </span>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center gap-3">
                <span className="text-2xl font-medium text-stone-900">
                  ₹{product.price.toFixed(2)}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-lg text-stone-500 line-through">
                    ₹{product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            <div className="mb-6">
              <p className="text-stone-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="mb-6 space-y-4">
              <div>
                <h3 className="text-sm font-medium text-stone-900 mb-1">
                  Category
                </h3>
                <span className="text-sm text-stone-600 bg-stone-100 px-3 py-1 rounded">
                  {product.category}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-medium text-stone-900 mb-1">SKU</h3>
                <p className="text-sm text-stone-600">{product.sku}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-stone-900 mb-1">
                  Dimensions
                </h3>
                <p className="text-sm text-stone-600">{product.dimensions}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-stone-900 mb-1">
                  Weight
                </h3>
                <p className="text-sm text-stone-600">{product.weight}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-stone-900 mb-1">
                  Shipping Cost
                </h3>
                <p className="text-sm text-stone-600">
                  ₹{product.shippingCost.toFixed(2)}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-stone-900 mb-1">
                  Delivery Time
                </h3>
                <p className="text-sm text-stone-600">{product.deliveryTime}</p>
              </div>
            </div>

            <div className="mb-8">
              <div className="flex items-center mb-2">
                <span
                  className={`inline-block w-3 h-3 rounded-full mr-2 ${
                    product.inStock ? "bg-green-500" : "bg-red-500"
                  }`}
                ></span>
                <span
                  className={
                    product.inStock ? "text-green-600" : "text-red-600"
                  }
                >
                  {product.inStock
                    ? `In stock (${product.stockCount} available)`
                    : "Out of stock"}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <AddToCartButton
                stockCount={product.stockCount}
                productId={product.id}
                disabled={!product.inStock}
              />
              <WishlistButton productId={product.id} />
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16">
          <ProductReviews productId={product.id} />
        </div>
      </div>
    </main>
  );
}
