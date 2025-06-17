"use client";

import { useEffect } from "react";
import { useAuthModal } from "@/app/(auth)/components/auth-modal-provider";

export default function AuthStateHandler() {
  const { openBuyerLogin } = useAuthModal();

  useEffect(() => {
    // Check if we should reopen the login modal after OAuth redirect
    const wasLoginModalOpen = sessionStorage.getItem("wasLoginModalOpen");

    if (wasLoginModalOpen) {
      sessionStorage.removeItem("wasLoginModalOpen");
      // Small delay to ensure page is loaded
      setTimeout(() => {
        openBuyerLogin();
      }, 100);
    }
  }, [openBuyerLogin]);

  return null;
}
