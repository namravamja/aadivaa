"use client";

import type React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  User,
  LogOut,
  UserCircle,
  Package,
  Truck,
  ShoppingBag,
  Heart,
  type LucideIcon,
} from "lucide-react";
import { useGetBuyerQuery } from "@/services/api/buyerApi";
import { useLogoutMutation } from "@/services/api/authApi";
import { useGetCartQuery } from "@/services/api/cartApi";
import { useGetWishlistQuery } from "@/services/api/wishlistApi";
import { useAuthModal } from "@/app/(auth)/components/auth-modal-provider";

interface UserMenuProps {
  isMobile?: boolean;
  onClose?: () => void;
}

interface ProfilePhotoProps {
  className?: string;
}

interface MenuItem {
  name: string;
  href: string;
  icon: LucideIcon;
}

interface ActionMenuItem extends MenuItem {
  showBadge?: boolean;
}

interface BuyerData {
  firstName?: string;
  avatar?: string;
  fullName?: string;
  [key: string]: any;
}

interface User {
  name: string;
  image: string;
  fullName?: string;
}

const userMenuItems: MenuItem[] = [
  { name: "Profile", href: "/Buyer/Profile", icon: UserCircle },
  { name: "Orders", href: "/Buyer/Orders", icon: Package },
  { name: "Track Order", href: "/Buyer/TrackOrder", icon: Truck },
];

const mobileActionItems: ActionMenuItem[] = [
  { name: "Cart", href: "/Buyer/Cart", icon: ShoppingBag, showBadge: true },
  { name: "Wishlist", href: "/Buyer/Wishlist", icon: Heart },
];

export function ProfilePhoto({ className = "w-8 h-8" }: ProfilePhotoProps) {
  const { data: buyerData, isLoading, isError } = useGetBuyerQuery(undefined);
  const [hasTriedAuth, setHasTriedAuth] = useState(false);

  useEffect(() => {
    if (isError || buyerData) setHasTriedAuth(true);
  }, [isError, buyerData]);

  const isAuthenticated = !isError && !!buyerData && hasTriedAuth;

  const user =
    isAuthenticated && buyerData
      ? {
          name: buyerData.firstName || "User",
          image: buyerData.avatar || "/Profile.jpg",
        }
      : null;

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    e.currentTarget.style.display = "none";
  };

  if (!isAuthenticated) return null;

  return user?.image ? (
    <img
      src={user.image}
      alt={user.name}
      className={`${className} rounded-full object-cover border-2 border-stone-200 cursor-pointer`}
      onError={handleImageError}
    />
  ) : (
    <div
      className={`${className} bg-stone-200 rounded-full flex items-center justify-center cursor-pointer`}
    >
      <User className="w-4 h-4 text-stone-600" />
    </div>
  );
}

export default function UserMenu({ isMobile = false, onClose }: UserMenuProps) {
  const router = useRouter();
  const [hasTriedAuth, setHasTriedAuth] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { openBuyerLogin } = useAuthModal();

  const {
    data: buyerData,
    isLoading,
    isError,
    refetch,
  } = useGetBuyerQuery(undefined);

  const isAuthenticated = !isError && !!buyerData && hasTriedAuth;

  const { data: cartData, isLoading: cartLoading } = useGetCartQuery(
    undefined,
    {
      skip: !isAuthenticated,
      refetchOnFocus: true,
      refetchOnReconnect: true,
    }
  );

  const { data: wishlistData, isLoading: wishlistLoading } =
    useGetWishlistQuery(undefined, {
      skip: !isAuthenticated,
      refetchOnFocus: true,
      refetchOnReconnect: true,
    });

  const [logout] = useLogoutMutation();

  useEffect(() => {
    if (isError || buyerData) setHasTriedAuth(true);
  }, [isError, buyerData]);

  const user: User | null =
    isAuthenticated && buyerData
      ? {
          name: buyerData.firstName || "User",
          image: buyerData.avatar || "/Profile.jpg",
          fullName: buyerData.fullName || buyerData.firstName,
        }
      : null;

  const cartItems = cartData || [];
  const wishlistItems = wishlistData || [];

  const actualCartCount = cartItems.reduce(
    (total: number, item: any) => total + item.quantity,
    0
  );
  const actualWishlistCount = wishlistItems.length;

  const handleBuyerLogin = () => {
    openBuyerLogin();
    if (onClose) onClose();
  };

  const handleLogout = () => {
    if (showLogoutConfirm) {
      performLogout();
    } else {
      setShowLogoutConfirm(true);
      toast("Click logout again to confirm", { icon: "⚠️", duration: 3000 });
      setTimeout(() => setShowLogoutConfirm(false), 3000);
    }
  };

  const performLogout = async () => {
    setIsLoggingOut(true);
    const loadingToastId = toast.loading("Logging out...");

    try {
      await logout({}).unwrap();
      toast.dismiss(loadingToastId);
      toast.success("Successfully logged out!", { duration: 2000 });
      if (onClose) onClose();
      router.replace("/");
      refetch();
    } catch (err: any) {
      toast.dismiss(loadingToastId);
      toast.error(
        err?.data?.message ||
          err?.message ||
          "Failed to logout. Please try again.",
        { duration: 4000 }
      );
    } finally {
      setIsLoggingOut(false);
      setShowLogoutConfirm(false);
    }
  };

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    e.currentTarget.style.display = "none";
  };

  if (isLoading && !hasTriedAuth) {
    return (
      <div className="flex items-center justify-center p-3">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-terracotta-600"></div>
      </div>
    );
  }

  if (isMobile) {
    if (!isAuthenticated) {
      return (
        <button
          onClick={handleBuyerLogin}
          className="text-stone-900 text-lg font-light flex items-center gap-4 hover:text-terracotta-600 transition-colors p-4 hover:bg-stone-50 rounded-lg w-full text-left cursor-pointer"
        >
          <User className="w-6 h-6" />
          <span>Login</span>
        </button>
      );
    }

    return (
      <>
        <div className="px-4 py-3 text-lg font-medium text-stone-800 cursor-default">
          Hello, {user?.fullName || "User"}
        </div>
        {userMenuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className="text-stone-900 text-lg font-light flex items-center gap-4 hover:text-terracotta-600 transition-colors p-4 hover:bg-stone-50 rounded-lg cursor-pointer"
              onClick={onClose}
            >
              <Icon className="w-6 h-6" />
              <span>{item.name}</span>
            </Link>
          );
        })}
        {mobileActionItems.map((item) => {
          const Icon = item.icon;
          const badgeCount =
            item.name === "Cart"
              ? actualCartCount
              : item.name === "Wishlist"
              ? actualWishlistCount
              : 0;
          const isLoadingCount =
            item.name === "Cart" ? cartLoading : wishlistLoading;

          return (
            <Link
              key={item.name}
              href={item.href}
              className="text-stone-900 text-lg font-light flex items-center gap-4 hover:text-terracotta-600 transition-colors p-4 hover:bg-stone-50 rounded-lg relative cursor-pointer"
              onClick={onClose}
            >
              <div className="relative">
                <Icon className="w-6 h-6" />
                {item.showBadge && !isLoadingCount && badgeCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-terracotta-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-medium shadow-sm">
                    {badgeCount > 99 ? "99+" : badgeCount}
                  </span>
                )}
              </div>
              <span>{item.name}</span>
            </Link>
          );
        })}
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className={`text-stone-900 text-lg font-light flex items-center gap-4 hover:text-terracotta-600 transition-colors p-4 hover:bg-stone-50 rounded-lg w-full text-left cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
            showLogoutConfirm ? "bg-red-50 border border-red-200" : ""
          }`}
        >
          <LogOut className="w-6 h-6" />
          <span>{showLogoutConfirm ? "Click again to confirm" : "Logout"}</span>
        </button>
      </>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="relative group">
        <div className="flex items-center gap-2 cursor-pointer">
          <span className="text-sm text-stone-600 hidden lg:inline">
            My Account
          </span>
          <div className="text-stone-600 hover:text-terracotta-600 transition-colors p-1 rounded-md hover:bg-stone-50 cursor-pointer">
            <User className="w-5 h-5" />
          </div>
        </div>
        <div className="absolute right-0 mt-2 w-32 bg-white border border-stone-100 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right scale-95 group-hover:scale-100 z-50">
          <button
            onClick={handleBuyerLogin}
            className="flex items-center justify-center px-4 py-3 text-sm text-stone-700 hover:bg-stone-50 hover:text-terracotta-600 w-full font-medium cursor-pointer"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative group py-2">
      <div className="flex items-center cursor-pointer p-1 rounded-md hover:bg-stone-50 transition-colors gap-2">
        <span className="text-sm text-stone-600 hidden lg:inline">
          {user?.name}'s Account
        </span>
        {user?.image ? (
          <img
            src={user.image}
            alt={user.name}
            className="w-8 h-8 rounded-full object-cover border-2 border-stone-200 group-hover:border-terracotta-600 transition cursor-pointer"
            onError={handleImageError}
          />
        ) : (
          <div className="w-8 h-8 bg-stone-200 rounded-full flex items-center justify-center group-hover:bg-terracotta-100 transition cursor-pointer">
            <User className="w-4 h-4 text-stone-600" />
          </div>
        )}
      </div>
      <div className="absolute right-0 mt-2 w-52 bg-white border border-stone-100 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform scale-95 group-hover:scale-100 z-50">
        {userMenuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center px-4 py-3 text-sm text-stone-700 hover:bg-stone-50 hover:text-terracotta-600 transition-colors first:rounded-t-lg last:rounded-b-lg cursor-pointer"
            >
              <Icon className="w-4 h-4 mr-3" />
              {item.name}
            </Link>
          );
        })}
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className={`flex items-center w-full px-4 py-3 text-sm text-stone-700 hover:bg-stone-50 hover:text-terracotta-600 transition-colors rounded-b-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${
            showLogoutConfirm ? "bg-red-50 text-red-700" : ""
          }`}
        >
          <LogOut className="w-4 h-4 mr-3" />
          {showLogoutConfirm ? "Click again to confirm" : "Logout"}
        </button>
      </div>
    </div>
  );
}
