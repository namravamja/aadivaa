"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, User } from "lucide-react";
import LanguageSelector from "@/components/LanguageSelector";

const navigation = [
  { name: "Home", href: "/Artist" },
  { name: "Profile", href: "/Artist/Profile" },
  { name: "Dashboard", href: "/Artist/Dashboard" },
  { name: "Orders", href: "/Artist/Orders" },
  { name: "Products", href: "/Artist/Product" },
  { name: "Reviews", href: "/Artist/Reviews" },
  { name: "Journal", href: "/Artist/Journal" },
];

export default function ArtistNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const pathname = usePathname();

  // Handle menu opening and closing with animation
  useEffect(() => {
    if (isMenuOpen) {
      setMenuVisible(true);
    } else {
      // Delay hiding the menu until after the animation completes
      const timer = setTimeout(() => {
        setMenuVisible(false);
      }, 300); // Match this to the CSS transition duration
      return () => clearTimeout(timer);
    }
  }, [isMenuOpen]);

  return (
    <>
      <header className="bg-white/95 backdrop-blur-sm fixed top-0 left-0 right-0 z-40 shadow-md border-b border-stone-100">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18 md:h-20">
            {/* Logo - responsive sizing */}
            <Link href="/Artist" className="flex items-center">
              <span className="text-lg sm:text-xl font-light tracking-wider text-stone-900 hover:text-terracotta-600 transition-colors duration-300">
                AADIVAA<span className="font-medium">EARTH</span>
              </span>
            </Link>

            {/* Desktop Navigation - with responsive breakpoints */}
            <nav className="hidden md:flex items-center space-x-4 lg:space-x-6 xl:space-x-10">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-xs sm:text-sm font-medium relative py-2 ${
                    pathname === item.href
                      ? "text-terracotta-600"
                      : "text-stone-600 hover:text-terracotta-600 transition-colors duration-300"
                  } ${
                    pathname === item.href
                      ? "after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-0.5 after:bg-terracotta-600"
                      : ""
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Desktop Actions - responsive spacing and sizing */}
            <div className="hidden md:flex items-center space-x-3 lg:space-x-5 xl:space-x-7">
              <LanguageSelector />
              <button
                className="text-stone-600 hover:text-terracotta-600 transition-colors duration-300"
                aria-label="Search"
              >
                <User className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Mobile Menu Button - better spacing for small devices */}
            <div className="md:hidden flex items-center space-x-3">
              <LanguageSelector />
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-stone-600 hover:text-terracotta-600 transition-colors duration-300 p-1 rounded-md hover:bg-stone-100"
                aria-expanded={isMenuOpen}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <X className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 rotate-0" />
                ) : (
                  <Menu className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 rotate-0" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu - with smooth transitions */}
        <div
          className={`md:hidden fixed inset-x-0 top-16 sm:top-18 h-[calc(100vh-4rem)] sm:h-[calc(100vh-4.5rem)] bg-white shadow-lg border-t border-stone-100 transform transition-all duration-300 ease-in-out ${
            isMenuOpen
              ? "translate-y-0 opacity-100"
              : "translate-y-[-8px] opacity-0 pointer-events-none"
          }`}
        >
          {menuVisible && (
            <div className="container mx-auto px-4 py-6 h-full overflow-auto">
              <nav className="flex flex-col space-y-5">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`text-xl sm:text-2xl font-light ${
                      pathname === item.href
                        ? "text-terracotta-600"
                        : "text-stone-900 hover:text-terracotta-600 transition-colors duration-300"
                    } ${
                      pathname === item.href
                        ? "border-l-4 border-terracotta-600 pl-2"
                        : ""
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}

                <div className="border-t border-stone-200 pt-5 mt-2 flex flex-col space-y-5 bg-stone-50 -mx-4 px-4 pb-6 rounded-b-lg">
                  <Link
                    href="/login"
                    className="text-stone-900 text-lg sm:text-xl font-light flex items-center gap-3 hover:text-terracotta-600 transition-colors duration-300 p-2 hover:bg-white rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Account</span>
                  </Link>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>
      <div className="mb-20"></div>
    </>
  );
}
