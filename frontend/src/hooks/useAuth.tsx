"use client";

import { useEffect, useState } from "react";
import { useGetBuyerQuery } from "@/services/api/buyerApi";
import { useGetartistQuery } from "@/services/api/artistApi"; // add this if not already present
import { useAuthModal } from "@/app/(auth)/components/auth-modal-provider";

interface ApiError {
  status?: number;
  data?: any;
  [key: string]: any;
}

interface BuyerData {
  firstName?: string;
  avatar?: string;
  [key: string]: any;
}

interface ArtistData {
  fullName?: string;
  avatar?: string;
  [key: string]: any;
}

export function useAuth(role: "buyer" | "artist") {
  const [hasTriedAuth, setHasTriedAuth] = useState(false);
  const { openBuyerLogin, openArtistLogin } = useAuthModal();

  const {
    data: buyerData,
    isLoading: buyerLoading,
    isError: isBuyerError,
    error: buyerError,
    refetch: refetchBuyer,
  } = useGetBuyerQuery(undefined, {
    skip: role !== "buyer",
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const {
    data: artistData,
    isLoading: artistLoading,
    isError: isArtistError,
    error: artistError,
    refetch: refetchArtist,
  } = useGetartistQuery(undefined, {
    skip: role !== "artist",
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  useEffect(() => {
    if (
      (role === "buyer" && (isBuyerError || buyerData)) ||
      (role === "artist" && (isArtistError || artistData))
    ) {
      setHasTriedAuth(true);
    }
  }, [isBuyerError, buyerData, isArtistError, artistData, role]);

  useEffect(() => {
    if (hasTriedAuth) {
      if (role === "buyer" && isBuyerError && !buyerData) {
        openBuyerLogin();
      } else if (role === "artist" && isArtistError && !artistData) {
        openArtistLogin();
      }
    }
  }, [hasTriedAuth, isBuyerError, isArtistError, role]);

  const isAuthenticated =
    (role === "buyer" && !isBuyerError && !!buyerData && hasTriedAuth) ||
    (role === "artist" && !isArtistError && !!artistData && hasTriedAuth);

  const apiError = (role === "buyer" ? buyerError : artistError) as
    | ApiError
    | undefined;

  const user =
    isAuthenticated && (buyerData || artistData)
      ? {
          name:
            role === "buyer"
              ? (buyerData as BuyerData)?.firstName || "User"
              : (artistData as ArtistData)?.fullName || "User",
          image:
            role === "buyer"
              ? (buyerData as BuyerData)?.avatar || "/Profile.jpg"
              : (artistData as ArtistData)?.avatar || "/Profile.jpg",
          ...(role === "buyer" ? buyerData : artistData),
        }
      : null;

  return {
    isAuthenticated,
    isLoading:
      (role === "buyer" ? buyerLoading : artistLoading) && !hasTriedAuth,
    isError: role === "buyer" ? isBuyerError : isArtistError,
    error: apiError,
    user,
    refetch: role === "buyer" ? refetchBuyer : refetchArtist,
  };
}
