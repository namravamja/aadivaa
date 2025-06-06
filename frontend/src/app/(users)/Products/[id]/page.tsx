import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import AddToCartButton from "../components/AddToCartButton";
import WishlistButton from "../components/WishlistButton";
import ProductReviews from "../components/ProductReviews";

// Mock product data - in a real app, this would come from an API
const mockProducts = [
  {
    id: "1",
    name: "Beaded Necklace",
    price: 45.99,
    description:
      "This handcrafted beaded necklace features traditional Navajo patterns and colors. Each bead is carefully selected and placed to create a stunning piece that honors ancestral techniques while offering a contemporary aesthetic. The necklace measures 18 inches in length and includes a secure clasp.",
    images: [
      "/products/necklace.jpg",
      "/products/necklace-2.jpg",
      "/products/necklace-3.jpg",
    ],
    artist: {
      id: "a1",
      name: "Maya Johnson",
      tribe: "Navajo",
      image: "/artists/artist1.jpg",
    },
    category: "jewelry",
    materials: ["Glass beads", "Sterling silver clasp", "Waxed thread"],
    dimensions: "18 inches (length)",
    weight: "45 grams",
    inStock: true,
    rating: 4.8,
    reviewCount: 24,
  },
  // More products would be here
];

export default function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  // In a real app, this would fetch the product from an API
  const product =
    mockProducts.find((p) => p.id === params.id) || mockProducts[0];

  return (
    <main className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/products"
            className="flex items-center text-stone-600 hover:text-terracotta-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to products
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-stone-100">
              <Image
                src={product.images[0] || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              {product.images.slice(1).map((image, index) => (
                <div
                  key={index}
                  className="relative aspect-square bg-stone-100"
                >
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`${product.name} view ${index + 2}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-3xl font-light text-stone-900 mb-2">
              {product.name}
            </h1>

            <Link
              href={`/artists/${product.artist.id}`}
              className="inline-block mb-4"
            >
              <div className="flex items-center">
                <div className="relative w-8 h-8 rounded-full overflow-hidden mr-2">
                  <Image
                    src={product.artist.image || "/placeholder.svg"}
                    alt={product.artist.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="text-stone-600">
                  By{" "}
                  <span className="text-terracotta-600 hover:text-terracotta-700">
                    {product.artist.name}
                  </span>
                </span>
              </div>
            </Link>

            <div className="flex items-center mb-4">
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating)
                        ? "text-yellow-400"
                        : "text-stone-300"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="ml-2 text-sm text-stone-600">
                  {product.rating} ({product.reviewCount} reviews)
                </span>
              </div>
            </div>

            <div className="text-2xl font-medium text-stone-900 mb-6">
              ${product.price.toFixed(2)}
            </div>

            <div className="mb-6">
              <p className="text-stone-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="mb-6 space-y-4">
              <div>
                <h3 className="text-sm font-medium text-stone-900 mb-1">
                  Materials
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.materials.map((material, index) => (
                    <span
                      key={index}
                      className="text-sm text-stone-600 bg-stone-100 px-3 py-1"
                    >
                      {material}
                    </span>
                  ))}
                </div>
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
                  {product.inStock ? "In stock" : "Out of stock"}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <AddToCartButton
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
