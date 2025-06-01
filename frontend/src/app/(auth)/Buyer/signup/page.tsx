"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, User, Mail, Lock } from "lucide-react";
import { useSignupBuyerMutation } from "@/services/api/authApi";

export default function SignupPage() {
  const router = useRouter();
  const [signupBuyer, { isLoading, isError, error }] = useSignupBuyerMutation();

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
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
      const result = await signupBuyer(formData).unwrap();
      console.log("Signup successful:", result);
      router.push("/Buyer/login");
    } catch (err) {
      console.error("Signup failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left side - Signup Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-md">
          <div className="bg-white py-8 px-6 shadow-sm border border-gray-200">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">
                Create account
              </h2>
              <p className="mt-2 text-gray-600">Join AADIVAEARTH today</p>
            </div>
            {/* Error display */}
            {isError && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
                {error && "data" in error
                  ? (error.data as any)?.message ||
                    "Signup failed. Please try again."
                  : "An error occurred. Please try again."}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    First name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      disabled={isLoading}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-sage-500 disabled:bg-gray-50 disabled:text-gray-500"
                      placeholder="First name"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Last name
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-sage-500 disabled:bg-gray-50 disabled:text-gray-500"
                    placeholder="Last name"
                  />
                </div>
              </div>

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
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-sage-500 disabled:bg-gray-50 disabled:text-gray-500"
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
                    className="block w-full pl-10 pr-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-sage-500 disabled:bg-gray-50 disabled:text-gray-500"
                    placeholder="Create a password"
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
                <p className="mt-1 text-xs text-gray-500">
                  Must be at least 8 characters
                </p>
              </div>

              {/* Terms checkbox */}
              <div className="flex items-start">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  disabled={isLoading}
                  className="h-4 w-4 mt-1 text-sage-600 focus:ring-sage-500 border-gray-300 cursor-pointer"
                />
                <label
                  htmlFor="terms"
                  className="ml-2 block text-sm text-gray-700 cursor-pointer"
                >
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    className="text-sage-600 hover:text-sage-500 font-medium cursor-pointer"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="text-sage-600 hover:text-sage-500 font-medium cursor-pointer"
                  >
                    Privacy Policy
                  </Link>
                </label>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium text-white bg-sage-600 hover:bg-sage-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sage-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Creating account...
                  </div>
                ) : (
                  "Create account"
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
                    Already have an account?
                  </span>
                </div>
              </div>

              <div className="mt-6 text-center">
                <Link
                  href="/Buyer/login"
                  className="font-medium text-sage-600 hover:text-sage-500 cursor-pointer"
                >
                  Sign in to your account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Branding */}
      <div className="hidden lg:flex lg:w-3/5 bg-sage-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-sage-700 opacity-10"></div>
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <div className="max-w-md">
            <h1 className="text-4xl font-bold mb-4">
              AADIVAA<span className="font-light">EARTH</span>
            </h1>
            <p className="text-xl text-sage-100 mb-8">
              Start your journey with sustainable, premium products
            </p>
            <div className="space-y-4 text-sage-100">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-terracotta-300 mr-3"></div>
                <span>Exclusive member benefits</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-clay-300 mr-3"></div>
                <span>Early access to new products</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-sage-300 mr-3"></div>
                <span>Personalized recommendations</span>
              </div>
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-terracotta-500 opacity-20"></div>
        <div className="absolute top-1/4 left-8 w-16 h-16 bg-clay-400 opacity-30"></div>
      </div>
    </div>
  );
}
