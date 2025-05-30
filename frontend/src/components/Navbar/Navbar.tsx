"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ShoppingBag, User } from "lucide-react";
import LanguageSelector from "../LanguageSelector";
import Logo from "../Navbar/components/Logo";
import DesktopNavigation from "../Navbar/components/DesktopNavigation";
import ActionButtons from "../Navbar/components/ActionButtons";
import UserMenu from "../Navbar/components/UserMenu";
import MobileMenu from "../Navbar/components/MobileMenu";
import { NavigationItem, User as UserType } from "../Navbar/components/types";

const navigation: NavigationItem[] = [
  { name: "Home", href: "/" },
  { name: "Shop", href: "/Products" },
  { name: "Artists", href: "/Artists" },
  {
    name: "Become Seller",
    children: [
      { name: "How to be a seller?", href: "/Artist/HowTo" },
      { name: "Go to dashboard", href: "/Artist/login" },
    ],
    href: "",
  },
  { name: "About", href: "/About" },
  { name: "Journal", href: "/Journal" },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [user, setUser] = useState<UserType | null>({
    name: "John Doe",
    image: "/Profile.jpg",
  });

  const handleLogout = () => {
    setUser(null);
    setIsUserMenuOpen(false);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const closeUserMenu = () => {
    setIsUserMenuOpen(false);
  };

  // Close menus when clicking outside or on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMenuOpen(false);
        setIsUserMenuOpen(false);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Element;
      if (!target.closest("[data-menu]")) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  return (
    <header className="bg-white/95 backdrop-blur-sm fixed top-0 left-0 right-0 z-40 shadow-md border-b border-stone-100">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-10">
        <div className="flex items-center justify-between h-16 sm:h-18 md:h-20 lg:h-16 xl:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Logo />
          </div>

          {/* Desktop Navigation - Hidden on tablets, shown on large screens */}
          <div className="flex-1 flex justify-center">
            <DesktopNavigation navigation={navigation} />
          </div>

          {/* Desktop Actions - Hidden on small/medium screens */}
          <div className="hidden lg:flex items-center space-x-2 xl:space-x-4">
            <LanguageSelector />
            <ActionButtons />
            <UserMenu user={user} onLogout={handleLogout} />
          </div>

          {/* Tablet Actions - Shown on medium screens only */}
          <div className="hidden md:flex lg:hidden items-center space-x-3">
            <LanguageSelector />
            <ActionButtons />

            {/* Tablet User Menu */}
            <div className="relative" data-menu>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center text-stone-600 hover:text-terracotta-600 transition-colors duration-300 p-1 rounded-md hover:bg-stone-50"
                aria-label={user ? "User menu" : "Login"}
              >
                {user ? (
                  user.image ? (
                    <img
                      src={user.image}
                      alt={user.name}
                      className="w-7 h-7 rounded-full object-cover border-2 border-stone-200"
                    />
                  ) : (
                    <div className="w-7 h-7 bg-stone-200 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-stone-600" />
                    </div>
                  )
                ) : (
                  <User className="w-5 h-5" />
                )}
              </button>

              {/* Tablet User Dropdown */}
              {isUserMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-stone-100 rounded-lg shadow-xl z-50 max-h-[calc(100vh-100px)] overflow-y-auto">
                  <div className="p-3 space-y-1">
                    <UserMenu
                      user={user}
                      onLogout={handleLogout}
                      isMobile
                      onClose={closeUserMenu}
                      cartCount={3}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Tablet Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-stone-600 hover:text-terracotta-600 transition-colors duration-300 p-1 rounded-md hover:bg-stone-50"
              aria-expanded={isMenuOpen}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 transition-transform duration-300" />
              ) : (
                <Menu className="w-6 h-6 transition-transform duration-300" />
              )}
            </button>
          </div>

          {/* Mobile Actions - Shown on small screens only */}
          <div className="md:hidden flex items-center space-x-2 sm:space-x-3">
            <LanguageSelector />

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-stone-600 hover:text-terracotta-600 transition-colors duration-300 p-1 rounded-md hover:bg-stone-50"
              aria-expanded={isMenuOpen}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300" />
              ) : (
                <Menu className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300" />
              )}
            </button>

            {/* Mobile User Menu - Dropdown */}
            <div className="relative" data-menu>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center text-stone-600 hover:text-terracotta-600 transition-colors duration-300 p-1 rounded-md hover:bg-stone-50"
                aria-label={user ? "User menu" : "Login"}
              >
                {user ? (
                  user.image ? (
                    <img
                      src={user.image}
                      alt={user.name}
                      className="w-6 h-6 sm:w-7 sm:h-7 rounded-full object-cover border-2 border-stone-200"
                    />
                  ) : (
                    <div className="w-6 h-6 sm:w-7 sm:h-7 bg-stone-200 rounded-full flex items-center justify-center">
                      <User className="w-3 h-3 sm:w-4 sm:h-4 text-stone-600" />
                    </div>
                  )
                ) : (
                  <User className="w-5 h-5 sm:w-6 sm:h-6" />
                )}
              </button>

              {/* Mobile User Dropdown */}
              {isUserMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 sm:w-72 bg-white border border-stone-100 rounded-lg shadow-xl z-50 max-h-[calc(100vh-100px)] overflow-y-auto">
                  <div className="p-3 sm:p-4 space-y-1">
                    <UserMenu
                      user={user}
                      onLogout={handleLogout}
                      isMobile
                      onClose={closeUserMenu}
                      cartCount={3}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Menu */}
      <MobileMenu
        navigation={navigation}
        isOpen={isMenuOpen}
        onClose={closeMenu}
      />

      {/* Backdrop for mobile menu */}
      {isMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/20 z-30"
          onClick={closeMenu}
        />
      )}
    </header>
  );
}
