import Link from "next/link";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-stone-100">
      <div className="flex w-full h-full flex-col md:flex-row">
        {/* Left Side - Text Content (3/4) */}
        <div className="w-full md:w-3/4 flex flex-col justify-center px-6 md:px-12 py-12 ">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light tracking-tight text-stone-900 mb-6">
            Aadivaa <span className="font-medium">Earth</span>
          </h1>
          <p className="text-lg sm:text-xl text-stone-600 max-w-md mb-8 leading-relaxed">
            Supporting tribal communities through contemporary craft and design.
          </p>
          <Link
            href="/Products"
            className="inline-flex items-center w-2xs justify-center px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-medium text-white bg-terracotta-600 hover:bg-terracotta-700 transition-colors duration-300"
          >
            Explore Collection
          </Link>
        </div>

        {/* Right Side - Image (1/4) */}
        <div className="w-full md:max-w-3/4 h-[60vh] md:h-[90vh] relative">
          {/* Uncomment to use image and overlay */}
          <Image
            src="/front.jpg"
            alt="Handcrafted tribal pottery"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-stone-100 via-stone-100/60 to-transparent" />
        </div>
      </div>
    </section>
  );
}
