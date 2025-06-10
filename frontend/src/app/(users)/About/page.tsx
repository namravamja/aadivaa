import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <section className="mb-16">
          <div className="relative h-[60vh] w-full mb-8">
            <Image
              src="/about/about-hero.jpg"
              alt="Tribal artisan at work"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-sage-700 bg-opacity-40 flex items-center justify-center">
              <div className="text-center text-white max-w-3xl px-4">
                <h1 className="text-4xl sm:text-5xl font-light mb-4">
                  Our Mission
                </h1>
                <p className="text-xl">
                  Preserving cultural heritage through contemporary craft and
                  design
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="mb-16">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-light text-stone-900 mb-4">
              Our Story
            </h2>
            <p className="text-stone-600 leading-relaxed">
              Tribal Crafts was founded in 2018 with a simple yet powerful
              mission: to connect indigenous artisans with global markets while
              preserving cultural heritage and supporting sustainable
              livelihoods.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-stone-600 mb-4 leading-relaxed">
                Our journey began when our founder, Elena Martinez, traveled
                through Native American reservations and witnessed the
                incredible craftsmanship being practiced, often with limited
                opportunities for economic sustainability.
              </p>
              <p className="text-stone-600 mb-4 leading-relaxed">
                Inspired by the artisans she met and their stories, Elena
                envisioned a platform that would not only showcase their
                exceptional work but also educate consumers about the cultural
                significance behind each piece.
              </p>
              <p className="text-stone-600 leading-relaxed">
                Today, Tribal Crafts partners with over 50 artisans from various
                indigenous communities, providing them with fair compensation,
                business training, and a global platform to share their craft
                and cultural heritage.
              </p>
            </div>
            <div className="relative h-80 md:h-96">
              <Image
                src="/about/founder.jpg"
                alt="Tribal Crafts founder"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="mb-16 bg-stone-50 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-light text-stone-900 mb-12 text-center">
              Our Values
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-terracotta-100 text-terracotta-600 rounded-full">
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-stone-900 mb-2">
                  Cultural Preservation
                </h3>
                <p className="text-stone-600">
                  We honor and preserve indigenous crafting traditions, ensuring
                  techniques and stories are passed to future generations.
                </p>
              </div>

              <div className="text-center p-6">
                <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-terracotta-100 text-terracotta-600 rounded-full">
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-stone-900 mb-2">
                  Fair Compensation
                </h3>
                <p className="text-stone-600">
                  We ensure artisans receive fair prices for their work,
                  supporting sustainable livelihoods in their communities.
                </p>
              </div>

              <div className="text-center p-6">
                <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-terracotta-100 text-terracotta-600 rounded-full">
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-stone-900 mb-2">
                  Environmental Responsibility
                </h3>
                <p className="text-stone-600">
                  We promote sustainable practices in material sourcing and
                  production, respecting the natural world.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Impact */}
        <section className="mb-16">
          <h2 className="text-3xl font-light text-stone-900 mb-12 text-center">
            Our Impact
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <h3 className="text-2xl font-light text-stone-900 mb-4">
                Supporting Communities
              </h3>
              <p className="text-stone-600 mb-4 leading-relaxed">
                Through our work, we've helped artisans increase their income by
                an average of 40%, enabling them to support their families and
                invest in their communities.
              </p>
              <p className="text-stone-600 mb-4 leading-relaxed">
                We've established educational programs that have trained over
                200 young people in traditional craft techniques, ensuring these
                skills continue to thrive.
              </p>
              <p className="text-stone-600 leading-relaxed">
                Our community development fund has contributed to building
                schools, healthcare facilities, and clean water projects in
                artisan communities.
              </p>
            </div>
            <div className="relative h-80 md:h-96 order-1 md:order-2">
              <Image
                src="/about/impact.jpg"
                alt="Community impact"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-terracotta-600 text-white p-12 text-center">
          <h2 className="text-3xl font-light mb-4">Join Our Mission</h2>
          <p className="max-w-2xl mx-auto mb-8">
            Support indigenous artisans and help preserve cultural heritage by
            exploring our collection of authentic handcrafted items.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/Products"
              className="px-8 py-3 bg-white text-terracotta-600 font-medium hover:bg-stone-100 transition-colors"
            >
              Shop Collection
            </Link>
            <Link
              href="/About"
              className="px-8 py-3 border border-white text-white font-medium hover:bg-terracotta-700 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
