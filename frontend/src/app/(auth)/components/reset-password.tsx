"use client";

import type React from "react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Eye,
  EyeOff,
  Lock,
  CheckCircle,
  AlertTriangle,
  Loader2,
  User,
  Palette,
} from "lucide-react";
import {
  useVerifyResetTokenBuyerQuery,
  useResetPasswordBuyerMutation,
} from "@/services/api/buyerApi";
import {
  useVerifyResetTokenArtistQuery,
  useResetPasswordArtistMutation,
} from "@/services/api/artistApi";
import { useAuthModal } from "@/app/(auth)/components/auth-modal-provider";
import toast from "react-hot-toast";
import Link from "next/link";

type UserType = "buyer" | "artist";

export default function ResetPasswordClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const userTypeParam = searchParams.get("type");
  const { openBuyerLogin, openArtistLogin } = useAuthModal();

  const userType: UserType = userTypeParam === "artist" ? "artist" : "buyer";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    data: buyerVerifyData,
    isLoading: isBuyerVerifying,
    error: buyerVerifyError,
  } = useVerifyResetTokenBuyerQuery(token || "", {
    skip: !token || userType !== "buyer",
  });

  const [resetPasswordBuyer, { isLoading: isBuyerResetting }] =
    useResetPasswordBuyerMutation();

  const {
    data: artistVerifyData,
    isLoading: isArtistVerifying,
    error: artistVerifyError,
  } = useVerifyResetTokenArtistQuery(token || "", {
    skip: !token || userType !== "artist",
  });

  const [resetPasswordArtist, { isLoading: isArtistResetting }] =
    useResetPasswordArtistMutation();

  const verifyData = userType === "buyer" ? buyerVerifyData : artistVerifyData;
  const isVerifying =
    userType === "buyer" ? isBuyerVerifying : isArtistVerifying;
  const verifyError =
    userType === "buyer" ? buyerVerifyError : artistVerifyError;
  const isResetting =
    userType === "buyer" ? isBuyerResetting : isArtistResetting;

  const handleLoginNavigation = () => {
    router.push("/");
    setTimeout(() => {
      if (userType === "artist") {
        openArtistLogin();
      } else {
        openBuyerLogin();
      }
    }, 100);
  };

  const getPasswordStrength = (password: string) => {
    if (password.length < 6)
      return { valid: false, message: "At least 6 characters" };
    if (password.length < 8) return { valid: true, message: "Good" };
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password))
      return { valid: true, message: "Good" };
    return { valid: true, message: "Strong" };
  };

  const passwordStrength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password.trim()) {
      toast.error("Password is required");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!token) {
      toast.error("Invalid reset token");
      return;
    }

    try {
      if (userType === "buyer") {
        await resetPasswordBuyer({ token, password }).unwrap();
      } else {
        await resetPasswordArtist({ token, password }).unwrap();
      }

      toast.success(`Password reset successful for ${userType}!`);
      setIsSuccess(true);

      setTimeout(() => {
        router.push("/");
        setTimeout(() => {
          if (userType === "artist") {
            openArtistLogin();
          } else {
            openBuyerLogin();
          }
        }, 100);
      }, 3000);
    } catch (err: any) {
      const errorMessage =
        err?.data?.error ||
        err?.data?.message ||
        err?.message ||
        `Failed to reset ${userType} password`;
      toast.error(errorMessage);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
          <h2 className="text-2xl font-bold text-gray-900">
            Invalid Reset Link
          </h2>
          <p className="text-gray-600">
            This password reset link is invalid or missing. Please request a new
            one.
          </p>
          <div className="space-y-2">
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-terracotta-600 hover:bg-terracotta-700 cursor-pointer mr-2"
            >
              Request New {userType === "artist" ? "Artist" : "Buyer"} Reset
              Link
            </Link>
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-terracotta-600" />
          <p className="mt-2 text-gray-600">
            Verifying {userType} reset token...
          </p>
        </div>
      </div>
    );
  }

  if (verifyError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
          <h2 className="text-2xl font-bold text-gray-900">
            Invalid or Expired Link
          </h2>
          <p className="text-gray-600">
            This {userType} password reset link is invalid or has expired.
            Please request a new one.
          </p>
          <div className="space-y-2">
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-terracotta-600 hover:bg-terracotta-700 cursor-pointer mr-2"
            >
              Request New {userType === "artist" ? "Artist" : "Buyer"} Link
            </Link>
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
          <h2 className="text-2xl font-bold text-gray-900">
            Password Reset Successful
          </h2>
          <p className="text-gray-600">
            Your {userType} password has been successfully reset. You will be
            redirected to login shortly.
          </p>
          <div className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md hover:bg-terracotta-700 cursor-pointer">
            Best regards from Aadivaaa ❤️
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md bg-white shadow-2xl px-8 py-6 w-full space-y-6">
        <div className="text-center">
          <div className="flex justify-center mb-3">
            {userType === "artist" ? (
              <Palette className="h-10 w-10 text-terracotta-600" />
            ) : (
              <User className="h-10 w-10 text-terracotta-600" />
            )}
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            Reset {userType === "artist" ? "Artist" : "Buyer"} Password
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Enter your new password for {verifyData?.email}
          </p>
          <div className="mt-2">
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
          {/* New Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              New Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type={isPasswordVisible ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isResetting}
                className="block w-full pl-9 pr-9 py-2.5 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-terracotta-500 disabled:bg-gray-50 disabled:text-gray-500"
                placeholder="Enter new password"
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                disabled={isResetting}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                {isPasswordVisible ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {password && (
              <div className="mt-1">
                <span
                  className={`text-xs ${
                    passwordStrength.valid ? "text-green-600" : "text-red-600"
                  }`}
                >
                  Strength: {passwordStrength.message}
                </span>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Confirm New Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-gray-400" />
              </div>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={isConfirmPasswordVisible ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isResetting}
                className="block w-full pl-9 pr-9 py-2.5 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-terracotta-500 disabled:bg-gray-50 disabled:text-gray-500"
                placeholder="Confirm new password"
                minLength={6}
              />
              <button
                type="button"
                onClick={() =>
                  setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
                }
                disabled={isResetting}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                {isConfirmPasswordVisible ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {confirmPassword && password !== confirmPassword && (
              <p className="mt-1 text-xs text-red-600">
                Passwords do not match
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={
              isResetting || password !== confirmPassword || password.length < 6
            }
            className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-terracotta-600 hover:bg-terracotta-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-terracotta-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
          >
            {isResetting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Resetting {userType} Password...
              </>
            ) : (
              `Reset ${userType === "artist" ? "Artist" : "Buyer"} Password`
            )}
          </button>
        </form>

        <div className="text-center space-y-1 mb-4">
          <button
            onClick={handleLoginNavigation}
            className="text-sm text-terracotta-600 hover:text-terracotta-500 font-medium cursor-pointer block w-full bg-transparent border-none"
          >
            Back to {userType === "artist" ? "Artist" : "Buyer"} Login
          </button>
          <Link
            href="/"
            className="text-xs text-gray-500 hover:text-gray-700 cursor-pointer block"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
