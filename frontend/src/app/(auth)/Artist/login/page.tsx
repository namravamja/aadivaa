"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowRight, User, Lock } from "lucide-react";

export default function ArtistLoginPage() {
  const router = useRouter();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would authenticate with a backend
    console.log("Artist Login attempt:", formData);

    // Simulate successful login and redirect
    router.push("/Artist");
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-clay-50">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-sage-200 opacity-20 blur-3xl"></div>
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
          <div className="h-2 bg-gradient-to-r from-sage-400 via-sage-600 to-sage-500"></div>

          {/* Header with brand */}
          <div className="bg-sage-600 text-white py-8 px-8 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full border-8 border-sage-400 opacity-30"></div>
              <div className="absolute -left-4 bottom-0 w-24 h-24 rounded-full border-4 border-sage-400 opacity-20"></div>
            </div>

            <h1 className="text-3xl font-light mb-2 relative">
              Welcome to{" "}
              <span className="font-medium">
                AADIVAA<span className="font-bold">EARTH</span>
              </span>
            </h1>
            <p className="text-sage-100 text-sm">Artist / Artist Login</p>
          </div>

          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-stone-400 group-focus-within:text-sage-500 transition-colors duration-200">
                    <User size={18} />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3.5 bg-stone-50 border border-stone-200 rounded-xl focus:border-sage-500 focus:outline-none focus:ring-2 focus:ring-sage-100 transition-all duration-200"
                    placeholder="Email address"
                  />
                </div>
              </div>

              <div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-stone-400 group-focus-within:text-sage-500 transition-colors duration-200">
                    <Lock size={18} />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={isPasswordVisible ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-11 pr-11 py-3.5 bg-stone-50 border border-stone-200 rounded-xl focus:border-sage-500 focus:outline-none focus:ring-2 focus:ring-sage-100 transition-all duration-200"
                    placeholder="Password"
                  />
                  <button
                    type="button"
                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-sage-600 transition-colors duration-200"
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
                    className="h-4 w-4 rounded border-stone-300 text-sage-600 focus:ring-sage-500"
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
                    className="text-sage-600 hover:text-sage-700 font-medium transition-colors duration-200"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-sage-600 text-white py-3.5 px-4 rounded-xl font-medium hover:bg-sage-700 flex items-center justify-center shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
              >
                Sign in{" "}
                <ArrowRight className="ml-2 h-4 w-4 animate-pulse-slow" />
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-stone-500">
                Don&apos;t have an account?{" "}
                <Link
                  href="/Artist/signup"
                  className="text-sage-600 hover:text-sage-700 font-medium transition-colors duration-200"
                >
                  Artist Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Decorative bottom element */}
        <div className="w-24 h-1.5 bg-sage-400 rounded-full mx-auto mt-8 opacity-50"></div>
      </div>
    </div>
  );
}
