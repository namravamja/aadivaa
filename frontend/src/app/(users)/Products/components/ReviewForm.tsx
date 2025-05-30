"use client";

import type React from "react";

import { useState } from "react";

type ReviewFormProps = {
  onSubmit: (review: {
    userName: string;
    rating: number;
    title: string;
    text: string;
    date: string;
    verified: boolean;
  }) => void;
  onCancel: () => void;
};

export default function ReviewForm({ onSubmit, onCancel }: ReviewFormProps) {
  const [formData, setFormData] = useState({
    userName: "",
    rating: 5,
    title: "",
    text: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "rating" ? Number.parseInt(value, 10) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Create a new review object
    const newReview = {
      ...formData,
      date: new Date().toISOString().split("T")[0], // Format: YYYY-MM-DD
      verified: true, // In a real app, this would be determined by the backend
    };

    onSubmit(newReview);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-xl font-medium text-stone-900 mb-4">
        Write a Review
      </h3>

      <div>
        <label
          htmlFor="rating"
          className="block text-sm font-medium text-stone-700 mb-1"
        >
          Rating
        </label>
        <select
          id="rating"
          name="rating"
          value={formData.rating}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-stone-300 focus:border-terracotta-500 focus:outline-none focus:ring-1 focus:ring-terracotta-500"
          required
        >
          <option value="5">5 Stars - Excellent</option>
          <option value="4">4 Stars - Very Good</option>
          <option value="3">3 Stars - Good</option>
          <option value="2">2 Stars - Fair</option>
          <option value="1">1 Star - Poor</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="userName"
          className="block text-sm font-medium text-stone-700 mb-1"
        >
          Your Name
        </label>
        <input
          id="userName"
          name="userName"
          type="text"
          value={formData.userName}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-stone-300 focus:border-terracotta-500 focus:outline-none focus:ring-1 focus:ring-terracotta-500"
          required
        />
      </div>

      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-stone-700 mb-1"
        >
          Review Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          value={formData.title}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-stone-300 focus:border-terracotta-500 focus:outline-none focus:ring-1 focus:ring-terracotta-500"
          required
          placeholder="Summarize your experience"
        />
      </div>

      <div>
        <label
          htmlFor="text"
          className="block text-sm font-medium text-stone-700 mb-1"
        >
          Review Details
        </label>
        <textarea
          id="text"
          name="text"
          rows={4}
          value={formData.text}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-stone-300 focus:border-terracotta-500 focus:outline-none focus:ring-1 focus:ring-terracotta-500"
          required
          placeholder="What did you like or dislike about this product?"
        />
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border border-stone-300 text-stone-700 hover:bg-stone-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-terracotta-600 text-white font-medium hover:bg-terracotta-700 transition-colors"
        >
          Submit Review
        </button>
      </div>
    </form>
  );
}
