"use client";

import Link from "next/link";
import {
  User,
  LogOut,
  UserCircle,
  Package,
  Truck,
  ShoppingBag,
  Heart,
} from "lucide-react";
import { User as UserType } from "./types";

interface UserMenuProps {
  user: UserType | null;
  onLogout: () => void;
  isMobile?: boolean;
  onClose?: () => void;
  cartCount?: number;
}

const userMenuItems = [
  { name: "Profile", href: "/Buyer/Profile", icon: UserCircle },
  { name: "Orders", href: "/Buyer/Orders", icon: Package },
  { name: "Track Order", href: "/Buyer/TrackOrder", icon: Truck },
];

const mobileActionItems = [
  { name: "Cart", href: "/Buyer/Cart", icon: ShoppingBag, showBadge: true },
  { name: "Wishlist", href: "/Buyer/Wishlist", icon: Heart },
];

export default function UserMenu({
  user,
  onLogout,
  isMobile = false,
  onClose,
  cartCount = 3,
}: UserMenuProps) {
  const handleLogout = () => {
    onLogout();
    onClose?.();
  };

  if (isMobile) {
    if (!user) {
      return (
        <Link
          href="/Buyer/login"
          className="text-stone-900 text-base sm:text-lg md:text-xl font-light flex items-center gap-3 hover:text-terracotta-600 transition-colors duration-300 p-3 hover:bg-stone-50 rounded-lg"
          onClick={onClose}
        >
          <User className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 flex-shrink-0" />
          <span>Login</span>
        </Link>
      );
    }

    return (
      <>
        <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-lg">
          {user.image ? (
            <img
              src={user.image}
              alt={user.name}
              className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full object-cover border-2 border-stone-200 flex-shrink-0"
            />
          ) : (
            <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-stone-200 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 sm:w-5 sm:h-5 text-stone-600" />
            </div>
          )}
          <span className="text-stone-900 font-medium text-sm sm:text-base md:text-lg truncate">
            {user.name}
          </span>
        </div>

        {userMenuItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className="text-stone-900 text-base sm:text-lg md:text-xl font-light flex items-center gap-3 hover:text-terracotta-600 transition-colors duration-300 p-3 hover:bg-stone-50 rounded-lg"
              onClick={onClose}
            >
              <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 flex-shrink-0" />
              <span>{item.name}</span>
            </Link>
          );
        })}

        {/* Mobile Action Items (Cart, Wishlist) */}
        {mobileActionItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className="text-stone-900 text-base sm:text-lg md:text-xl font-light flex items-center gap-3 hover:text-terracotta-600 transition-colors duration-300 p-3 hover:bg-stone-50 rounded-lg relative"
              onClick={onClose}
            >
              <div className="relative flex-shrink-0">
                <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                {item.showBadge && cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-terracotta-600 text-white text-[9px] sm:text-[10px] w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center rounded-full font-medium shadow-sm">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </div>
              <span>{item.name}</span>
            </Link>
          );
        })}

        <button
          onClick={handleLogout}
          className="text-stone-900 text-base sm:text-lg md:text-xl font-light flex items-center gap-3 hover:text-terracotta-600 transition-colors duration-300 p-3 hover:bg-stone-50 rounded-lg w-full text-left"
        >
          <LogOut className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 flex-shrink-0" />
          <span>Logout</span>
        </button>
      </>
    );
  }

  // Desktop version
  if (!user) {
    return (
      <div className="relative group">
        <Link
          href="/Buyer/login"
          className="text-stone-600 hover:text-terracotta-600 transition-colors duration-300 p-1 rounded-md hover:bg-stone-50"
          aria-label="Login"
        >
          <User className="w-4 h-4 lg:w-5 lg:h-5" />
        </Link>
        <div className="absolute right-0 mt-2 px-3 py-1 bg-stone-800 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 whitespace-nowrap z-50">
          Login
          <div className="absolute -top-1 right-3 w-2 h-2 bg-stone-800 rotate-45"></div>
        </div>
      </div>
    );
  }

  // Logged in user - hover dropdown
  return (
    <div className="relative group py-2">
      <div className="flex items-center cursor-pointer p-1 rounded-md hover:bg-stone-50 transition-colors duration-300">
        {user.image ? (
          <img
            src={user.image}
            alt={user.name}
            className="w-7 h-7 lg:w-8 lg:h-8 rounded-full object-cover border-2 border-stone-200 group-hover:border-terracotta-600 transition-colors duration-300"
          />
        ) : (
          <div className="w-7 h-7 lg:w-8 lg:h-8 bg-stone-200 rounded-full flex items-center justify-center group-hover:bg-terracotta-100 transition-colors duration-300">
            <User className="w-3 h-3 lg:w-4 lg:h-4 text-stone-600" />
          </div>
        )}
      </div>

      {/* Hover dropdown menu */}
      <div className="absolute right-0 mt-2 w-48 lg:w-52 bg-white border border-stone-100 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right scale-95 group-hover:scale-100 z-50">
        {userMenuItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center px-4 py-3 text-xs lg:text-sm text-stone-700 hover:bg-stone-50 hover:text-terracotta-600 transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg"
            >
              <IconComponent className="w-4 h-4 mr-3 flex-shrink-0" />
              {item.name}
            </Link>
          );
        })}
        <button
          onClick={handleLogout}
          className="flex items-center w-full text-left px-4 py-3 text-xs lg:text-sm text-stone-700 hover:bg-stone-50 hover:text-terracotta-600 transition-colors duration-200 rounded-b-lg"
        >
          <LogOut className="w-4 h-4 mr-3 flex-shrink-0" />
          Logout
        </button>
      </div>
    </div>
  );
}
