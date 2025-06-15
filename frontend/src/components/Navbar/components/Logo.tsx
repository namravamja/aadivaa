"use client";

import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center flex-shrink-0">
      <span className="text-base sm:text-lg md:text-xl lg:text-xl xl:text-2xl font-light tracking-wider text-stone-900 hover:text-terracotta-600 transition-colors duration-300">
        <Image
          src={"/aadivaa_logo.png"}
          width={200}
          height={200}
          alt={"logo"}
        ></Image>
      </span>
    </Link>
  );
}
