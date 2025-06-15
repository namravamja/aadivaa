"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, Loader2, X } from "lucide-react";
import toast from "react-hot-toast";

// Import your RTK Query hooks
import { useLoginArtistMutation } from "@/services/api/authApi";
import { useGetartistQuery } from "@/services/api/artistApi";
import { useAuthModal } from "@/app/(auth)/components/auth-modal-provider";

interface ArtistLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ArtistLoginModal({
  isOpen,
  onClose,
}: ArtistLoginModalProps) {
  const router = useRouter();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [shouldFetchArtist, setShouldFetchArtist] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  // Add a ref to track if redirect has been handled
  const hasRedirected = useRef(false);

  const { openArtistSignup } = useAuthModal();

  // RTK Query mutation hook
  const [loginArtist, { isLoading, isSuccess, data }] =
    useLoginArtistMutation();

  // RTK Query hook to get artist data
  const {
    data: artistData,
    isLoading: isArtistLoading,
    error: artistError,
    refetch,
  } = useGetartistQuery(undefined, {
    skip: !shouldFetchArtist,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email.trim()) {
      toast.error("Email is required");
      return;
    }
    if (!formData.password.trim()) {
      toast.error("Password is required");
      return;
    }

    try {
      const credentials = {
        email: formData.email.trim(),
        password: formData.password,
      };

      // Reset redirect flag when starting new login attempt
      hasRedirected.current = false;

      const loadingToastId = toast.loading("Signing in...");
      const result = await loginArtist(credentials).unwrap();

      toast.dismiss(loadingToastId);
      toast.success("Login successful, Redirecting...");

      setShouldFetchArtist(true);
    } catch (err) {
      toast.dismiss();

      if ("status" in (err as any)) {
        const error = err as any;
        if (error.status === 401) {
          toast.error("Invalid email or password");
        } else if (error.status === 429) {
          toast.error("Too many login attempts. Please wait a few minutes");
        } else if (error.status === 500) {
          toast.error("Server error. Please try again later");
        } else if (error.status === "FETCH_ERROR") {
          toast.error("Network error. Please check your connection");
        } else if (error.status === "TIMEOUT_ERROR") {
          toast.error("Request timed out. Please try again");
        } else {
          toast.error("Login failed. Please try again");
        }
      } else {
        toast.error("Login failed. Please try again");
      }

      setShouldFetchArtist(false);
    }
  };

  // Handle success state change and profile progress check
  useEffect(() => {
    // Only proceed if login was successful, we should fetch artist data, and haven't redirected yet
    if (isSuccess && data && shouldFetchArtist && !hasRedirected.current) {
      refetch();

      // Only handle redirect if we have artist data and it's not loading
      if (artistData && !isArtistLoading) {
        const profileProgress = artistData.profileProgress || 0;
        const isAuthenticated = artistData.isAuthenticated || false;

        if (isAuthenticated) {
          // Set flag to prevent multiple redirects
          hasRedirected.current = true;

          if (profileProgress < 50) {
            onClose();
            router.push("/Artist/MakeProfile");
          } else {
            onClose();
            router.push("/Artist");
          }
        }
      }
    }
  }, [
    isSuccess,
    data,
    artistData,
    isArtistLoading,
    router,
    shouldFetchArtist,
    onClose,
  ]);

  useEffect(() => {
    if (artistError) {
      if ("status" in artistError) {
        if (artistError.status === 403) {
          toast.error("Access denied. Please contact support");
        } else if (artistError.status === 404) {
          toast.error("Profile not found. Please contact support");
        } else if (artistError.status === "FETCH_ERROR") {
          toast.error("Network error while loading profile");
        } else {
          toast.error("Unable to fetch profile data");
        }
      }
      setShouldFetchArtist(false);
    }
  }, [artistError]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        email: "",
        password: "",
        rememberMe: false,
      });
      setIsPasswordVisible(false);
      setShouldFetchArtist(false);
      // Reset redirect flag when modal closes
      hasRedirected.current = false;
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10 p-1 rounded-full hover:bg-gray-100"
        >
          <X className="h-5 w-5 cursor-pointer" />
        </button>

        <div className="p-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>
            <p className="mt-2 text-gray-600">Artist Login</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading || isArtistLoading}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-terracotta-500 disabled:opacity-50 disabled:cursor-not-allowed ${
                    artistError ? "border-red-300 bg-red-50" : "border-gray-300"
                  }`}
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={isPasswordVisible ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading || isArtistLoading}
                  className={`block w-full pl-10 pr-10 py-3 border rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-terracotta-500 disabled:opacity-50 disabled:cursor-not-allowed ${
                    artistError ? "border-red-300 bg-red-50" : "border-gray-300"
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                  disabled={isLoading || isArtistLoading}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer disabled:cursor-not-allowed"
                >
                  {isPasswordVisible ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember me and Forgot password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  disabled={isLoading || isArtistLoading}
                  className="h-4 w-4 text-terracotta-600 focus:ring-terracotta-500 border-gray-300 rounded cursor-pointer disabled:cursor-not-allowed"
                />
                <label
                  htmlFor="rememberMe"
                  className="ml-2 block text-sm text-gray-700 cursor-pointer"
                >
                  Remember me
                </label>
              </div>
              <Link
                href="/forgot-password"
                className="text-sm text-terracotta-600 hover:text-terracotta-500 font-medium cursor-pointer"
                onClick={onClose}
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading || isArtistLoading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-terracotta-600 hover:bg-terracotta-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-terracotta-500 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : isArtistLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading profile...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  New to AADIVAEARTH?
                </span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  onClose();
                  openArtistSignup();
                }}
                className="font-medium text-terracotta-600 hover:text-terracotta-500 cursor-pointer"
              >
                Create your artist account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
