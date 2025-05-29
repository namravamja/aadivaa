import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

// Mock data - in a real app, this would come from RTK Query
const artists = [
  {
    id: "1",
    name: "Maya Johnson",
    tribe: "Navajo",
    craft: "Jewelry & Beadwork",
    image: "/artists/artist1.jpg",
  },
  {
    id: "2",
    name: "Tomas Rivera",
    tribe: "Hopi",
    craft: "Textiles & Weaving",
    image: "/artists/artist2.jpg",
  },
  {
    id: "3",
    name: "Leila White",
    tribe: "Cherokee",
    craft: "Pottery & Ceramics",
    image: "/artists/artist3.jpg",
  },
];

export default function ArtistSpotlight() {
  return (
    <section className="py-16 sm:py-20 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-light text-stone-900 mb-4 sm:mb-0">
            Featured Artists
          </h2>
          <Link
            href="/artists"
            className="flex items-center text-stone-900 hover:text-terracotta-600 transition-colors"
          >
            View all <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          {artists.map((artist) => (
            <Link
              key={artist.id}
              href={`/artist/${artist.id}`}
              className="group"
            >
              <div className="relative aspect-square overflow-hidden mb-4 sm:mb-6">
                <Image
                  src={artist.image || "/placeholder.svg"}
                  alt={artist.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <h3 className="font-medium text-lg sm:text-xl text-stone-900 mb-1">
                {artist.name}
              </h3>
              <p className="text-stone-500">
                {artist.tribe} • {artist.craft}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
