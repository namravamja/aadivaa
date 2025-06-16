"use client";

import { useState } from "react";
import Image from "next/image";
import ReviewForm from "./ReviewForm";

// Mock reviews data - in a real app, this would come from an API
const mockReviews = [
  {
    id: "r1",
    productId: "1",
    userId: "u1",
    userName: "Sarah M.",
    userImage: "/users/user1.jpg",
    rating: 5,
    title: "Beautiful craftsmanship",
    text: "The necklace is even more beautiful in person. The attention to detail is remarkable, and the colors are vibrant. It's become my favorite piece of jewelry.",
    date: "2023-04-15",
    verified: true,
  },
  {
    id: "r2",
    productId: "1",
    userId: "u2",
    userName: "Michael T.",
    userImage: "/users/user2.jpg",
    rating: 4,
    title: "Great quality, shipping took a while",
    text: "The necklace is well-made and exactly as pictured. The only reason I'm giving 4 stars instead of 5 is that shipping took longer than expected. Otherwise, very satisfied with my purchase.",
    date: "2023-03-22",
    verified: true,
  },
  {
    id: "r3",
    productId: "1",
    userId: "u3",
    userName: "Jessica L.",
    userImage: "/users/user3.jpg",
    rating: 5,
    title: "A meaningful gift",
    text: "I purchased this as a gift for my mother, and she absolutely loves it. The craftsmanship is exceptional, and knowing it supports tribal artisans makes it even more special.",
    date: "2023-02-10",
    verified: true,
  },
];

type ProductReviewsProps = {
  productId: string;
};

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const [reviews, setReviews] = useState(mockReviews);
  const [showReviewForm, setShowReviewForm] = useState(false);

  // Filter reviews for this product
  const productReviews = reviews.filter(
    (review) => review.productId === productId
  );

  // Calculate average rating
  const averageRating =
    productReviews.length > 0
      ? productReviews.reduce((acc, review) => acc + review.rating, 0) /
        productReviews.length
      : 0;

  const handleAddReview = (newReview: any) => {
    setReviews([
      ...reviews,
      { ...newReview, id: `r${reviews.length + 1}`, productId },
    ]);
    setShowReviewForm(false);
  };

  return (
    <div>
      <h2 className="text-2xl font-light text-stone-900 mb-6">
        Customer Reviews
      </h2>

      <div className="mb-8">
        <div className="flex items-center mb-4">
          <div className="flex items-center mr-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg
                key={i}
                className={`w-5 h-5 ${
                  i < Math.floor(averageRating)
                    ? "text-yellow-400"
                    : "text-stone-300"
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="ml-2 text-lg font-medium text-stone-900">
              {averageRating.toFixed(1)}
            </span>
          </div>
          <span className="text-stone-600">
            Based on {productReviews.length} reviews
          </span>
        </div>

        <button
          onClick={() => setShowReviewForm(!showReviewForm)}
          className="bg-terracotta-600 text-white px-6 py-2 font-medium hover:bg-terracotta-700 transition-colors"
        >
          Write a Review
        </button>
      </div>

      {showReviewForm && (
        <div className="mb-8 p-6 border border-stone-200 bg-stone-50">
          <ReviewForm
            onSubmit={handleAddReview}
            onCancel={() => setShowReviewForm(false)}
          />
        </div>
      )}

      <div className="space-y-8">
        {productReviews.length === 0 ? (
          <p className="text-stone-600">
            No reviews yet. Be the first to review this product!
          </p>
        ) : (
          productReviews.map((review) => (
            <div key={review.id} className="border-b border-stone-200 pb-8">
              <div className="flex items-center mb-4">
                <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3">
                  <Image
                    src={review.userImage || "/Profile.jpg"}
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
                {review.verified && (
                  <div className="ml-auto text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    Verified Purchase
                  </div>
                )}
              </div>

              <div className="flex items-center mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${
                      i < review.rating ? "text-yellow-400" : "text-stone-300"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              <h3 className="font-medium text-stone-900 mb-2">
                {review.title}
              </h3>
              <p className="text-stone-600">{review.text}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
