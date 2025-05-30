"use client";

import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center flex-shrink-0">
      <span className="text-base sm:text-lg md:text-xl lg:text-xl xl:text-2xl font-light tracking-wider text-stone-900 hover:text-terracotta-600 transition-colors duration-300">
        AADIVAA<span className="font-medium">EARTH</span>
      </span>
    </Link>
  );
}
