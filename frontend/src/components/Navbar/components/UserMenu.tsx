"use client";

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
  LucideIcon,
} from "lucide-react";
import { useGetBuyerQuery } from "@/services/api/buyerApi";
import { useLogoutMutation } from "@/services/api/authApi";

// Types
interface UserMenuProps {
  isMobile?: boolean;
  onClose?: () => void;
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
  [key: string]: any;
}

interface User {
  name: string;
  image: string;
}

interface ApiError {
  status?: number;
  data?: any;
  [key: string]: any;
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

export default function UserMenu({ isMobile = false, onClose }: UserMenuProps) {
  const router = useRouter();
  const [cartCount, setCartCount] = useState<number>(3);
  const [hasTriedAuth, setHasTriedAuth] = useState<boolean>(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState<boolean>(false);
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);

  // Fetch buyer data - RTK Query will handle error states automatically
  const {
    data: buyerData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetBuyerQuery(undefined);

  // Handle logout mutation
  const [logout] = useLogoutMutation();

  // Track when we've tried authentication
  useEffect(() => {
    if (isError || buyerData) {
      setHasTriedAuth(true);
    }
  }, [isError, buyerData]);

  // Determine authentication state
  const isAuthenticated: boolean = !isError && !!buyerData && hasTriedAuth;
  const apiError = error as ApiError | undefined;

  console.log("Auth status:", {
    isAuthenticated,
    hasTriedAuth,
    errorStatus: apiError?.status,
  });

  // Extract user data from RTK query response
  const user: User | null =
    isAuthenticated && buyerData
      ? {
          name: (buyerData as BuyerData).firstName || "User",
          image: (buyerData as BuyerData).avatar || "/Profile.jpg",
        }
      : null;

  const handleLogout = (): void => {
    if (showLogoutConfirm) {
      // Second click - proceed with logout
      performLogout();
    } else {
      // First click - show confirmation
      setShowLogoutConfirm(true);
      toast("Click logout again to confirm", {
        icon: "⚠️",
        duration: 3000,
      });

      // Reset confirmation after 3 seconds
      setTimeout(() => {
        setShowLogoutConfirm(false);
      }, 3000);
    }
  };

  const performLogout = async (): Promise<void> => {
    setIsLoggingOut(true);

    // Show loading toast
    const loadingToastId = toast.loading("Logging out...");

    try {
      await logout({}).unwrap();

      // Dismiss loading toast
      toast.dismiss(loadingToastId);

      // Show success toast
      toast.success("Successfully logged out!", {
        duration: 2000,
      });

      // Close mobile menu if open
      if (onClose) {
        onClose();
      }

      // Redirect using Next.js router after a short delay
      setTimeout(() => {
        router.push("/");
        // window.location.reload();
      }, 600);

      refetch();
    } catch (err: any) {
      console.error("Logout failed:", err);

      // Dismiss loading toast
      toast.dismiss(loadingToastId);

      // Show error toast
      const errorMessage =
        err?.data?.message ||
        err?.message ||
        "Failed to logout. Please try again.";
      toast.error(errorMessage, {
        duration: 4000,
      });
    } finally {
      setIsLoggingOut(false);
      setShowLogoutConfirm(false);
    }
  };

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ): void => {
    const target = e.currentTarget;
    target.style.display = "none";
  };

  // Show loading only on initial load, not on 401 errors
  if (isLoading && !hasTriedAuth) {
    return (
      <div className="flex items-center justify-center p-3">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-terracotta-600"></div>
      </div>
    );
  }

  if (isMobile) {
    // Show login if not authenticated or got 401
    if (!isAuthenticated) {
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
          {user?.image ? (
            <img
              src={user.image}
              alt={user.name}
              className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full object-cover border-2 border-stone-200 flex-shrink-0"
              onError={handleImageError}
            />
          ) : (
            <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-stone-200 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 sm:w-5 sm:h-5 text-stone-600" />
            </div>
          )}
          <span className="text-stone-900 font-medium text-sm sm:text-base md:text-lg truncate">
            {user?.name || "User"}
          </span>
        </div>

        {userMenuItems.map((item: MenuItem) => {
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

        {mobileActionItems.map((item: ActionMenuItem) => {
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
          disabled={isLoggingOut}
          className={`text-stone-900 text-base sm:text-lg md:text-xl font-light flex items-center gap-3 hover:text-terracotta-600 transition-colors duration-300 p-3 hover:bg-stone-50 rounded-lg w-full text-left cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
            showLogoutConfirm ? "bg-red-50 border border-red-200" : ""
          }`}
          type="button"
        >
          <LogOut className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 flex-shrink-0" />
          <span>{showLogoutConfirm ? "Click again to confirm" : "Logout"}</span>
        </button>
      </>
    );
  }

  // Desktop version
  if (!isAuthenticated) {
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
        {user?.image ? (
          <img
            src={user.image}
            alt={user.name}
            className="w-7 h-7 lg:w-8 lg:h-8 rounded-full object-cover border-2 border-stone-200 group-hover:border-terracotta-600 transition-colors duration-300"
            onError={handleImageError}
          />
        ) : (
          <div className="w-7 h-7 lg:w-8 lg:h-8 bg-stone-200 rounded-full flex items-center justify-center group-hover:bg-terracotta-100 transition-colors duration-300">
            <User className="w-3 h-3 lg:w-4 lg:h-4 text-stone-600" />
          </div>
        )}
      </div>

      {/* Hover dropdown menu */}
      <div className="absolute right-0 mt-2 w-48 lg:w-52 bg-white border border-stone-100 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right scale-95 group-hover:scale-100 z-50">
        {userMenuItems.map((item: MenuItem) => {
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
          disabled={isLoggingOut}
          className={`flex items-center cursor-pointer w-full text-left px-4 py-3 text-xs lg:text-sm text-stone-700 hover:bg-stone-50 hover:text-terracotta-600 transition-colors duration-200 rounded-b-lg disabled:opacity-50 disabled:cursor-not-allowed ${
            showLogoutConfirm ? "bg-red-50 text-red-700" : ""
          }`}
          type="button"
        >
          <LogOut className="w-4 h-4 mr-3 flex-shrink-0" />
          {showLogoutConfirm ? "Click again to confirm" : "Logout"}
        </button>
      </div>
    </div>
  );
}
