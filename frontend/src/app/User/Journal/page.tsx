import Image from "next/image";
import Link from "next/link";
import { Calendar, User, ArrowRight } from "lucide-react";

// Mock articles data - in a real app, this would come from an API
const featuredArticle = {
  id: "1",
  title: "The Revival of Traditional Navajo Weaving Techniques",
  excerpt:
    "Discover how a new generation of Navajo artisans is preserving and revitalizing ancient weaving traditions while bringing contemporary designs to a global audience.",
  image: "/journal/featured-article.jpg",
  category: "Craft Traditions",
  author: "Elena Martinez",
  date: "2023-05-15",
  readTime: "8 min read",
};

const articles = [
  {
    id: "2",
    title: "Sustainable Materials in Indigenous Crafts",
    excerpt:
      "How tribal artisans are leading the way in sustainable material sourcing and eco-friendly production methods.",
    image: "/journal/article2.jpg",
    category: "Sustainability",
    author: "Michael Thompson",
    date: "2023-04-22",
    readTime: "6 min read",
  },
  {
    id: "3",
    title: "The Symbolism Behind Zuni Pottery Patterns",
    excerpt:
      "Exploring the rich cultural meanings and stories embedded in traditional Zuni pottery designs.",
    image: "/journal/article3.jpg",
    category: "Cultural Heritage",
    author: "Sarah Johnson",
    date: "2023-04-10",
    readTime: "5 min read",
  },
  {
    id: "4",
    title: "From Reservation to Runway: Indigenous Fashion",
    excerpt:
      "How tribal textile traditions are influencing contemporary fashion and gaining recognition in the global design community.",
    image: "/journal/article4.jpg",
    category: "Fashion",
    author: "David Wilson",
    date: "2023-03-28",
    readTime: "7 min read",
  },
  {
    id: "5",
    title: "Preserving Craft Techniques Through Digital Documentation",
    excerpt:
      "How technology is helping to document and preserve endangered craft techniques for future generations.",
    image: "/journal/article5.jpg",
    category: "Technology",
    author: "Lisa Chen",
    date: "2023-03-15",
    readTime: "4 min read",
  },
  {
    id: "6",
    title: "The Economic Impact of Fair Trade Crafts",
    excerpt:
      "Examining how fair trade practices are transforming economies in indigenous communities.",
    image: "/journal/article6.jpg",
    category: "Fair Trade",
    author: "Robert Taylor",
    date: "2023-02-28",
    readTime: "6 min read",
  },
];

export default function JournalPage() {
  return (
    <main className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-light text-stone-900 mb-4">
            Journal
          </h1>
          <p className="text-stone-600">
            Explore stories about indigenous craft traditions, artisan profiles,
            and the cultural significance behind the products we offer.
          </p>
        </div>

        {/* Featured Article */}
        <section className="mb-16">
          <Link href={`/journal/${featuredArticle.id}`} className="group">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image
                  src={featuredArticle.image || "/placeholder.svg"}
                  alt={featuredArticle.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                />
              </div>
              <div>
                <div className="mb-4">
                  <span className="inline-block bg-terracotta-100 text-terracotta-600 px-3 py-1 text-sm font-medium">
                    {featuredArticle.category}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-light text-stone-900 mb-4 group-hover:text-terracotta-600 transition-colors">
                  {featuredArticle.title}
                </h2>
                <p className="text-stone-600 mb-6">{featuredArticle.excerpt}</p>
                <div className="flex items-center text-sm text-stone-500">
                  <div className="flex items-center mr-4">
                    <User className="w-4 h-4 mr-1" />
                    {featuredArticle.author}
                  </div>
                  <div className="flex items-center mr-4">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(featuredArticle.date).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </div>
                  <div>{featuredArticle.readTime}</div>
                </div>
              </div>
            </div>
          </Link>
        </section>

        {/* Article Grid */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <Link
                key={article.id}
                href={`/journal/${article.id}`}
                className="group"
              >
                <div className="border border-stone-200 overflow-hidden transition-all duration-300 group-hover:shadow-md h-full flex flex-col">
                  <div className="relative aspect-[3/2] w-full overflow-hidden">
                    <Image
                      src={article.image || "/placeholder.svg"}
                      alt={article.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="mb-3">
                      <span className="inline-block bg-stone-100 text-stone-600 px-2 py-1 text-xs font-medium">
                        {article.category}
                      </span>
                    </div>
                    <h3 className="font-medium text-xl text-stone-900 mb-3 group-hover:text-terracotta-600 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-stone-600 mb-4 flex-1">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center text-sm text-stone-500 mt-auto">
                      <div className="flex items-center mr-4">
                        <User className="w-4 h-4 mr-1" />
                        {article.author}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(article.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Load More Button */}
          <div className="text-center mt-12">
            <button className="inline-flex items-center px-6 py-3 border border-stone-900 text-stone-900 font-medium hover:bg-stone-50 transition-colors">
              Load More Articles <ArrowRight className="ml-2 w-4 h-4" />
            </button>
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="mt-20 bg-stone-50 p-8 sm:p-12">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-light text-stone-900 mb-4">
              Subscribe to Our Newsletter
            </h2>
            <p className="text-stone-600 mb-6">
              Stay updated with the latest articles, artisan stories, and
              product releases.
            </p>
            <form className="flex flex-col sm:flex-row max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="px-4 py-3 flex-grow border border-stone-300 focus:outline-none focus:border-terracotta-500 sm:rounded-r-none"
                required
              />
              <button
                type="submit"
                className="mt-2 sm:mt-0 px-6 py-3 bg-terracotta-600 text-white font-medium hover:bg-terracotta-700 transition-colors sm:rounded-l-none"
              >
                Subscribe
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
