"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, Loader2 } from "lucide-react";

// Import your RTK Query hooks - adjust the import paths based on your file structure
import { useLoginArtistMutation } from "@/services/api/authApi"; // Adjust path as needed
import { useGetartistQuery } from "@/services/api/artistApi"; // Adjust path as needed

export default function ArtistLoginPage() {
  const router = useRouter();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [shouldFetchArtist, setShouldFetchArtist] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  // RTK Query mutation hook
  const [loginArtist, { isLoading, error, isSuccess, data }] =
    useLoginArtistMutation();

  // RTK Query hook to get artist data (only trigger after successful login)
  const {
    data: artistData,
    isLoading: isArtistLoading,
    error: artistError,
  } = useGetartistQuery(undefined, {
    skip: !shouldFetchArtist, // Skip the query until shouldFetchArtist is true
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

    // Basic form validation with user feedback
    if (!formData.email.trim()) {
      return;
    }
    if (!formData.password.trim()) {
      return;
    }
    if (formData.password.length < 6) {
      return;
    }

    try {
      // Send login credentials using RTK Query mutation
      const credentials = {
        email: formData.email.trim(),
        password: formData.password,
      };

      const result = await loginArtist(credentials).unwrap();

      // Trigger artist data fetch after successful login
      setShouldFetchArtist(true);
    } catch (err) {
      // Reset fetch trigger on login failure
      setShouldFetchArtist(false);
      // Error is handled by RTK Query state, no need for console logging
    }
  };

  // Handle success state change and profile progress check
  useEffect(() => {
    if (isSuccess && data && shouldFetchArtist) {
      // Wait for artist data to load before making redirection decision
      if (artistData && !isArtistLoading) {
        const profileProgress = artistData.profileProgress || 0; // Default to 0 if undefined
        const isAuthenticated = artistData.isAuthenticated || false; // Default to false if undefined

        if (isAuthenticated && profileProgress < 30) {
          // Redirect to profile creation if user is authenticated but profile is incomplete
          router.push("/Artist/MakeProfile");
        } else if (isAuthenticated && profileProgress >= 30) {
          // Redirect to dashboard if user is authenticated and profile is complete
          router.push("/Artist");
        }
        // If isAuthenticated is false, don't redirect (let user stay on login page or handle as needed)
      }
    }
  }, [isSuccess, data, artistData, isArtistLoading, router, shouldFetchArtist]);

  // Reset shouldFetchArtist if login fails
  useEffect(() => {
    if (error) {
      setShouldFetchArtist(false);
    }
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-3/5 bg-terracotta-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-terracotta-700 opacity-10"></div>
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <div className="max-w-lg">
            {/* Brand section with lines */}
            <div className="mb-10">
              <div className="flex items-center mb-6">
                <div className="w-12 h-1 bg-sage-300 mr-4"></div>
                <div className="w-6 h-1 bg-clay-300 mr-2"></div>
                <div className="w-3 h-1 bg-terracotta-300"></div>
              </div>

              <h1 className="text-5xl font-bold mb-3 leading-tight">
                AADIVAA
                <span className="font-light text-terracotta-200">EARTH</span>
              </h1>

              <div className="flex items-center mt-4">
                <div className="w-8 h-1 bg-sage-300 mr-2"></div>
                <div className="w-12 h-1 bg-clay-300 mr-2"></div>
                <div className="w-6 h-1 bg-terracotta-300"></div>
              </div>
            </div>

            <p className="text-2xl text-terracotta-100 mb-12 leading-relaxed font-light">
              Welcome to the artist portal - showcase your creative work and
              connect with art enthusiasts
            </p>

            {/* Features with enhanced design */}
            <div className="space-y-6 text-terracotta-100 mb-12">
              <div className="flex items-center group cursor-pointer">
                <div className="relative mr-4">
                  <div className="w-4 h-4 bg-sage-300 transform group-hover:scale-110 transition-all duration-300"></div>
                  <div className="absolute -top-1 -left-1 w-6 h-6 border border-sage-300 opacity-30 group-hover:opacity-60 transition-opacity"></div>
                </div>
                <span className="text-lg group-hover:text-white transition-colors">
                  Showcase your artwork
                </span>
                <div className="ml-auto w-8 h-px bg-sage-300 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>

              <div className="flex items-center group cursor-pointer">
                <div className="relative mr-4">
                  <div className="w-4 h-4 bg-clay-300 transform group-hover:scale-110 transition-all duration-300"></div>
                  <div className="absolute -top-1 -left-1 w-6 h-6 border border-clay-300 opacity-30 group-hover:opacity-60 transition-opacity"></div>
                </div>
                <span className="text-lg group-hover:text-white transition-colors">
                  Connect with buyers
                </span>
                <div className="ml-auto w-8 h-px bg-clay-300 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>

              <div className="flex items-center group cursor-pointer">
                <div className="relative mr-4">
                  <div className="w-4 h-4 bg-terracotta-300 transform group-hover:scale-110 transition-all duration-300"></div>
                  <div className="absolute -top-1 -left-1 w-6 h-6 border border-terracotta-300 opacity-30 group-hover:opacity-60 transition-opacity"></div>
                </div>
                <span className="text-lg group-hover:text-white transition-colors">
                  Manage your portfolio
                </span>
                <div className="ml-auto w-8 h-px bg-terracotta-300 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>

              <div className="flex items-center group cursor-pointer">
                <div className="relative mr-4">
                  <div className="w-4 h-4 bg-sage-400 transform group-hover:scale-110 transition-all duration-300"></div>
                  <div className="absolute -top-1 -left-1 w-6 h-6 border border-sage-400 opacity-30 group-hover:opacity-60 transition-opacity"></div>
                </div>
                <span className="text-lg group-hover:text-white transition-colors">
                  Track your sales
                </span>
                <div className="ml-auto w-8 h-px bg-sage-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            </div>

            {/* Bottom decorative lines */}
            <div className="flex items-center space-x-3">
              <div className="w-16 h-1 bg-sage-300"></div>
              <div className="w-12 h-1 bg-clay-300"></div>
              <div className="w-20 h-1 bg-terracotta-300"></div>
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-sage-500 opacity-20"></div>
        <div className="absolute top-1/4 right-8 w-16 h-16 bg-clay-400 opacity-30"></div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-md">
          <div className="bg-white py-8 px-6 shadow-sm border border-gray-200">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>
              <p className="mt-2 text-gray-600">Artist Login</p>
            </div>

            {/* Display error message if login fails */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">
                  {(() => {
                    if ("status" in error) {
                      if (error.status === 401) {
                        return "Invalid email or password. Please check your credentials and try again.";
                      }
                      if (error.status === 429) {
                        return "Too many login attempts. Please wait a few minutes before trying again.";
                      }
                      if (error.status === 500) {
                        return "Server error. Please try again later.";
                      }
                      if (error.status === "FETCH_ERROR") {
                        return "Network error. Please check your internet connection and try again.";
                      }
                      if (error.status === "TIMEOUT_ERROR") {
                        return "Request timed out. Please try again.";
                      }
                    }
                    if (
                      "data" in error &&
                      typeof error.data === "object" &&
                      error.data &&
                      "message" in error.data
                    ) {
                      return (
                        (error.data as { message?: string }).message ||
                        "Login failed. Please try again."
                      );
                    }
                    return "Login failed. Please check your credentials and try again.";
                  })()}
                </p>
              </div>
            )}

            {/* Display error message if artist data fetch fails */}
            {artistError && (
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-sm text-yellow-600">
                  {(() => {
                    if ("status" in artistError) {
                      if (artistError.status === 403) {
                        return "Access denied. Please contact support if this issue persists.";
                      }
                      if (artistError.status === 404) {
                        return "Profile not found. Please contact support.";
                      }
                      if (artistError.status === "FETCH_ERROR") {
                        return "Network error while loading profile. Please check your connection.";
                      }
                    }
                    return "Unable to fetch profile data. Please try again.";
                  })()}
                </p>
              </div>
            )}

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
                    className={`block w-full pl-10 pr-3 py-3 border placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-terracotta-500 disabled:opacity-50 disabled:cursor-not-allowed ${
                      error ? "border-red-300 bg-red-50" : "border-gray-300"
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
                    className={`block w-full pl-10 pr-10 py-3 border placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-terracotta-500 disabled:opacity-50 disabled:cursor-not-allowed ${
                      error ? "border-red-300 bg-red-50" : "border-gray-300"
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
                    className="h-4 w-4 text-terracotta-600 focus:ring-terracotta-500 border-gray-300 cursor-pointer disabled:cursor-not-allowed"
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
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isLoading || isArtistLoading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium text-white bg-terracotta-600 hover:bg-terracotta-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-terracotta-500 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                <Link
                  href="/Artist/signup"
                  className="font-medium text-terracotta-600 hover:text-terracotta-500 cursor-pointer"
                >
                  Create your artist account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
