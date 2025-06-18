"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import type { NavigationItem } from "./types";

interface MobileMenuProps {
  navigation: NavigationItem[];
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({
  navigation,
  isOpen,
  onClose,
}: MobileMenuProps) {
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const pathname = usePathname();

  const toggleSubmenu = (name: string) => {
    setOpenSubmenu(openSubmenu === name ? null : name);
  };

  const handleItemClick = (item: NavigationItem, e: React.MouseEvent) => {
    if (item.onClick) {
      e.preventDefault();
      item.onClick();
      onClose();
    }
  };

  return (
    <div
      className={`lg:hidden fixed inset-x-0 top-16 sm:top-18 md:top-20 h-[calc(100vh-4rem)] sm:h-[calc(100vh-4.5rem)] md:h-[calc(100vh-5rem)] bg-white shadow-lg border-t border-stone-100 transform transition-all duration-300 ease-in-out ${
        isOpen
          ? "translate-y-0 opacity-100"
          : "translate-y-[-8px] opacity-0 pointer-events-none"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 md:px-8 py-6 h-full overflow-auto">
        <nav className="flex flex-col space-y-4 md:space-y-5">
          {navigation.map((item) =>
            !item.children ? (
              item.onClick ? (
                <button
                  key={item.name}
                  onClick={(e) => handleItemClick(item, e)}
                  className="cursor-pointer text-lg sm:text-xl md:text-2xl font-light py-2 px-3 rounded-md text-left text-stone-900 hover:text-terracotta-600 hover:bg-stone-50 transition-colors duration-300"
                >
                  {item.name}
                </button>
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className={`cursor-pointer text-lg sm:text-xl md:text-2xl font-light py-2 px-3 rounded-md transition-all duration-300 ${
                    pathname === item.href
                      ? "text-terracotta-600 bg-terracotta-50 border-l-4 border-terracotta-600"
                      : "text-stone-900 hover:text-terracotta-600 hover:bg-stone-50"
                  }`}
                >
                  {item.name}
                </Link>
              )
            ) : (
              <div key={item.name} className="flex flex-col">
                <button
                  onClick={() => toggleSubmenu(item.name)}
                  className="cursor-pointer flex items-center justify-between text-lg sm:text-xl md:text-2xl font-light text-stone-900 w-full text-left py-2 px-3 rounded-md hover:bg-stone-50 transition-colors duration-300"
                  aria-expanded={openSubmenu === item.name}
                >
                  <span>{item.name}</span>
                  <ChevronDown
                    className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-stone-900 transition-transform duration-300 ${
                      openSubmenu === item.name ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openSubmenu === item.name
                      ? "max-h-60 opacity-100 mt-2"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="ml-4 pl-4 flex flex-col space-y-2 border-l-2 border-stone-200">
                    {item.children.map((child) =>
                      child.onClick ? (
                        <button
                          key={child.name}
                          onClick={(e) => handleItemClick(child, e)}
                          className={`cursor-pointer text-base sm:text-lg md:text-xl py-2 px-3 rounded-md text-left w-full transition-colors duration-300 ${
                            pathname === child.href
                              ? "text-terracotta-600 bg-terracotta-50"
                              : "text-stone-700 hover:text-terracotta-600 hover:bg-stone-50"
                          }`}
                        >
                          {child.name}
                        </button>
                      ) : (
                        <Link
                          key={child.name}
                          href={child.href}
                          onClick={onClose}
                          className={`cursor-pointer text-base sm:text-lg md:text-xl py-2 px-3 rounded-md transition-colors duration-300 ${
                            pathname === child.href
                              ? "text-terracotta-600 bg-terracotta-50"
                              : "text-stone-700 hover:text-terracotta-600 hover:bg-stone-50"
                          }`}
                        >
                          {child.name}
                        </Link>
                      )
                    )}
                  </div>
                </div>
              </div>
            )
          )}
        </nav>
      </div>
    </div>
  );
}
