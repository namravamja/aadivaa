"use client";

import { useState, useEffect } from "react";
import { Menu, X, User } from "lucide-react";
import Logo from "../Navbar/components/Logo";
import DesktopNavigation from "../Navbar/components/DesktopNavigation";
import ActionButtons from "../Navbar/components/ActionButtons";
import UserMenu from "../Navbar/components/UserMenu";
import MobileMenu from "../Navbar/components/MobileMenu";
import type { NavigationItem } from "../Navbar/components/types";
import { ProfilePhoto } from "../Navbar/components/UserMenu";
import { useAuth } from "@/hooks/useAuth";
import { useAuthModal } from "@/app/(auth)/components/auth-modal-provider";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const { openArtistLogin, openArtistSignup, openBuyerSignup } = useAuthModal();

  const navigation: NavigationItem[] = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/Products" },
    { name: "Artists", href: "/Artists" },
    {
      name: "Become Seller",
      children: [
        { name: "How to be a seller?", href: "/HowTo" },
        { name: "Go to profile", href: "", onClick: openArtistLogin },
        { name: "Build a profile", href: "", onClick: openArtistSignup },
      ],
      href: "",
    },
    { name: "Join Aadivaa", href: "", onClick: openBuyerSignup },
    { name: "About", href: "/About" },
  ];

  const closeMenu = () => setIsMenuOpen(false);
  const closeUserMenu = () => setIsUserMenuOpen(false);

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

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  return (
    <header className="bg-white/95 backdrop-blur-sm fixed top-0 left-0 right-0 z-40 shadow-md border-b border-stone-100">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-10">
        <div className="flex items-center justify-between h-16 sm:h-18 md:h-20 lg:h-16 xl:h-20">
          <div className="flex-shrink-0">
            <Logo />
          </div>

          <div className="flex-1 flex justify-center">
            <DesktopNavigation navigation={navigation} />
          </div>

          <div className="hidden lg:flex items-center space-x-2 xl:space-x-4">
            <ActionButtons />
            <div className="flex items-center gap-2 cursor-pointer min-w-[170px]">
              <UserMenu />
            </div>
          </div>

          <div className="hidden md:flex lg:hidden items-center space-x-3">
            <ActionButtons />

            <div
              className="relative flex items-center gap-2 min-w-[44px]"
              data-menu
            >
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="text-stone-600 hover:text-terracotta-600 transition-colors duration-300 p-1 rounded-md hover:bg-stone-50"
                aria-label="User menu"
              >
                <User className="w-5 h-5" />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-stone-100 rounded-lg shadow-xl z-50 max-h-[calc(100vh-100px)] overflow-y-auto">
                  <div className="p-3 space-y-1">
                    <UserMenu isMobile onClose={closeUserMenu} />
                  </div>
                </div>
              )}
            </div>

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

          <div className="md:hidden flex items-center space-x-2 sm:space-x-3">
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

            <div
              className="relative flex items-center gap-2 min-w-[44px]"
              data-menu
            >
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="text-stone-600 hover:text-terracotta-600 transition-colors duration-300 p-1 rounded-md hover:bg-stone-50"
                aria-label="User menu"
              >
                {isAuthenticated ? (
                  <ProfilePhoto className="w-6 h-6 rounded-full border border-stone-300" />
                ) : (
                  <User className="w-5 h-5 sm:w-6 sm:h-6" />
                )}
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 sm:w-72 bg-white border border-stone-100 rounded-lg shadow-xl z-50 max-h-[calc(100vh-100px)] overflow-y-auto">
                  <div className="p-3 sm:p-4 space-y-1">
                    <UserMenu isMobile onClose={closeUserMenu} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <MobileMenu
        navigation={navigation}
        isOpen={isMenuOpen}
        onClose={closeMenu}
      />

      {isMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/20 z-30"
          onClick={closeMenu}
        />
      )}
    </header>
  );
}
