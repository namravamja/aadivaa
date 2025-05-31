"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowRight, User, Lock } from "lucide-react";
import { useLoginBuyerMutation } from "@/services/api/authApi"; // Adjust import path as needed

export default function LoginPage() {
  const router = useRouter();
  const [loginBuyer, { isLoading, error }] = useLoginBuyerMutation();

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

      // Handle successful login
      console.log("Login successful:", result);

      // Store token if provided
      if (result.token) {
        localStorage.setItem("authToken", result.token);
      }

      // Redirect to dashboard or home
      router.push("/");
    } catch (err) {
      console.error("Login failed:", err);
      // Error is already handled by RTK Query and available in the error state
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-clay-50">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-terracotta-200 opacity-20 blur-3xl"></div>
        <div className="absolute top-1/4 -right-24 w-80 h-80 rounded-full bg-sage-300 opacity-20 blur-3xl"></div>
        <div className="absolute bottom-0 left-1/3 w-full h-1/2 bg-clay-200 opacity-20 blur-3xl"></div>

        {/* Decorative pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23cb4f30' fillOpacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      <div className="w-full max-w-md px-4 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col transform transition-all hover:shadow-2xl">
          {/* Decorative top accent */}
          <div className="h-2 bg-gradient-to-r from-terracotta-400 via-terracotta-600 to-terracotta-500"></div>

          {/* Header with brand */}
          <div className="bg-terracotta-600 text-white py-8 px-8 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full border-8 border-terracotta-400 opacity-30"></div>
              <div className="absolute -left-4 bottom-0 w-24 h-24 rounded-full border-4 border-terracotta-400 opacity-20"></div>
            </div>

            <h1 className="text-3xl font-light mb-2 relative">
              Welcome to{" "}
              <span className="font-medium">
                AADIVAA<span className="font-bold">EARTH</span>
              </span>
            </h1>
            <p className="text-terracotta-100 text-sm">Customer Login</p>
          </div>

          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Error display */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                  {"data" in (error as object) && (error as any).data?.message
                    ? (error as any).data.message
                    : "Login failed. Please try again."}
                </div>
              )}

              <div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-stone-400 group-focus-within:text-terracotta-500 transition-colors duration-200">
                    <User size={18} />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="w-full pl-11 pr-4 py-3.5 bg-stone-50 border border-stone-200 rounded-xl focus:border-terracotta-500 focus:outline-none focus:ring-2 focus:ring-terracotta-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Email address"
                  />
                </div>
              </div>

              <div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-stone-400 group-focus-within:text-terracotta-500 transition-colors duration-200">
                    <Lock size={18} />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={isPasswordVisible ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="w-full pl-11 pr-11 py-3.5 bg-stone-50 border border-stone-200 rounded-xl focus:border-terracotta-500 focus:outline-none focus:ring-2 focus:ring-terracotta-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Password"
                  />
                  <button
                    type="button"
                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                    disabled={isLoading}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-terracotta-600 transition-colors duration-200 disabled:opacity-50"
                    aria-label={
                      isPasswordVisible ? "Hide password" : "Show password"
                    }
                  >
                    {isPasswordVisible ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    disabled={isLoading}
                    className="h-4 w-4 rounded border-stone-300 text-terracotta-600 focus:ring-terracotta-500 disabled:opacity-50"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-stone-600"
                  >
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link
                    href="/forgot-password"
                    className={`text-terracotta-600 hover:text-terracotta-700 font-medium transition-colors duration-200 ${
                      isLoading ? "pointer-events-none opacity-50" : ""
                    }`}
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-terracotta-600 text-white py-3.5 px-4 rounded-xl font-medium hover:bg-terracotta-700 flex items-center justify-center shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in{" "}
                    <ArrowRight className="ml-2 h-4 w-4 animate-pulse-slow" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-stone-500">
                Don&apos;t have an account?{" "}
                <Link
                  href="/Buyer/signup"
                  className={`text-terracotta-600 hover:text-terracotta-700 font-medium transition-colors duration-200 ${
                    isLoading ? "pointer-events-none opacity-50" : ""
                  }`}
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Decorative bottom element */}
        <div className="w-24 h-1.5 bg-terracotta-400 rounded-full mx-auto mt-8 opacity-50"></div>
      </div>
    </div>
  );
}
