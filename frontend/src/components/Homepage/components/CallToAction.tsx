"use client";

import { useAuthModal } from "@/app/(auth)/components/auth-modal-provider";
import Link from "next/link";

export default function CallToAction() {
  const { openArtistSignup } = useAuthModal();

  return (
    <section className="py-16 sm:py-20 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-light text-stone-900 mb-4 sm:mb-6">
            Join Our Community
          </h2>
          <p className="text-stone-600 mb-8 sm:mb-10">
            Support tribal artisans and discover unique handcrafted pieces that
            tell a story.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={openArtistSignup}
              className="px-6 cursor-pointer sm:px-8 py-3 bg-terracotta-600 text-white font-medium hover:bg-terracotta-700 transition-colors"
            >
              Create Account
            </button>
            <Link
              href="/Products"
              className="px-6 sm:px-8 py-3 border border-stone-900 text-stone-900 font-medium hover:bg-stone-50 transition-colors"
            >
              Support Artisans
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
