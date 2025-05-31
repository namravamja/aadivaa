import Image from "next/image";
import Link from "next/link";

// Mock artists data - in a real app, this would come from an API
const artists = [
  {
    id: "1",
    name: "Maya Johnson",
    tribe: "Navajo",
    craft: "Jewelry & Beadwork",
    image: "/Profile.jpg",
    bio: "Maya Johnson is a third-generation Navajo jewelry maker specializing in traditional beadwork and silver techniques passed down through her family. Her pieces blend ancestral patterns with contemporary designs.",
    featured: true,
  },
  {
    id: "2",
    name: "Tomas Rivera",
    tribe: "Hopi",
    craft: "Textiles & Weaving",
    image: "/Profile.jpg",
    bio: "Tomas Rivera learned the art of weaving from his grandfather at the age of seven. His textiles feature traditional Hopi symbols and tell stories of his community's history and spiritual beliefs.",
    featured: true,
  },
  {
    id: "3",
    name: "Leila White",
    tribe: "Cherokee",
    craft: "Pottery & Ceramics",
    image: "/Profile.jpg",
    bio: "Leila White creates hand-coiled pottery using traditional Cherokee techniques. Her work is known for its distinctive stamped patterns and earth-tone glazes derived from natural materials.",
    featured: true,
  },
  {
    id: "4",
    name: "Daniel Black",
    tribe: "Apache",
    craft: "Leather Work",
    image: "/Profile.jpg",
    bio: "Daniel Black specializes in hand-tooled leather goods that combine Apache symbolism with practical, everyday items. Each piece is carefully crafted using techniques passed down through generations.",
    featured: false,
  },
  {
    id: "5",
    name: "Sarah Blue",
    tribe: "Navajo",
    craft: "Silversmithing",
    image: "/Profile.jpg",
    bio: "Sarah Blue is renowned for her intricate silver jewelry that incorporates traditional Navajo designs with contemporary aesthetics. Her work often features turquoise sourced from her family's land.",
    featured: false,
  },
  {
    id: "6",
    name: "Robert White",
    tribe: "Hopi",
    craft: "Basket Weaving",
    image: "/Profile.jpg",
    bio: "Robert White creates baskets using traditional Hopi techniques and materials. His work is characterized by tight weaving and geometric patterns that tell stories of Hopi culture and history.",
    featured: false,
  },
  {
    id: "7",
    name: "Maria Garcia",
    tribe: "Zuni",
    craft: "Pottery",
    image: "/Profile.jpg",
    bio: "Maria Garcia is a master potter who creates delicate, thin-walled vessels adorned with traditional Zuni symbols. Her work is collected by museums and private collectors worldwide.",
    featured: false,
  },
  {
    id: "8",
    name: "John Eagle",
    tribe: "Cherokee",
    craft: "Wood Carving",
    image: "/Profile.jpg",
    bio: "John Eagle carves intricate wooden sculptures and functional items that reflect Cherokee traditions and stories. He works primarily with locally sourced hardwoods from his tribal lands.",
    featured: false,
  },
];

export default function ArtistsPage() {
  // Separate featured artists
  const featuredArtists = artists.filter((artist) => artist.featured);
  const regularArtists = artists.filter((artist) => !artist.featured);

  return (
    <main className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-light text-stone-900 mb-4">
            Our Artists
          </h1>
          <p className="text-stone-600">
            Meet the talented artisans behind our products. Each artist brings
            generations of cultural knowledge and craftsmanship to their work,
            preserving traditions while creating contemporary pieces.
          </p>
        </div>

        {/* Featured Artists */}
        <section className="mb-16">
          <h2 className="text-2xl font-light text-stone-900 mb-8 text-center">
            Featured Artists
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredArtists.map((artist) => (
              <Link
                key={artist.id}
                href={`/Artists/ArtistDetailPage`}
                className="group"
              >
                <div className="bg-white border border-stone-200 overflow-hidden transition-all duration-300 group-hover:shadow-md">
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={artist.image || "/placeholder.svg"}
                      alt={artist.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-medium text-xl text-stone-900 mb-1 group-hover:text-terracotta-600 transition-colors">
                      {artist.name}
                    </h3>
                    <p className="text-stone-500 mb-3">
                      {artist.tribe} • {artist.craft}
                    </p>
                    <p className="text-stone-600 line-clamp-3">{artist.bio}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* All Artists */}
        <section>
          <h2 className="text-2xl font-light text-stone-900 mb-8 text-center">
            All Artists
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {regularArtists.map((artist) => (
              <Link
                key={artist.id}
                href={`/artists/${artist.id}`}
                className="group"
              >
                <div className="bg-white border border-stone-200 overflow-hidden transition-all duration-300 group-hover:shadow-md">
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={artist.image || "/placeholder.svg"}
                      alt={artist.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-stone-900 mb-1 group-hover:text-terracotta-600 transition-colors">
                      {artist.name}
                    </h3>
                    <p className="text-stone-500 text-sm">
                      {artist.tribe} • {artist.craft}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
