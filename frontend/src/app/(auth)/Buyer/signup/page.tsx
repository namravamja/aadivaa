"use client";

import type React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Eye, EyeOff, User, Mail, Lock, X } from "lucide-react";
import { useSignupBuyerMutation } from "@/services/api/authApi";
import { useAuthModal } from "@/app/(auth)/components/auth-modal-provider";
import toast from "react-hot-toast";

interface BuyerSignupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BuyerSignupModal({
  isOpen,
  onClose,
}: BuyerSignupModalProps) {
  const { openBuyerLogin } = useAuthModal();
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

    if (!formData.firstName.trim()) {
      toast.error("First name is required");
      return;
    }
    if (!formData.lastName.trim()) {
      toast.error("Last name is required");
      return;
    }
    if (!formData.email.trim()) {
      toast.error("Email is required");
      return;
    }
    if (!formData.password.trim()) {
      toast.error("Password is required");
      return;
    }
    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    try {
      const loadingToastId = toast.loading("Creating your account...");

      const result = await signupBuyer(formData).unwrap();

      toast.dismiss(loadingToastId);
      toast.success("Account created successfully! Please sign in");

      onClose();
      openBuyerLogin();
    } catch (err) {
      toast.dismiss();

      if ("data" in (err as any)) {
        const errorMessage =
          (err as any).data?.message || "Signup failed. Please try again";
        toast.error(errorMessage);
      } else {
        toast.error("An error occurred. Please try again");
      }

      console.error("Signup failed:", err);
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
        firstName: "",
        lastName: "",
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
        className="absolute inset-0 bg-black/60 backdrop-blur-none transition-opacity"
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
            <h2 className="text-3xl font-bold text-gray-900">Create account</h2>
            <p className="mt-2 text-gray-600">Join AADIVAEARTH today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="buyer-firstName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  First name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="buyer-firstName"
                    name="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-sage-500 disabled:bg-gray-50 disabled:text-gray-500"
                    placeholder="First name"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="buyer-lastName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Last name
                </label>
                <input
                  id="buyer-lastName"
                  name="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="block w-full px-3 py-3 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-sage-500 disabled:bg-gray-50 disabled:text-gray-500"
                  placeholder="Last name"
                />
              </div>
            </div>

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
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-sage-500 disabled:bg-gray-50 disabled:text-gray-500"
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
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-sage-500 disabled:bg-gray-50 disabled:text-gray-500"
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
                id="buyer-terms"
                name="terms"
                type="checkbox"
                required
                disabled={isLoading}
                className="h-4 w-4 mt-1 text-sage-600 focus:ring-sage-500 border-gray-300 rounded cursor-pointer"
              />
              <label
                htmlFor="buyer-terms"
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
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-sage-600 hover:bg-sage-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sage-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
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
              <button
                onClick={openBuyerLogin}
                className="font-medium text-sage-600 hover:text-sage-500 cursor-pointer"
              >
                Sign in to your account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
