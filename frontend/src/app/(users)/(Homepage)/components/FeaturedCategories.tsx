import Link from "next/link";
import Image from "next/image";

const categories = [
  {
    id: "jewelry",
    name: "Jewelry",
    image: "/Profile.jpg",
  },
  {
    id: "textiles",
    name: "Textiles",
    image: "/Profile.jpg",
  },
  {
    id: "decor",
    name: "Decor",
    image: "/Profile.jpg",
  },
  {
    id: "accessories",
    name: "Accessories",
    image: "/Profile.jpg",
  },
];

export default function FeaturedCategories() {
  return (
    <section className="py-16 sm:py-20 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl font-light text-stone-900 mb-10 sm:mb-16 text-center">
          Categories
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${category.id}`}
              className="group"
            >
              <div className="relative overflow-hidden aspect-[3/4]">
                <Image
                  src={category.image || "/placeholder.svg"}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-light text-white">
                    {category.name}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
