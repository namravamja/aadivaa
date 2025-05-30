"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { NavigationItem } from "./types";

interface DesktopNavigationProps {
  navigation: NavigationItem[];
}

export default function DesktopNavigation({
  navigation,
}: DesktopNavigationProps) {
  const pathname = usePathname();

  return (
    <nav className="hidden lg:flex items-center space-x-3 xl:space-x-6 2xl:space-x-8">
      {navigation.map((item) =>
        !item.children ? (
          <Link
            key={item.name}
            href={item.href}
            className={`text-xs xl:text-sm font-medium relative py-2 px-1 rounded-md transition-all duration-300 ${
              pathname === item.href
                ? "text-terracotta-600"
                : "text-stone-600 hover:text-terracotta-600 hover:bg-stone-50"
            } ${
              pathname === item.href
                ? "after:absolute after:bottom-[-2px] after:left-1/2 after:transform after:-translate-x-1/2 after:w-1/2 after:h-0.5 after:bg-terracotta-600"
                : ""
            }`}
          >
            {item.name}
          </Link>
        ) : (
          <div key={item.name} className="relative group py-2">
            <div className="flex items-center gap-1 cursor-pointer px-1 rounded-md hover:bg-stone-50 transition-colors duration-300">
              <span className="text-xs xl:text-sm font-medium text-stone-600 group-hover:text-stone-900 transition-colors duration-300">
                {item.name}
              </span>
              <ChevronDown className="w-3 h-3 xl:w-4 xl:h-4 text-stone-600 group-hover:text-stone-900 transition-all duration-300 group-hover:rotate-180" />
            </div>
            <div className="absolute left-0 mt-2 w-48 xl:w-52 bg-white border border-stone-100 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top scale-95 group-hover:scale-100 z-50">
              {item.children.map((child) => (
                <Link
                  key={child.name}
                  href={child.href}
                  className={`block px-4 py-3 text-xs xl:text-sm text-stone-700 hover:bg-stone-50 hover:text-terracotta-600 transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg ${
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
  );
}
