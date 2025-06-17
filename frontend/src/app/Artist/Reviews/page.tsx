"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, MessageSquare, Trash2, Shield, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import {
  useGetArtistReviewsQuery,
  useUpdateReviewVerificationStatusMutation,
  useDeleteReviewByArtistMutation,
} from "@/services/api/artistApi";

export default function ArtistReviews() {
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterRating, setFilterRating] = useState("all");

  // RTK Query hooks
  const {
    data: reviews = [],
    isLoading,
    error,
    refetch,
  } = useGetArtistReviewsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const [updateVerificationStatus, { isLoading: isUpdatingVerification }] =
    useUpdateReviewVerificationStatusMutation();
  const [deleteReview, { isLoading: isDeleting }] =
    useDeleteReviewByArtistMutation();

  // Filter reviews
  const filteredReviews = reviews.filter((review: any) => {
    const matchesRating =
      filterRating === "all" || review.rating.toString() === filterRating;
    return matchesRating;
  });

  const handleVerificationToggle = async (
    reviewId: string,
    currentVerified: boolean
  ) => {
    const newVerified = !currentVerified;
    const loadingToast = toast.loading(
      `${newVerified ? "Verifying" : "Unverifying"} review...`
    );

    try {
      await updateVerificationStatus({
        reviewId,
        verified: newVerified,
      }).unwrap();

      toast.success(
        `Review ${newVerified ? "verified" : "unverified"} successfully!`,
        { id: loadingToast }
      );
      refetch();
    } catch (error: any) {
      console.error("Failed to update verification status:", error);
      const errorMessage =
        error?.data?.error ||
        error?.message ||
        "Failed to update verification status";
      toast.error(errorMessage, { id: loadingToast });
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    const loadingToast = toast.loading("Deleting review...");

    try {
      await deleteReview({ reviewId }).unwrap();
      toast.success("Review deleted successfully!", { id: loadingToast });
      refetch();
    } catch (error: any) {
      console.error("Failed to delete review:", error);
      const errorMessage =
        error?.data?.error || error?.message || "Failed to delete review";
      toast.error(errorMessage, { id: loadingToast });
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

  const getUserDisplayName = (buyer: any) => {
    if (buyer?.firstName && buyer?.lastName) {
      return `${buyer.firstName} ${buyer.lastName}`;
    }
    return buyer?.firstName || "Anonymous User";
  };

  // Calculate statistics
  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
      ? (
          reviews.reduce((acc: number, review: any) => acc + review.rating, 0) /
          totalReviews
        ).toFixed(1)
      : "0.0";
  const verifiedReviews = reviews.filter(
    (review: any) => review.verified
  ).length;
  const unverifiedReviews = totalReviews - verifiedReviews;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-terracotta-600 mx-auto"></div>
          <p className="mt-2 text-stone-600">Loading reviews...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">
            Failed to load reviews. Please try again.
          </p>
          <button
            onClick={() => refetch()}
            className="text-terracotta-600 hover:text-terracotta-700 underline cursor-pointer"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

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
                {totalReviews}
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
                {averageRating}
              </div>
              <div className="text-stone-500 text-sm">Average Rating</div>
            </div>
          </div>
        </div>
        <div className="bg-white border border-stone-200 p-6 shadow-sm">
          <div className="flex items-center">
            <ShieldCheck className="w-8 h-8 text-green-600 mr-3" />
            <div>
              <div className="text-2xl font-semibold text-stone-900">
                {verifiedReviews}
              </div>
              <div className="text-stone-500 text-sm">Verified</div>
            </div>
          </div>
        </div>
        <div className="bg-white border border-stone-200 p-6 shadow-sm">
          <div className="flex items-center">
            <Shield className="w-8 h-8 text-gray-600 mr-3" />
            <div>
              <div className="text-2xl font-semibold text-stone-900">
                {unverifiedReviews}
              </div>
              <div className="text-stone-500 text-sm">Unverified</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-stone-200 p-6 mb-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Rating
            </label>
            <select
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 focus:border-terracotta-500 focus:outline-none cursor-pointer"
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
        {filteredReviews.map((review: any) => (
          <div
            key={review.id}
            className="bg-white border border-stone-200 p-6 shadow-sm"
          >
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4">
              <div className="flex items-start mb-4 lg:mb-0">
                <div className="relative w-16 h-16 mr-4 flex-shrink-0">
                  <Image
                    src={review.buyer?.avatar || "/Profile.jpg"}
                    alt={getUserDisplayName(review.buyer)}
                    fill
                    className="object-cover rounded-full"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-stone-900 mb-1">
                    {review.product?.productName || "Product"}
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
                    By {getUserDisplayName(review.buyer)} •{" "}
                    {new Date(review.date).toLocaleDateString()}
                    <div
                      className={`inline-block ml-2 text-xs px-2 py-1 rounded-full ${
                        review.verified
                          ? "bg-green-100 text-green-700 border border-green-200"
                          : "bg-gray-100 text-gray-600 border border-gray-200"
                      }`}
                    >
                      {review.verified ? "Verified" : "Unverified"}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() =>
                    handleVerificationToggle(review.id, review.verified)
                  }
                  disabled={isUpdatingVerification}
                  className={`px-3 py-2 text-sm rounded-md transition-colors cursor-pointer disabled:opacity-50 ${
                    review.verified
                      ? "bg-green-100 text-green-700 hover:bg-green-200 border border-green-300"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300"
                  }`}
                  title={
                    review.verified ? "Mark as Unverified" : "Mark as Verified"
                  }
                >
                  {review.verified ? (
                    <>
                      <ShieldCheck className="w-4 h-4 inline mr-1" />
                      Verified
                    </>
                  ) : (
                    <>
                      <Shield className="w-4 h-4 inline mr-1" />
                      Unverified
                    </>
                  )}
                </button>
                <button
                  onClick={() => handleDeleteReview(review.id)}
                  disabled={isDeleting}
                  className="text-stone-400 hover:text-red-600 p-2 rounded-md hover:bg-red-50 transition-colors cursor-pointer disabled:opacity-50"
                  title="Delete Review"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="font-medium text-stone-900 mb-2">
                {review.title}
              </h4>
              <p className="text-stone-600 leading-relaxed">{review.text}</p>
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
          <p className="text-stone-600">
            {totalReviews === 0
              ? "You don't have any reviews yet. Reviews will appear here once customers start reviewing your products."
              : "Try adjusting your filter criteria"}
          </p>
        </div>
      )}
    </div>
  );
}
