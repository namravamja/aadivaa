"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { X, Mail, Loader2, CheckCircle } from "lucide-react";
import { useForgotPasswordBuyerMutation } from "@/services/api/buyerApi";
import { useForgotPasswordArtistMutation } from "@/services/api/artistApi";
import { useAuthModal } from "@/app/(auth)/components/auth-modal-provider";
import toast from "react-hot-toast";

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  userType: "buyer" | "artist";
}

export default function ForgotPasswordModal({
  isOpen,
  onClose,
  userType,
}: ForgotPasswordModalProps) {
  const [forgotPasswordBuyer, { isLoading: isBuyerLoading }] =
    useForgotPasswordBuyerMutation();
  const [forgotPasswordArtist, { isLoading: isArtistLoading }] =
    useForgotPasswordArtistMutation();

  const { openBuyerLogin, openArtistLogin } = useAuthModal();

  const [email, setEmail] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);

  const isLoading = userType === "buyer" ? isBuyerLoading : isArtistLoading;

  // Function to handle back to login navigation
  const handleBackToLogin = () => {
    // Close the current modal first
    handleClose();

    // Then open the appropriate login modal after a brief delay
    if (userType === "artist") {
      openArtistLogin();
    } else {
      openBuyerLogin();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Email is required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      const mutation =
        userType === "buyer" ? forgotPasswordBuyer : forgotPasswordArtist;

      // Pass userType to backend so it can include it in the reset link
      const requestData = {
        email: email.trim(),
        userType: userType, // Make sure backend includes this in the reset URL
      };

      const result = await mutation(requestData).unwrap();

      toast.success(`Password reset email sent to your ${userType} account!`);
      setIsEmailSent(true);
    } catch (err: any) {
      const errorMessage =
        err?.data?.error ||
        err?.data?.message ||
        err?.message ||
        `Failed to send ${userType} reset email`;
      toast.error(errorMessage);
    }
  };

  const handleClose = () => {
    setEmail("");
    setIsEmailSent(false);
    onClose();
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
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
  }, [isOpen]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setEmail("");
      setIsEmailSent(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const getTitle = () => {
    return userType === "artist"
      ? "Forgot Password, Artist?"
      : "Forgot Password?";
  };

  const getSubtitle = () => {
    return userType === "artist"
      ? "No worries, we'll help you get back to creating."
      : "No worries, we'll send you reset instructions.";
  };

  const getEmailPlaceholder = () => {
    return userType === "artist"
      ? "Enter your artist account email"
      : "Enter your buyer account email";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-none transition-opacity cursor-pointer"
        onClick={handleClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10 p-1 rounded-full hover:bg-gray-100 cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-6">
          {!isEmailSent ? (
            <>
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mt-4">
                  {getTitle()}
                </h2>
                <p className="mt-2 text-gray-600">{getSubtitle()}</p>
                <div className="mt-3">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      userType === "artist"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {userType === "artist" ? "Artist Account" : "Buyer Account"}
                  </span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="forgot-email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {userType === "artist"
                      ? "Artist Email Address"
                      : "Email Address"}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="forgot-email"
                      name="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-terracotta-500 disabled:bg-gray-50 disabled:text-gray-500"
                      placeholder={getEmailPlaceholder()}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-terracotta-600 hover:bg-terracotta-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-terracotta-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending {userType} reset email...
                    </>
                  ) : (
                    `Send ${
                      userType === "artist" ? "Artist" : "Buyer"
                    } Reset Email`
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <button
                  onClick={handleBackToLogin}
                  className="text-sm text-terracotta-600 hover:text-terracotta-500 font-medium cursor-pointer bg-transparent border-none"
                >
                  Back to {userType} sign in
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-6">
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Check your email
              </h2>
              <p className="text-gray-600 mb-2">
                We sent a {userType} password reset link to
              </p>
              <p className="font-medium text-gray-900 mb-6">{email}</p>
              <div className="mb-4">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    userType === "artist"
                      ? "bg-purple-100 text-purple-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {userType === "artist"
                    ? "Artist Account Reset"
                    : "Buyer Account Reset"}
                </span>
              </div>
              <div className="space-y-3">
                <button
                  onClick={handleClose}
                  className="w-full py-2 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-terracotta-600 hover:bg-terracotta-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-terracotta-500 cursor-pointer transition-colors"
                >
                  Done
                </button>
                <p className="text-xs text-gray-500">
                  Didn't receive the email? Check your spam folder or{" "}
                  <button
                    onClick={() => setIsEmailSent(false)}
                    className="text-terracotta-600 hover:text-terracotta-500 font-medium cursor-pointer bg-transparent border-none"
                  >
                    try another email address
                  </button>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
