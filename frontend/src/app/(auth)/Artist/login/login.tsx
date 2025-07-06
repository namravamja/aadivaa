"use client";

import type React from "react";
import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, Loader2, X } from "lucide-react";
import toast from "react-hot-toast";

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

  const hasRedirected = useRef(false);
  const { openArtistSignup, openForgotPassword } = useAuthModal();

  const [loginArtist, { isLoading, isSuccess, data }] =
    useLoginArtistMutation();

  const {
    data: artistResponse,
    isLoading: isArtistLoading,
    refetch,
  } = useGetartistQuery(undefined, {
    skip: !shouldFetchArtist,
  });

  // Extract artist data from cache response (same as profile page)
  const artistData = useMemo(() => {
    if (!artistResponse) return null;

    // Handle new cache format: {source: 'cache'|'db', data: {...}}
    if (
      artistResponse &&
      typeof artistResponse === "object" &&
      "data" in artistResponse
    ) {
      return artistResponse.data;
    }

    // Handle old direct format
    return artistResponse;
  }, [artistResponse]);

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

    const credentials = {
      email: formData.email.trim(),
      password: formData.password,
    };

    try {
      const result = await loginArtist(credentials).unwrap();

      toast.success("Login successful, Redirecting...");
      setShouldFetchArtist(true);
    } catch (error: any) {
      const errorMessage =
        error?.data?.message ||
        error?.message ||
        "Login failed. Please try again";
      toast.error(errorMessage);
      setShouldFetchArtist(false);
    }
  };

  // Handle success state change and profile progress check
  useEffect(() => {
    if (isSuccess && data && shouldFetchArtist && !hasRedirected.current) {
      refetch();

      if (artistData && !isArtistLoading) {
        const profileProgress = artistData.profileProgress || 0;
        const isAuthenticated = artistData.isAuthenticated || false;

        if (isAuthenticated) {
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
    refetch,
  ]);

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
      hasRedirected.current = false;
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute cursor-pointer top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10 p-1 rounded-full hover:bg-gray-100"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl mt-5 font-bold text-gray-900">
              Welcome back, Artist
            </h2>
            <p className="mt-3 text-gray-600 text-sm">
              Hope Your Doing Great with Aadivaa..
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
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
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-terracotta-500 disabled:opacity-50"
                  placeholder="Enter your email"
                />
              </div>
            </div>

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
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-terracotta-500 disabled:opacity-50"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                  disabled={isLoading || isArtistLoading}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {isPasswordVisible ? (
                    <EyeOff className="h-5 w-5 cursor-pointer" />
                  ) : (
                    <Eye className="h-5 w-5 cursor-pointer" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  disabled={isLoading || isArtistLoading}
                  className="h-4 w-4 text-terracotta-600 focus:ring-terracotta-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="rememberMe"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Remember me
                </label>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose(); // Close current modal
                  openForgotPassword("artist"); // Open forgot password modal for artist
                }}
                className="text-sm text-terracotta-600 hover:text-terracotta-500 font-medium cursor-pointer"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading || isArtistLoading}
              className="w-full flex cursor-pointer justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-terracotta-600 hover:bg-terracotta-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-terracotta-500 transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : isArtistLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
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
                className="font-medium cursor-pointer text-terracotta-600 hover:text-terracotta-500"
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
