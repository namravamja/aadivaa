import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-stone-200">
      <div className="container mx-auto px-4 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* About */}
          <div className="md:col-span-2">
            <h3 className="text-xl font-light text-stone-900 mb-6">
              Aadivaa<span className="font-medium">Earth</span>
            </h3>
            <p className="text-stone-600 max-w-md mb-8">
              A curated marketplace connecting tribal artisans with global
              audiences, preserving cultural heritage through contemporary
              craft.
            </p>
            <form className="flex max-w-sm">
              <input
                type="email"
                placeholder="Your email"
                className="px-4 py-3 bg-white border border-stone-300 flex-grow focus:outline-none focus:border-stone-900"
                required
              />
              <button
                type="submit"
                className="bg-terracotta-600 text-white px-6 py-3 cursor-pointer"
                aria-label="Subscribe"
              >
                Subscribe
              </button>
            </form>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-medium text-stone-900 mb-6 uppercase tracking-wider">
              Shop
            </h3>
            <ul className="space-y-4 text-stone-600">
              <li>
                <Link
                  href="/Products"
                  className="hover:text-terracotta-600 transition-colors"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  href="/Products?category=jewelry"
                  className="hover:text-terracotta-600 transition-colors"
                >
                  Jewelry
                </Link>
              </li>
              <li>
                <Link
                  href="/Products?category=textile"
                  className="hover:text-terracotta-600 transition-colors"
                >
                  Textiles
                </Link>
              </li>
              <li>
                <Link
                  href="/Products?category=handicraft"
                  className="hover:text-terracotta-600 transition-colors"
                >
                  Handicrafts
                </Link>
              </li>
              <li>
                <Link
                  href="/Products?category=accessories"
                  className="hover:text-terracotta-600 transition-colors"
                >
                  Accessories
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-medium text-stone-900 mb-6 uppercase tracking-wider">
              Company
            </h3>
            <ul className="space-y-4 text-stone-600">
              <li>
                <Link
                  href="/About"
                  className="hover:text-terracotta-600 transition-colors"
                >
                  Our Mission
                </Link>
              </li>
              <li>
                <Link
                  href="/Artists"
                  className="hover:text-terracotta-600 transition-colors"
                >
                  Artists
                </Link>
              </li>
              <li>
                <Link
                  href="/HowTo"
                  className="hover:text-terracotta-600 transition-colors"
                >
                  How to be an seller
                </Link>
              </li>
              <li>
                <Link
                  href="/About"
                  className="hover:text-terracotta-600 transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/HowTo#faq"
                  className="hover:text-terracotta-600 transition-colors"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-stone-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-stone-500 text-sm">
            © {new Date().getFullYear()} AadivaaEarth. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link
              href="/#"
              className="text-stone-500 text-sm hover:text-terracotta-600 transition-colors"
            >
              Terms
            </Link>
            <Link
              href="/#"
              className="text-stone-500 text-sm hover:text-terracotta-600 transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/#"
              className="text-stone-500 text-sm hover:text-terracotta-600 transition-colors"
            >
              Shipping
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
