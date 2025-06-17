"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function AuthErrorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Dismiss any loading toasts
    toast.dismiss("google-auth");

    const message = searchParams.get("message") || "Authentication failed";
    toast.error(message);

    // Check if we should return to a specific page
    const preAuthUrl = sessionStorage.getItem("preAuthUrl");

    // Clean up session storage
    sessionStorage.removeItem("preAuthUrl");
    sessionStorage.removeItem("wasLoginModalOpen");

    // Redirect after showing error
    setTimeout(() => {
      if (preAuthUrl) {
        router.push(preAuthUrl);
      } else {
        router.push("/");
      }
    }, 3000);
  }, [searchParams, router]);

  const handleGoBack = () => {
    const preAuthUrl = sessionStorage.getItem("preAuthUrl");
    sessionStorage.removeItem("preAuthUrl");
    sessionStorage.removeItem("wasLoginModalOpen");

    if (preAuthUrl) {
      router.push(preAuthUrl);
    } else {
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Authentication Failed
        </h2>
        <p className="text-gray-600 mb-4">
          {searchParams.get("message") || "Something went wrong during sign-in"}
        </p>
        <div className="space-y-3">
          <button
            onClick={handleGoBack}
            className="w-full bg-terracotta-600 hover:bg-terracotta-700 text-white px-6 py-2 rounded-md font-medium transition-colors"
          >
            Go Back
          </button>
          <p className="text-sm text-gray-500">
            Redirecting automatically in 3 seconds...
          </p>
        </div>
      </div>
    </div>
  );
}
