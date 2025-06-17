"use client";

import type React from "react";

import { useState } from "react";
import {
  useAddReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
  useGetReviewsByProductQuery,
} from "@/services/api/buyerApi";
import Image from "next/image";
import toast from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";
import { useAuthModal } from "@/app/(auth)/components/auth-modal-provider";

// ReviewForm component with interactive stars
const ReviewForm = ({
  onSubmit,
  onCancel,
  initialData = null,
  isEditing = false,
}: {
  onSubmit: (review: any) => void;
  onCancel: () => void;
  initialData?: any;
  isEditing?: boolean;
}) => {
  const [rating, setRating] = useState(initialData?.rating || 0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [title, setTitle] = useState(initialData?.title || "");
  const [text, setText] = useState(initialData?.text || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    if (!title.trim() || !text.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    onSubmit({
      ...(isEditing && { reviewId: initialData.id }),
      rating,
      title: title.trim(),
      text: text.trim(),
    });

    if (!isEditing) {
      // Reset form only for new reviews
      setRating(0);
      setHoveredRating(0);
      setTitle("");
      setText("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-medium text-stone-900 mb-4">
        {isEditing ? "Edit Review" : "Write a Review"}
      </h3>

      {/* Star Rating */}
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-2">
          Rating *
        </label>
        <div className="flex items-center space-x-1">
          {Array.from({ length: 5 }).map((_, i) => {
            const starValue = i + 1;
            return (
              <button
                key={i}
                type="button"
                onClick={() => setRating(starValue)}
                onMouseEnter={() => setHoveredRating(starValue)}
                onMouseLeave={() => setHoveredRating(0)}
                className="p-1 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:ring-offset-1 rounded cursor-pointer"
                aria-label={`Rate ${starValue} star${
                  starValue !== 1 ? "s" : ""
                }`}
              >
                <svg
                  className={`w-8 h-8 transition-colors duration-200 cursor-pointer ${
                    starValue <= (hoveredRating || rating)
                      ? "text-yellow-400 fill-current"
                      : "text-stone-300 hover:text-yellow-200"
                  }`}
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </button>
            );
          })}
          <span className="ml-3 text-sm text-stone-600">
            {rating > 0 && (
              <>
                {rating} star{rating !== 1 ? "s" : ""}
                {rating === 1 && " - Poor"}
                {rating === 2 && " - Fair"}
                {rating === 3 && " - Good"}
                {rating === 4 && " - Very Good"}
                {rating === 5 && " - Excellent"}
              </>
            )}
          </span>
        </div>
      </div>

      {/* Review Title */}
      <div>
        <label
          htmlFor="review-title"
          className="block text-sm font-medium text-stone-700 mb-2"
        >
          Review Title *
        </label>
        <input
          type="text"
          id="review-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Summarize your review in a few words"
          className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent transition-all duration-200"
          maxLength={100}
        />
        <p className="mt-1 text-xs text-stone-500">
          {title.length}/100 characters
        </p>
      </div>

      {/* Review Text */}
      <div>
        <label
          htmlFor="review-text"
          className="block text-sm font-medium text-stone-700 mb-2"
        >
          Your Review *
        </label>
        <textarea
          id="review-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Share your experience with this product..."
          rows={4}
          className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent transition-all duration-200 resize-vertical"
          maxLength={500}
        />
        <p className="mt-1 text-xs text-stone-500">
          {text.length}/500 characters
        </p>
      </div>

      {/* Form Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <button
          type="submit"
          className="flex-1 bg-terracotta-600 text-white px-6 py-2 font-medium hover:bg-terracotta-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:ring-offset-2 cursor-pointer"
        >
          {isEditing ? "Update Review" : "Submit Review"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-stone-200 text-stone-700 px-6 py-2 font-medium hover:bg-stone-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-2 cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

type ProductReviewsProps = {
  productId: string;
};

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState<any>(null);

  // Authentication hooks
  const { isAuthenticated, user, isLoading: authLoading } = useAuth();
  const { openBuyerLogin } = useAuthModal();

  // RTK Query hooks
  const {
    data: reviews = [],
    isLoading,
    error,
    refetch,
  } = useGetReviewsByProductQuery(productId, {
    refetchOnMountOrArgChange: true,
  });
  const [addReview, { isLoading: isAdding }] = useAddReviewMutation();
  const [updateReview, { isLoading: isUpdating }] = useUpdateReviewMutation();
  const [deleteReview, { isLoading: isDeleting }] = useDeleteReviewMutation();

  // Calculate average rating
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((acc: number, review: any) => acc + review.rating, 0) /
        reviews.length
      : 0;

  // Check if user owns a review
  const isUserReview = (review: any) => {
    return isAuthenticated && user?.id && review.buyerId === user.id;
  };

  const handleWriteReview = () => {
    if (!isAuthenticated) {
      toast.error("Please login to write a review", {
        duration: 2000,
        icon: "🔒",
      });
      openBuyerLogin();
      return;
    }
    setShowReviewForm(!showReviewForm);
    setEditingReview(null);
    if (showReviewForm) {
      toast.success("Review cancelled");
    }
  };

  const handleAddReview = async (reviewData: any) => {
    if (!isAuthenticated) {
      toast.error("Please login to add a review", {
        duration: 2000,
        icon: "🔒",
      });
      openBuyerLogin();
      return;
    }

    const loadingToast = toast.loading("Adding your review...");
    try {
      await addReview({ productId, reviewData }).unwrap();
      setShowReviewForm(false);
      toast.success("Review added successfully!", { id: loadingToast });
      refetch();
    } catch (error: any) {
      console.error("Failed to add review:", error);
      const errorMessage =
        error?.data?.error ||
        error?.message ||
        "Failed to add review. Please try again.";
      toast.error(errorMessage, { id: loadingToast });
    }
  };

  const handleEditReview = async (reviewData: any) => {
    if (!isAuthenticated) {
      toast.error("Please login to edit reviews", {
        duration: 2000,
        icon: "🔒",
      });
      openBuyerLogin();
      return;
    }

    const loadingToast = toast.loading("Updating your review...");
    try {
      await updateReview(reviewData).unwrap();
      setEditingReview(null);
      toast.success("Review updated successfully!", { id: loadingToast });
      refetch();
    } catch (error: any) {
      console.error("Failed to update review:", error);
      const errorMessage =
        error?.data?.error ||
        error?.message ||
        "Failed to update review. Please try again.";
      toast.error(errorMessage, { id: loadingToast });
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!isAuthenticated) {
      toast.error("Please login to delete reviews", {
        duration: 2000,
        icon: "🔒",
      });
      openBuyerLogin();
      return;
    }

    const loadingToast = toast.loading("Deleting review...");
    try {
      await deleteReview({ reviewId }).unwrap();
      toast.success("Review deleted successfully!", { id: loadingToast });
      refetch();
    } catch (error: any) {
      console.error("Failed to delete review:", error);
      const errorMessage =
        error?.data?.error ||
        error?.message ||
        "Failed to delete review. Please try again.";
      toast.error(errorMessage, { id: loadingToast });
    }
  };

  const startEditing = (review: any) => {
    if (!isAuthenticated) {
      toast.error("Please login to edit reviews", {
        duration: 2000,
        icon: "🔒",
      });
      openBuyerLogin();
      return;
    }

    if (!isUserReview(review)) {
      toast.error("You can only edit your own reviews");
      return;
    }

    setEditingReview(review);
    setShowReviewForm(false);
  };

  const cancelEditing = () => {
    setEditingReview(null);
    toast.success("Edit cancelled");
  };

  const getUserDisplayName = (buyer: any) => {
    if (buyer?.firstName && buyer?.lastName) {
      return `${buyer.firstName} ${buyer.lastName}`;
    }
    return buyer?.firstName || "Anonymous User";
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-terracotta-600 mx-auto"></div>
        <p className="mt-2 text-stone-600">Loading reviews...</p>
      </div>
    );
  }

  if (error) {
    toast.error("Failed to load reviews");
    return (
      <div className="text-center py-8">
        <p className="text-red-600">
          Failed to load reviews. Please try again.
        </p>
        <button
          onClick={() => {
            toast.loading("Retrying...");
            refetch()
              .then(() => {
                toast.success("Reviews loaded successfully!");
              })
              .catch(() => {
                toast.error("Still unable to load reviews");
              });
          }}
          className="mt-2 text-terracotta-600 hover:text-terracotta-700 underline cursor-pointer"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-light text-stone-900 mb-6">
        Customer Reviews
      </h2>

      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div className="flex items-center">
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
            <span className="text-stone-600 text-sm sm:text-base">
              Based on {reviews.length} review
              {reviews.length !== 1 ? "s" : ""}
            </span>
          </div>

          <button
            onClick={handleWriteReview}
            disabled={isAdding || authLoading}
            className="bg-terracotta-600 text-white px-4 sm:px-6 py-2 font-medium hover:bg-terracotta-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:ring-offset-2 text-sm sm:text-base disabled:opacity-50 cursor-pointer"
          >
            {showReviewForm ? "Cancel Review" : "Write a Review"}
          </button>
        </div>
      </div>

      {showReviewForm && isAuthenticated && (
        <div className="mb-8 p-4 sm:p-6 border border-stone-200 bg-stone-50 rounded-lg">
          <ReviewForm
            onSubmit={handleAddReview}
            onCancel={() => setShowReviewForm(false)}
          />
        </div>
      )}

      {editingReview && isAuthenticated && (
        <div className="mb-8 p-4 sm:p-6 border border-stone-200 bg-stone-50 rounded-lg">
          <ReviewForm
            onSubmit={handleEditReview}
            onCancel={cancelEditing}
            initialData={editingReview}
            isEditing={true}
          />
        </div>
      )}

      <div className="space-y-6 sm:space-y-8">
        {reviews.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <div className="flex justify-center mb-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg
                  key={i}
                  className="w-6 h-6 text-stone-300"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-stone-600 text-sm sm:text-base">
              No reviews yet. Be the first to review this product!
            </p>
          </div>
        ) : (
          reviews.map((review: any) => (
            <div
              key={review.id}
              className="border-b border-stone-200 pb-6 sm:pb-8"
            >
              <div className="flex items-start mb-4">
                <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden mr-3 flex-shrink-0">
                  <Image
                    src={review.buyer?.avatar || "/Profile.jpg"}
                    alt={getUserDisplayName(review.buyer)}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-grow min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="font-medium text-stone-900 text-sm sm:text-base">
                          {getUserDisplayName(review.buyer)}
                        </div>
                        <div
                          className={`text-xs px-2 py-1 rounded-full ${
                            review.verified
                              ? "bg-green-100 text-green-700 border border-green-200"
                              : "bg-gray-100 text-gray-600 border border-gray-200"
                          }`}
                        >
                          {review.verified ? "Verified" : "Unverified"}
                        </div>
                      </div>
                      <div className="text-xs sm:text-sm text-stone-500">
                        {new Date(review.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {/* Edit and Delete buttons - show only for user's own reviews and when authenticated */}
                      {isAuthenticated && isUserReview(review) && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => startEditing(review)}
                            disabled={isUpdating}
                            className="text-sm text-sage-600 hover:text-sage-800 px-3 py-2 hover:bg-sage-200 transition-colors disabled:opacity-50 cursor-pointer border border-sage-200 hover:border-sage-200"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteReview(review.id)}
                            disabled={isDeleting}
                            className="text-sm text-red-600 hover:text-red-700 px-3 py-2 hover:bg-red-50 transition-colors disabled:opacity-50 cursor-pointer border border-red-500 hover:border-red-300"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center mb-3">
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
                <span className="ml-2 text-xs sm:text-sm text-stone-500">
                  {review.rating} star{review.rating !== 1 ? "s" : ""}
                </span>
              </div>

              <h3 className="font-medium text-stone-900 mb-2 text-sm sm:text-base">
                {review.title}
              </h3>
              <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
                {review.text}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
