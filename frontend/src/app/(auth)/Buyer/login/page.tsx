"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useLoginBuyerMutation } from "@/services/api/authApi";
import { useGetBuyerQuery } from "@/services/api/buyerApi";

export default function LoginPage() {
  const router = useRouter();
  const [loginBuyer, { isLoading, error }] = useLoginBuyerMutation();
  const { refetch } = useGetBuyerQuery(undefined);

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await loginBuyer({
        email: formData.email,
        password: formData.password,
      }).unwrap();

      // console.log("Login successful:", result);

      if (result.token) {
        localStorage.setItem("authToken", result.token);
      }

      router.push("/");
    } catch (err) {
      console.error("Login failed:", err);
    }

    refetch();
  };

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
              Discover authentic, sustainable products that connect you with
              nature's finest offerings
            </p>

            {/* Features with enhanced design */}
            <div className="space-y-6 text-terracotta-100 mb-12">
              <div className="flex items-center group cursor-pointer">
                <div className="relative mr-4">
                  <div className="w-4 h-4 bg-sage-300 transform group-hover:scale-110 transition-all duration-300"></div>
                  <div className="absolute -top-1 -left-1 w-6 h-6 border border-sage-300 opacity-30 group-hover:opacity-60 transition-opacity"></div>
                </div>
                <span className="text-lg group-hover:text-white transition-colors">
                  Premium quality products
                </span>
                <div className="ml-auto w-8 h-px bg-sage-300 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>

              <div className="flex items-center group cursor-pointer">
                <div className="relative mr-4">
                  <div className="w-4 h-4 bg-clay-300 transform group-hover:scale-110 transition-all duration-300"></div>
                  <div className="absolute -top-1 -left-1 w-6 h-6 border border-clay-300 opacity-30 group-hover:opacity-60 transition-opacity"></div>
                </div>
                <span className="text-lg group-hover:text-white transition-colors">
                  Sustainable & eco-friendly
                </span>
                <div className="ml-auto w-8 h-px bg-clay-300 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>

              <div className="flex items-center group cursor-pointer">
                <div className="relative mr-4">
                  <div className="w-4 h-4 bg-terracotta-300 transform group-hover:scale-110 transition-all duration-300"></div>
                  <div className="absolute -top-1 -left-1 w-6 h-6 border border-terracotta-300 opacity-30 group-hover:opacity-60 transition-opacity"></div>
                </div>
                <span className="text-lg group-hover:text-white transition-colors">
                  Fast & secure delivery
                </span>
                <div className="ml-auto w-8 h-px bg-terracotta-300 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>

              <div className="flex items-center group cursor-pointer">
                <div className="relative mr-4">
                  <div className="w-4 h-4 bg-sage-400 transform group-hover:scale-110 transition-all duration-300"></div>
                  <div className="absolute -top-1 -left-1 w-6 h-6 border border-sage-400 opacity-30 group-hover:opacity-60 transition-opacity"></div>
                </div>
                <span className="text-lg group-hover:text-white transition-colors">
                  24/7 customer support
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
              <p className="mt-2 text-gray-600">Sign in to your account</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error display */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
                  {"data" in (error as object) && (error as any).data?.message
                    ? (error as any).data.message
                    : "Login failed. Please try again."}
                </div>
              )}

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
                    disabled={isLoading}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-terracotta-500 disabled:bg-gray-50 disabled:text-gray-500"
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
                    disabled={isLoading}
                    className="block w-full pl-10 pr-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-terracotta-500 disabled:bg-gray-50 disabled:text-gray-500"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                    disabled={isLoading}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
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
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-terracotta-600 focus:ring-terracotta-500 border-gray-300 cursor-pointer"
                  />
                  <label
                    htmlFor="remember-me"
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
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium text-white bg-terracotta-600 hover:bg-terracotta-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-terracotta-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Signing in...
                  </div>
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
                  href="/Buyer/signup"
                  className="font-medium text-terracotta-600 hover:text-terracotta-500 cursor-pointer"
                >
                  Create your account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
