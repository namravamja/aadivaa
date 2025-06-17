"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { Loader2, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

interface UserData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar: string;
  role: "BUYER" | "ARTIST";
  isNewUser: boolean;
  isOAuthUser: boolean;
}

export default function AuthSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const [isProcessing, setIsProcessing] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const processAuth = async () => {
      try {
        // Dismiss any loading toasts
        toast.dismiss("google-auth");

        const dataParam = searchParams.get("data");

        if (!dataParam) {
          toast.error("Authentication data not found");

          // Check if we should return to a specific page
          const preAuthUrl = sessionStorage.getItem("preAuthUrl");
          if (preAuthUrl) {
            sessionStorage.removeItem("preAuthUrl");
            router.push(preAuthUrl);
          } else {
            router.push("/");
          }
          return;
        }

        const userData: UserData = JSON.parse(decodeURIComponent(dataParam));
        setUserData(userData);

        // Store user data in localStorage for immediate access
        localStorage.setItem("authToken", "google-oauth-success");
        localStorage.setItem("userData", JSON.stringify(userData));

        // Get the pre-auth URL before clearing it
        const preAuthUrl = sessionStorage.getItem("preAuthUrl");

        // Clear any pre-auth state
        sessionStorage.removeItem("preAuthUrl");
        sessionStorage.removeItem("wasLoginModalOpen");

        // Dispatch to Redux store if you're using it
        // dispatch(setUser(userData))

        // Show success message
        if (userData.isNewUser) {
          toast.success(
            `Welcome to Aadivaa, ${userData.firstName}! Your account has been created successfully.`
          );
        } else {
          toast.success(`Welcome back, ${userData.firstName}!`);
        }

        // Wait a moment to show the success state
        setTimeout(() => {
          // Redirect to previous page or default based on user role
          if (preAuthUrl) {
            router.push(preAuthUrl);
          } else if (userData.role === "BUYER") {
            router.push("/");
          } else {
            router.push("/Artist");
          }
        }, 1500); // Give user time to see the success message
      } catch (error) {
        console.error("Auth processing error:", error);
        toast.error("Failed to process authentication");

        // Return to previous page or home
        const preAuthUrl = sessionStorage.getItem("preAuthUrl");
        if (preAuthUrl) {
          sessionStorage.removeItem("preAuthUrl");
          router.push(preAuthUrl);
        } else {
          router.push("/");
        }
      } finally {
        setIsProcessing(false);
      }
    };

    processAuth();
  }, [searchParams, router, dispatch]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {isProcessing ? (
          <>
            <Loader2 className="w-12 h-12 animate-spin text-terracotta-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Setting up your account...
            </h2>
            <p className="text-gray-600">
              Please wait while we complete your Google sign-in
            </p>
          </>
        ) : userData ? (
          <>
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {userData.isNewUser ? "Account Created!" : "Welcome Back!"}
            </h2>
            <p className="text-gray-600 mb-4">
              {userData.isNewUser
                ? `Hi ${userData.firstName}, your account has been created successfully.`
                : `Hi ${userData.firstName}, you're now signed in.`}
            </p>
            <div className="flex items-center justify-center space-x-3 mb-4">
              {userData.avatar && (
                <img
                  src={userData.avatar || "/placeholder.svg"}
                  alt={userData.firstName}
                  className="w-10 h-10 rounded-full"
                />
              )}
              <div className="text-left">
                <p className="font-medium text-gray-900">
                  {userData.firstName} {userData.lastName}
                </p>
                <p className="text-sm text-gray-600">{userData.email}</p>
              </div>
            </div>
            <p className="text-sm text-gray-500">Redirecting...</p>
          </>
        ) : (
          <>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-600 text-xl">✕</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Authentication Failed
            </h2>
            <p className="text-gray-600">Something went wrong during sign-in</p>
          </>
        )}
      </div>
    </div>
  );
}
