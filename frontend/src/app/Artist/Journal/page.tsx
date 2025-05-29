"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Calendar,
  User,
  FileText,
} from "lucide-react";

// Mock articles data
const mockArticles = [
  {
    id: "1",
    title: "The Revival of Traditional Navajo Weaving Techniques",
    excerpt:
      "Discover how a new generation of Navajo artisans is preserving and revitalizing ancient weaving traditions while bringing contemporary designs to a global audience.",
    content: "Full article content would be here...",
    image: "/journal/featured-article.jpg",
    category: "Craft Traditions",
    status: "published",
    author: "Maya Johnson",
    publishDate: "2023-05-15",
    readTime: "8 min read",
    views: 1250,
    featured: true,
  },
  {
    id: "2",
    title: "Sustainable Materials in Indigenous Crafts",
    excerpt:
      "How tribal artisans are leading the way in sustainable material sourcing and eco-friendly production methods.",
    content: "Full article content would be here...",
    image: "/journal/article2.jpg",
    category: "Sustainability",
    status: "published",
    author: "Maya Johnson",
    publishDate: "2023-04-22",
    readTime: "6 min read",
    views: 890,
    featured: false,
  },
  {
    id: "3",
    title: "The Symbolism Behind Zuni Pottery Patterns",
    excerpt:
      "Exploring the rich cultural meanings and stories embedded in traditional Zuni pottery designs.",
    content: "Full article content would be here...",
    image: "/journal/article3.jpg",
    category: "Cultural Heritage",
    status: "draft",
    author: "Maya Johnson",
    publishDate: "2023-04-10",
    readTime: "5 min read",
    views: 0,
    featured: false,
  },
];

export default function ArtistJournal() {
  const [articles, setArticles] = useState(mockArticles);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");

  // Filter articles
  const filteredArticles = articles.filter((article) => {
    const matchesStatus =
      filterStatus === "all" || article.status === filterStatus;
    const matchesCategory =
      filterCategory === "all" || article.category === filterCategory;
    return matchesStatus && matchesCategory;
  });

  const handleDeleteArticle = (articleId: string) => {
    if (confirm("Are you sure you want to delete this article?")) {
      setArticles(articles.filter((article) => article.id !== articleId));
    }
  };

  const handleToggleFeatured = (articleId: string) => {
    setArticles(
      articles.map((article) =>
        article.id === articleId
          ? { ...article, featured: !article.featured }
          : article
      )
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      case "archived":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const categories = [
    "all",
    "Craft Traditions",
    "Sustainability",
    "Cultural Heritage",
    "Artist Stories",
    "Techniques",
  ];
  const statuses = ["all", "published", "draft", "archived"];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-light text-stone-900 mb-2">Journal</h1>
          <p className="text-stone-600">
            Share your stories and cultural heritage
          </p>
        </div>
        <Link
          href="/Artist/journal/new"
          className="mt-4 sm:mt-0 bg-terracotta-600 text-white px-4 py-2 hover:bg-terracotta-700 transition-colors flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Write Article
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white border border-stone-200 p-6 shadow-sm">
          <div className="flex items-center">
            <FileText className="w-8 h-8 text-terracotta-600 mr-3" />
            <div>
              <div className="text-2xl font-semibold text-stone-900">
                {articles.length}
              </div>
              <div className="text-stone-500 text-sm">Total Articles</div>
            </div>
          </div>
        </div>
        <div className="bg-white border border-stone-200 p-6 shadow-sm">
          <div className="flex items-center">
            <Eye className="w-8 h-8 text-sage-600 mr-3" />
            <div>
              <div className="text-2xl font-semibold text-stone-900">
                {articles.reduce((acc, article) => acc + article.views, 0)}
              </div>
              <div className="text-stone-500 text-sm">Total Views</div>
            </div>
          </div>
        </div>
        <div className="bg-white border border-stone-200 p-6 shadow-sm">
          <div className="flex items-center">
            <Calendar className="w-8 h-8 text-clay-600 mr-3" />
            <div>
              <div className="text-2xl font-semibold text-stone-900">
                {articles.filter((a) => a.status === "published").length}
              </div>
              <div className="text-stone-500 text-sm">Published</div>
            </div>
          </div>
        </div>
        <div className="bg-white border border-stone-200 p-6 shadow-sm">
          <div className="flex items-center">
            <Edit className="w-8 h-8 text-terracotta-600 mr-3" />
            <div>
              <div className="text-2xl font-semibold text-stone-900">
                {articles.filter((a) => a.status === "draft").length}
              </div>
              <div className="text-stone-500 text-sm">Drafts</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-stone-200 p-6 mb-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 focus:border-terracotta-500 focus:outline-none"
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status === "all"
                    ? "All Statuses"
                    : status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Category
            </label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 focus:border-terracotta-500 focus:outline-none"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === "all" ? "All Categories" : category}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <div className="text-stone-600">
              {filteredArticles.length} articles
            </div>
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="space-y-6">
        {filteredArticles.map((article) => (
          <div
            key={article.id}
            className="bg-white border border-stone-200 shadow-sm overflow-hidden"
          >
            <div className="p-6">
              <div className="flex flex-col lg:flex-row">
                <div className="relative w-full lg:w-48 h-32 lg:h-32 mr-0 lg:mr-6 mb-4 lg:mb-0 flex-shrink-0">
                  <Image
                    src={article.image || "/placeholder.svg"}
                    alt={article.title}
                    fill
                    className="object-cover rounded"
                  />
                  {article.featured && (
                    <div className="absolute top-2 left-2 bg-terracotta-600 text-white text-xs px-2 py-1 rounded">
                      Featured
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2">
                    <div className="flex items-center space-x-2 mb-2 sm:mb-0">
                      <span className="text-xs bg-stone-100 text-stone-600 px-2 py-1 rounded">
                        {article.category}
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded ${getStatusColor(
                          article.status
                        )}`}
                      >
                        {article.status}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleToggleFeatured(article.id)}
                        className={`text-xs px-2 py-1 rounded border ${
                          article.featured
                            ? "bg-terracotta-100 text-terracotta-600 border-terracotta-300"
                            : "bg-white text-stone-600 border-stone-300"
                        }`}
                      >
                        {article.featured ? "Featured" : "Feature"}
                      </button>
                      <Link
                        href={`/journal/${article.id}`}
                        className="text-stone-400 hover:text-stone-600"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/Artist/journal/${article.id}/edit`}
                        className="text-stone-400 hover:text-terracotta-600"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDeleteArticle(article.id)}
                        className="text-stone-400 hover:text-red-600"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-xl font-medium text-stone-900 mb-2 hover:text-terracotta-600">
                    <Link href={`/Artist/journal/${article.id}/edit`}>
                      {article.title}
                    </Link>
                  </h3>

                  <p className="text-stone-600 mb-4 line-clamp-2">
                    {article.excerpt}
                  </p>

                  <div className="flex items-center justify-between text-sm text-stone-500">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        {article.author}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(article.publishDate).toLocaleDateString()}
                      </div>
                      <div>{article.readTime}</div>
                    </div>
                    <div className="flex items-center">
                      <Eye className="w-4 h-4 mr-1" />
                      {article.views} views
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredArticles.length === 0 && (
        <div className="text-center py-12">
          <div className="text-stone-400 mb-4">
            <FileText className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-stone-900 mb-2">
            No articles found
          </h3>
          <p className="text-stone-600 mb-4">
            Try adjusting your filter criteria or create your first article
          </p>
          <Link
            href="/Artist/journal/new"
            className="inline-flex items-center px-4 py-2 bg-terracotta-600 text-white hover:bg-terracotta-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Write Your First Article
          </Link>
        </div>
      )}
    </div>
  );
}
