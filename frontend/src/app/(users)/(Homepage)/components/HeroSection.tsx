import Link from "next/link";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-stone-100">
      <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
        <div className="order-2 md:order-1 py-12">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light tracking-tight text-stone-900 mb-6">
            Aadivaa <span className="font-medium">Earth</span>
          </h1>
          <p className="text-lg sm:text-xl text-stone-600 max-w-md mb-8 leading-relaxed">
            Supporting tribal communities through contemporary craft and design.
          </p>
          <Link
            href="/Products"
            className="inline-flex items-center justify-center px-6 sm:px-8 py-3 text-base font-medium text-white bg-terracotta-600 hover:bg-terracotta-700 transition-colors duration-300"
          >
            Explore Collection
          </Link>
        </div>
        <div className="order-1 md:order-2 relative h-[40vh] sm:h-[50vh] md:h-[60vh] w-full">
          <Image
            src="/Profile.jpg"
            alt="Handcrafted tribal pottery"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
    </section>
  );
}
