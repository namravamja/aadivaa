"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowRight, User, Mail, Lock } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would register with a backend
    console.log("Customer Signup attempt:", formData);

    // Simulate successful registration and redirect
    router.push("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-clay-50">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-sage-200 opacity-30 blur-3xl"></div>
        <div className="absolute top-1/3 -left-24 w-80 h-80 rounded-full bg-terracotta-200 opacity-30 blur-3xl"></div>
        <div className="absolute bottom-0 right-1/3 w-full h-1/2 bg-clay-200 opacity-20 blur-3xl"></div>

        {/* Decorative pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23cb4f30' fillOpacity='1' fillRule='evenodd'/%3E%3C/svg%3E")`,
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

            <div className="flex items-center">
              <div>
                <h1 className="text-3xl font-light mb-2 relative">
                  Join{" "}
                  <span className="font-medium">
                    AADIVA<span className="font-bold">EARTH</span>
                  </span>
                </h1>
                <p className="text-terracotta-100 text-sm">
                  Create your customer account
                </p>
              </div>
            </div>
          </div>

          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4 mb-5">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-stone-400 group-focus-within:text-terracotta-500 transition-colors duration-200">
                    <User size={18} />
                  </div>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3.5 bg-stone-50 border border-stone-200 rounded-xl focus:border-terracotta-500 focus:outline-none focus:ring-2 focus:ring-terracotta-100 transition-all duration-200"
                    placeholder="First Name"
                  />
                </div>
                <div className="relative group">
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 bg-stone-50 border border-stone-200 rounded-xl focus:border-terracotta-500 focus:outline-none focus:ring-2 focus:ring-terracotta-100 transition-all duration-200"
                    placeholder="Last Name"
                  />
                </div>
              </div>

              <div className="relative group mb-5">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-stone-400 group-focus-within:text-terracotta-500 transition-colors duration-200">
                  <Mail size={18} />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3.5 bg-stone-50 border border-stone-200 rounded-xl focus:border-terracotta-500 focus:outline-none focus:ring-2 focus:ring-terracotta-100 transition-all duration-200"
                  placeholder="Email address"
                />
              </div>

              <div className="relative group mb-2">
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
                  className="w-full pl-11 pr-11 py-3.5 bg-stone-50 border border-stone-200 rounded-xl focus:border-terracotta-500 focus:outline-none focus:ring-2 focus:ring-terracotta-100 transition-all duration-200"
                  placeholder="Password"
                />
                <button
                  type="button"
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-terracotta-600 transition-colors duration-200"
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
              <p className="text-xs text-stone-500 mb-5">
                Password must be at least 8 characters long
              </p>

              <div className="flex items-center">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 rounded border-stone-300 text-terracotta-600 focus:ring-terracotta-500"
                />
                <label
                  htmlFor="terms"
                  className="ml-2 block text-xs text-stone-600"
                >
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    className="text-terracotta-600 hover:text-terracotta-700 transition-colors duration-200"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="text-terracotta-600 hover:text-terracotta-700 transition-colors duration-200"
                  >
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-terracotta-600 text-white py-3.5 px-4 rounded-xl font-medium hover:bg-terracotta-700 flex items-center justify-center shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
              >
                Create Account
                <ArrowRight className="ml-2 h-4 w-4 animate-pulse-slow" />
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-stone-500">
                Already have an account?{" "}
                <Link
                  href="/Buyer/login"
                  className="text-terracotta-600 hover:text-terracotta-700 font-medium transition-colors duration-200"
                >
                  Login
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
