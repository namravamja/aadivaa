"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  ShoppingBag,
  Heart,
  User,
  Search,
  ChevronDown,
} from "lucide-react";
import LanguageSelector from "./LanguageSelector";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Shop", href: "/User/Products" },
  { name: "Artists", href: "/User/Artists" },
  {
    name: "Become Seller",
    children: [
      { name: "How to be a seller?", href: "/Artist/HowTo" },
      { name: "Go to dashboard", href: "/Artist/login" },
    ],
  },
  { name: "About", href: "/User/About" },
  { name: "Journal", href: "/User/Journal" },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
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

  const toggleSubmenu = (name: string) => {
    setOpenSubmenu(openSubmenu === name ? null : name);
  };

  return (
    <header className="bg-white/95 backdrop-blur-sm fixed top-0 left-0 right-0 z-40 shadow-md border-b border-stone-100">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18 md:h-20">
          {/* Logo - responsive sizing */}
          <Link href="/" className="flex items-center">
            <span className="text-lg sm:text-xl font-light tracking-wider text-stone-900 hover:text-terracotta-600 transition-colors duration-300">
              AADIVAA<span className="font-medium">EARTH</span>
            </span>
          </Link>

          {/* Desktop Navigation - with responsive breakpoints */}
          <nav className="hidden md:flex items-center space-x-4 lg:space-x-6 xl:space-x-10">
            {navigation.map((item) =>
              !item.children ? (
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
              ) : (
                <div key={item.name} className="relative group py-2">
                  <div className="flex items-center gap-1 cursor-pointer">
                    <span className="text-xs sm:text-sm font-medium text-stone-600 group-hover:text-stone-900 transition-colors duration-300">
                      {item.name}
                    </span>
                    <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 text-stone-600 group-hover:text-stone-900 transition-colors duration-300" />
                  </div>
                  <div className="absolute left-0 mt-2 w-48 bg-white border border-stone-100 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top scale-95 group-hover:scale-100 z-50">
                    {item.children.map((child) => (
                      <Link
                        key={child.name}
                        href={child.href}
                        className={`block px-4 py-2 text-xs sm:text-sm text-stone-700 hover:bg-stone-50 hover:text-terracotta-600 transition-colors duration-200 ${
                          pathname === child.href
                            ? "text-terracotta-600 bg-stone-50"
                            : ""
                        }`}
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )
            )}
          </nav>

          {/* Desktop Actions - responsive spacing and sizing */}
          <div className="hidden md:flex items-center space-x-3 lg:space-x-5 xl:space-x-7">
            <LanguageSelector />
            <button
              className="text-stone-600 hover:text-terracotta-600 transition-colors duration-300"
              aria-label="Search"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <Link
              href="/User/login"
              className="text-stone-600 hover:text-terracotta-600 transition-colors duration-300"
              aria-label="Account"
            >
              <User className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
            <Link
              href="/User/Wishlist"
              className="text-stone-600 hover:text-terracotta-600 transition-colors duration-300"
              aria-label="Wishlist"
            >
              <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
            <Link
              href="/cart"
              className="relative text-stone-600 hover:text-terracotta-600 transition-colors duration-300"
              aria-label="Cart"
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="absolute -top-2 -right-2 bg-terracotta-600 text-white text-xs w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center rounded-full font-medium shadow-sm text-[10px] sm:text-xs">
                3
              </span>
            </Link>
          </div>

          {/* Mobile Menu Button - better spacing for small devices */}
          <div className="md:hidden flex items-center space-x-3">
            <LanguageSelector />
            <Link
              href="/cart"
              className="relative text-stone-600"
              aria-label="Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute -top-2 -right-2 bg-terracotta-600 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-medium shadow-sm">
                3
              </span>
            </Link>
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
              {navigation.map((item) =>
                !item.children ? (
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
                ) : (
                  <div key={item.name} className="flex flex-col">
                    <button
                      onClick={() => toggleSubmenu(item.name)}
                      className="flex items-center justify-between text-xl sm:text-2xl font-light text-stone-900 w-full text-left py-1"
                      aria-expanded={openSubmenu === item.name}
                    >
                      <span>{item.name}</span>
                      <ChevronDown
                        className={`w-4 h-4 sm:w-5 sm:h-5 text-stone-900 transition-transform duration-300 ${
                          openSubmenu === item.name
                            ? "transform rotate-180"
                            : ""
                        }`}
                      />
                    </button>

                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        openSubmenu === item.name
                          ? "max-h-40 opacity-100 mt-2"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className="pl-4 flex flex-col space-y-2 border-l border-stone-200">
                        {item.children.map((child) => (
                          <Link
                            key={child.name}
                            href={child.href}
                            className={`text-base sm:text-lg py-1 ${
                              pathname === child.href
                                ? "text-terracotta-600"
                                : "text-stone-700 hover:text-terracotta-600 transition-colors duration-300"
                            }`}
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              )}

              <div className="border-t border-stone-200 pt-5 mt-2 flex flex-col space-y-5 bg-stone-50 -mx-4 px-4 pb-6 rounded-b-lg">
                <Link
                  href="/login"
                  className="text-stone-900 text-lg sm:text-xl font-light flex items-center gap-3 hover:text-terracotta-600 transition-colors duration-300 p-2 hover:bg-white rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Account</span>
                </Link>
                <Link
                  href="/User/Wishlist"
                  className="text-stone-900 text-lg sm:text-xl font-light flex items-center gap-3 hover:text-terracotta-600 transition-colors duration-300 p-2 hover:bg-white rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Wishlist</span>
                </Link>
                <Link
                  href="/search"
                  className="text-stone-900 text-lg sm:text-xl font-light flex items-center gap-3 hover:text-terracotta-600 transition-colors duration-300 p-2 hover:bg-white rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Search</span>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
