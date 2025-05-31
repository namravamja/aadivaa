import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

// Mock artists data - in a real app, this would come from an API
const artists = [
  {
    id: "1",
    name: "Maya Johnson",
    tribe: "Navajo",
    craft: "Jewelry & Beadwork",
    image: "/Profile.jpg",
    coverImage: "/Profile.jpg",
    bio: "Maya Johnson is a third-generation Navajo jewelry maker specializing in traditional beadwork and silver techniques passed down through her family. Her pieces blend ancestral patterns with contemporary designs.",
    story:
      "Born and raised on the Navajo reservation in Arizona, Maya learned the art of beadwork from her grandmother at the age of six. She spent countless hours watching her grandmother's hands move deftly, creating intricate patterns that told stories of their people's history and spiritual beliefs.\n\nAfter studying fine arts at the Institute of American Indian Arts in Santa Fe, Maya returned to her community to preserve and evolve the traditional craft techniques. She sources her materials ethically, using natural stones and metals whenever possible.\n\n\"Each piece I create carries the energy of my ancestors,\" Maya explains. \"When someone wears my jewelry, they're not just wearing an accessory – they're carrying a piece of Navajo history and culture.\"",
    location: "Window Rock, Arizona",
    awards: [
      "Native American Arts Foundation Award, 2019",
      "Southwest Heritage Craftsmanship Award, 2021",
    ],
    featured: true,
    products: [
      {
        id: "1",
        name: "Beaded Necklace",
        price: 45.99,
        image: "/Profile.jpg",
      },
      {
        id: "5",
        name: "Turquoise Bracelet",
        price: 120.0,
        image: "/Profile.jpg",
      },
      {
        id: "9",
        name: "Beaded Earrings",
        price: 30.0,
        image: "/Profile.jpg",
      },
    ],
  },
  // More artists would be here
];

// Mock reviews data
const reviews = [
  {
    id: "ar1",
    artistId: "1",
    userName: "Emily R.",
    userImage: "/users/user4.jpg",
    rating: 5,
    text: "I purchased Maya's beaded necklace and it's absolutely stunning. The craftsmanship is exceptional and I love knowing the cultural significance behind the design.",
    date: "2023-05-12",
  },
  {
    id: "ar2",
    artistId: "1",
    userName: "James T.",
    userImage: "/users/user5.jpg",
    rating: 5,
    text: "Maya's work is truly special. The bracelet I bought has become my most treasured piece of jewelry. The attention to detail is remarkable.",
    date: "2023-04-03",
  },
];

export default function ArtistDetailPage({
  params,
}: {
  params: { id: string };
}) {
  // In a real app, this would fetch the artist from an API
  const artist = artists.find((a) => a.id === params.id) || artists[0];

  // Filter reviews for this artist
  const artistReviews = reviews.filter(
    (review) => review.artistId === artist.id
  );

  return (
    <main className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/artists"
            className="flex items-center text-stone-600 hover:text-terracotta-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to artists
          </Link>
        </div>

        {/* Artist Header */}
        <div className="relative mb-12">
          <div className="relative h-64 sm:h-80 md:h-96 w-full mb-8 bg-stone-200">
            <Image
              src={artist.coverImage || "/placeholder.svg"}
              alt={`${artist.name}'s workshop`}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            <div className="relative w-32 h-32 md:w-48 md:h-48 border-4 border-white bg-white shadow-md -mt-16 md:-mt-24 mx-auto md:mx-0">
              <Image
                src={artist.image || "/placeholder.svg"}
                alt={artist.name}
                fill
                className="object-cover"
                priority
              />
            </div>

            <div className="text-center md:text-left md:flex-1">
              <h1 className="text-3xl font-light text-stone-900 mb-2">
                {artist.name}
              </h1>
              <p className="text-stone-600 mb-4">
                {artist.tribe} • {artist.craft}
              </p>
              <p className="text-stone-500">
                <span className="inline-flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {artist.location}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Artist Story */}
        <section className="mb-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-light text-stone-900 mb-6">
              Artist Story
            </h2>
            <div className="prose prose-stone max-w-none">
              {artist.story.split("\n\n").map((paragraph, index) => (
                <p key={index} className="mb-4 text-stone-600 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>

            {artist.awards && artist.awards.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-light text-stone-900 mb-4">
                  Awards & Recognition
                </h3>
                <ul className="list-disc list-inside text-stone-600 space-y-2">
                  {artist.awards.map((award, index) => (
                    <li key={index}>{award}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>

        {/* Artist Products */}
        <section className="mb-16">
          <h2 className="text-2xl font-light text-stone-900 mb-6 text-center">
            Products by {artist.name}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {artist.products.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="group"
              >
                <div className="relative aspect-square mb-4 bg-stone-100 overflow-hidden">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div>
                  <h3 className="font-medium text-stone-900 mb-1 group-hover:text-terracotta-600 transition-colors">
                    {product.name}
                  </h3>
                  <span className="text-stone-900">
                    ${product.price.toFixed(2)}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              href={`/products?artist=${artist.id}`}
              className="inline-block px-6 py-3 border border-stone-900 text-stone-900 font-medium hover:bg-stone-50 transition-colors"
            >
              View All Products by {artist.name}
            </Link>
          </div>
        </section>

        {/* Artist Reviews */}
        <section>
          <h2 className="text-2xl font-light text-stone-900 mb-6 text-center">
            Customer Reviews
          </h2>

          {artistReviews.length === 0 ? (
            <p className="text-center text-stone-600">
              No reviews yet for this artist.
            </p>
          ) : (
            <div className="max-w-3xl mx-auto space-y-8">
              {artistReviews.map((review) => (
                <div key={review.id} className="border-b border-stone-200 pb-8">
                  <div className="flex items-center mb-4">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3">
                      <Image
                        src={review.userImage || "/placeholder.svg"}
                        alt={review.userName}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-medium text-stone-900">
                        {review.userName}
                      </div>
                      <div className="text-sm text-stone-500">
                        {new Date(review.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating
                            ? "text-yellow-400"
                            : "text-stone-300"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>

                  <p className="text-stone-600">{review.text}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
