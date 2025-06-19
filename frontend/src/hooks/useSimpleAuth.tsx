"use client";

import { useEffect, useState } from "react";
import { useGetBuyerQuery } from "@/services/api/buyerApi";

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

export function useSimpleAuth() {
  const [hasTriedAuth, setHasTriedAuth] = useState<boolean>(false);

  const {
    data: buyerData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetBuyerQuery(undefined, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  useEffect(() => {
    if (isError || buyerData) {
      setHasTriedAuth(true);
    }
  }, [isError, buyerData]);

  const isAuthenticated: boolean = !isError && !!buyerData && hasTriedAuth;
  const apiError = error as ApiError | undefined;

  const user =
    isAuthenticated && buyerData
      ? {
          name: (buyerData as BuyerData).firstName || "User",
          image: (buyerData as BuyerData).avatar || "/Profile.jpg",
          ...buyerData,
        }
      : null;

  return {
    isAuthenticated,
    isLoading: isLoading && !hasTriedAuth,
    isError,
    error: apiError,
    user,
    refetch,
  };
}
