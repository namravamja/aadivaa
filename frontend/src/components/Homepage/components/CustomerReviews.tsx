"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

// Mock data - in a real app, this would come from RTK Query
const reviews = [
  {
    id: "1",
    name: "Sarah M.",
    location: "New York, USA",
    text: "The craftsmanship is exceptional. Each piece tells a story and brings a unique energy to my home.",
    product: "Beaded Necklace",
  },
  {
    id: "2",
    name: "James L.",
    location: "London, UK",
    text: "The wall hanging has become the centerpiece of my living room. The quality and attention to detail is remarkable.",
    product: "Woven Wall Hanging",
  },
  {
    id: "3",
    name: "Elena K.",
    location: "Berlin, Germany",
    text: "I love my new ceramic vase. The design is unique and tells a story. The shipping was well-packaged and arrived safely.",
    product: "Ceramic Vase",
  },
];

export default function CustomerReviews() {
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % reviews.length);
  };

  return (
    <section className="py-16 sm:py-20 md:py-24 bg-sage-700 text-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl font-light mb-10 sm:mb-16 text-center">
          Customer Testimonials
        </h2>

        <div className="max-w-3xl mx-auto">
          <div className="relative">
            <blockquote className="text-xl sm:text-2xl font-light italic text-center mb-6 sm:mb-8 px-4">
              "{reviews[activeIndex].text}"
            </blockquote>
            <div className="text-center">
              <p className="font-medium">{reviews[activeIndex].name}</p>
              <p className="text-sage-200 text-sm">
                {reviews[activeIndex].location}
              </p>
            </div>

            <div className="flex justify-center gap-4 mt-8 sm:mt-12">
              <button
                onClick={handlePrev}
                className="p-2 border border-white/20 hover:border-white/50 transition-colors"
                aria-label="Previous review"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                className="p-2 border border-white/20 hover:border-white/50 transition-colors"
                aria-label="Next review"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
