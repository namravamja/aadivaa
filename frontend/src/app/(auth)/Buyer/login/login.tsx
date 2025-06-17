"use client";

import type React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, Loader2, X } from "lucide-react";
import { useLoginBuyerMutation } from "@/services/api/authApi";
import { useGetBuyerQuery } from "@/services/api/buyerApi";
import { useAuthModal } from "@/app/(auth)/components/auth-modal-provider";
import toast from "react-hot-toast";

interface BuyerLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BuyerLoginModal({
  isOpen,
  onClose,
}: BuyerLoginModalProps) {
  const router = useRouter();
  const { openBuyerSignup } = useAuthModal();
  const [loginBuyer, { isLoading }] = useLoginBuyerMutation();
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

    if (!formData.email.trim()) {
      toast.error("Email is required");
      return;
    }
    if (!formData.password.trim()) {
      toast.error("Password is required");
      return;
    }

    try {
      const result = await loginBuyer({
        email: formData.email,
        password: formData.password,
      }).unwrap();

      if (result.token) {
        localStorage.setItem("authToken", result.token);
      }

      toast.success("Login successful!");
      onClose();
      refetch();
    } catch (err: any) {
      const errorMessage =
        err?.data?.message || err?.message || "Login failed. Please try again";
      toast.error(errorMessage);
    }
  };

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
      });
      setIsPasswordVisible(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-none transition-opacity cursor-pointer"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10 p-1 rounded-full hover:bg-gray-100 cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl mt-4 font-bold text-gray-900">Welcome back to Aadivaa</h2>
            <p className="mt-2 text-gray-600">Shop for best quality products..</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label
                htmlFor="buyer-email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="buyer-email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-terracotta-500 disabled:bg-gray-50 disabled:text-gray-500"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="buyer-password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="buyer-password"
                  name="password"
                  type={isPasswordVisible ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-terracotta-500 disabled:bg-gray-50 disabled:text-gray-500"
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
                  id="buyer-remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-terracotta-600 focus:ring-terracotta-500 border-gray-300 rounded cursor-pointer"
                />
                <label
                  htmlFor="buyer-remember-me"
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
              disabled={isLoading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-terracotta-600 hover:bg-terracotta-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-terracotta-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
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
                onClick={openBuyerSignup}
                className="font-medium text-terracotta-600 hover:text-terracotta-500 cursor-pointer"
              >
                Create your account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
