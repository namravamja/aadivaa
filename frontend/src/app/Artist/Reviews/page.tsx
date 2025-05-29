"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, MessageSquare, ThumbsUp, Eye, Trash2 } from "lucide-react";

// Mock reviews data
const mockReviews = [
  {
    id: "1",
    productId: "1",
    productName: "Beaded Necklace",
    productImage: "/products/necklace.jpg",
    customerName: "Sarah Johnson",
    customerEmail: "sarah@example.com",
    rating: 5,
    title: "Beautiful craftsmanship",
    comment:
      "The necklace is even more beautiful in person. The attention to detail is remarkable, and the colors are vibrant. It's become my favorite piece of jewelry.",
    date: "2023-05-15",
    status: "published",
    helpful: 12,
    verified: true,
  },
  {
    id: "2",
    productId: "2",
    productName: "Ceramic Vase",
    productImage: "/products/vase.jpg",
    customerName: "Michael Chen",
    customerEmail: "michael@example.com",
    rating: 4,
    title: "Great quality, shipping took a while",
    comment:
      "The vase is well-made and exactly as pictured. The only reason I'm giving 4 stars instead of 5 is that shipping took longer than expected. Otherwise, very satisfied with my purchase.",
    date: "2023-05-12",
    status: "published",
    helpful: 8,
    verified: true,
  },
  {
    id: "3",
    productId: "1",
    productName: "Beaded Necklace",
    productImage: "/products/necklace.jpg",
    customerName: "Emma Wilson",
    customerEmail: "emma@example.com",
    rating: 5,
    title: "Perfect gift",
    comment:
      "I purchased this as a gift for my mother, and she absolutely loves it. The craftsmanship is exceptional, and knowing it supports tribal artisans makes it even more special.",
    date: "2023-05-10",
    status: "pending",
    helpful: 5,
    verified: true,
  },
  {
    id: "4",
    productId: "3",
    productName: "Woven Basket",
    productImage: "/products/basket.jpg",
    customerName: "David Brown",
    customerEmail: "david@example.com",
    rating: 2,
    title: "Not as expected",
    comment:
      "The basket arrived damaged and the quality doesn't match the price. Very disappointed with this purchase.",
    date: "2023-05-08",
    status: "flagged",
    helpful: 2,
    verified: false,
  },
];

export default function ArtistReviews() {
  const [reviews, setReviews] = useState(mockReviews);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterRating, setFilterRating] = useState("all");

  // Filter reviews
  const filteredReviews = reviews.filter((review) => {
    const matchesStatus =
      filterStatus === "all" || review.status === filterStatus;
    const matchesRating =
      filterRating === "all" || review.rating.toString() === filterRating;
    return matchesStatus && matchesRating;
  });

  const handleStatusChange = (reviewId: string, newStatus: string) => {
    setReviews(
      reviews.map((review) =>
        review.id === reviewId ? { ...review, status: newStatus } : review
      )
    );
  };

  const handleDeleteReview = (reviewId: string) => {
    if (confirm("Are you sure you want to delete this review?")) {
      setReviews(reviews.filter((review) => review.id !== reviewId));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "flagged":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "text-yellow-400 fill-current" : "text-stone-300"
        }`}
      />
    ));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-light text-stone-900 mb-2">Reviews</h1>
        <p className="text-stone-600">Manage customer reviews and feedback</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white border border-stone-200 p-6 shadow-sm">
          <div className="flex items-center">
            <MessageSquare className="w-8 h-8 text-terracotta-600 mr-3" />
            <div>
              <div className="text-2xl font-semibold text-stone-900">
                {reviews.length}
              </div>
              <div className="text-stone-500 text-sm">Total Reviews</div>
            </div>
          </div>
        </div>
        <div className="bg-white border border-stone-200 p-6 shadow-sm">
          <div className="flex items-center">
            <Star className="w-8 h-8 text-yellow-500 mr-3" />
            <div>
              <div className="text-2xl font-semibold text-stone-900">
                {(
                  reviews.reduce((acc, review) => acc + review.rating, 0) /
                  reviews.length
                ).toFixed(1)}
              </div>
              <div className="text-stone-500 text-sm">Average Rating</div>
            </div>
          </div>
        </div>
        <div className="bg-white border border-stone-200 p-6 shadow-sm">
          <div className="flex items-center">
            <Eye className="w-8 h-8 text-sage-600 mr-3" />
            <div>
              <div className="text-2xl font-semibold text-stone-900">
                {reviews.filter((r) => r.status === "published").length}
              </div>
              <div className="text-stone-500 text-sm">Published</div>
            </div>
          </div>
        </div>
        <div className="bg-white border border-stone-200 p-6 shadow-sm">
          <div className="flex items-center">
            <ThumbsUp className="w-8 h-8 text-clay-600 mr-3" />
            <div>
              <div className="text-2xl font-semibold text-stone-900">
                {reviews.filter((r) => r.status === "pending").length}
              </div>
              <div className="text-stone-500 text-sm">Pending</div>
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
              <option value="all">All Statuses</option>
              <option value="published">Published</option>
              <option value="pending">Pending</option>
              <option value="flagged">Flagged</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Rating
            </label>
            <select
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 focus:border-terracotta-500 focus:outline-none"
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {filteredReviews.map((review) => (
          <div
            key={review.id}
            className="bg-white border border-stone-200 p-6 shadow-sm"
          >
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4">
              <div className="flex items-start mb-4 lg:mb-0">
                <div className="relative w-16 h-16 mr-4 flex-shrink-0">
                  <Image
                    src={review.productImage || "/placeholder.svg"}
                    alt={review.productName}
                    fill
                    className="object-cover rounded"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-stone-900 mb-1">
                    {review.productName}
                  </h3>
                  <div className="flex items-center mb-2">
                    <div className="flex mr-2">
                      {renderStars(review.rating)}
                    </div>
                    <span className="text-sm text-stone-600">
                      ({review.rating}/5)
                    </span>
                  </div>
                  <div className="text-sm text-stone-500">
                    By {review.customerName} •{" "}
                    {new Date(review.date).toLocaleDateString()}
                    {review.verified && (
                      <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        Verified Purchase
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span
                  className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                    review.status
                  )}`}
                >
                  {review.status}
                </span>
                <select
                  value={review.status}
                  onChange={(e) =>
                    handleStatusChange(review.id, e.target.value)
                  }
                  className="text-xs border border-stone-300 px-2 py-1 rounded"
                >
                  <option value="pending">Pending</option>
                  <option value="published">Published</option>
                  <option value="flagged">Flagged</option>
                </select>
                <button
                  onClick={() => handleDeleteReview(review.id)}
                  className="text-stone-400 hover:text-red-600"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="font-medium text-stone-900 mb-2">
                {review.title}
              </h4>
              <p className="text-stone-600 leading-relaxed">{review.comment}</p>
            </div>

            <div className="flex items-center justify-between text-sm text-stone-500">
              <div className="flex items-center">
                <ThumbsUp className="w-4 h-4 mr-1" />
                {review.helpful} people found this helpful
              </div>
              <div>{review.customerEmail}</div>
            </div>
          </div>
        ))}
      </div>

      {filteredReviews.length === 0 && (
        <div className="text-center py-12">
          <div className="text-stone-400 mb-4">
            <MessageSquare className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-stone-900 mb-2">
            No reviews found
          </h3>
          <p className="text-stone-600">Try adjusting your filter criteria</p>
        </div>
      )}
    </div>
  );
}
