"use client";

import { useState } from "react";
import { getGoogleAuthUrl } from "@/utils/api";

export const useGoogleAuth = () => {
  const [isLoading, setIsLoading] = useState(false);

  const initiateGoogleAuth = (userType: "buyer" | "artist") => {
    setIsLoading(true);

    // Store the current page URL to return to after auth
    sessionStorage.setItem("preAuthUrl", window.location.href);

    // Redirect to Google OAuth in the same window
    window.location.href = getGoogleAuthUrl(userType);
  };

  return {
    initiateGoogleAuth,
    isLoading,
  };
};
