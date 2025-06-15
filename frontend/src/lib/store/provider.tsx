"use client";

import { ReactNode, useRef } from "react";
import { Provider } from "react-redux";
import { makeStore, AppStore } from "@/lib/store";
import { Toaster } from "react-hot-toast";

export default function StoreProvider({ children }: { children: ReactNode }) {
  const storeRef = useRef<AppStore | null>(null);

  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  return (
    <Provider store={storeRef.current}>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#faf8f5",
            color: "#8B4513",
            border: "1px solid #D2691E",
            borderRadius: "4px",
            boxShadow: "0 4px 12px rgba(139, 69, 19, 0.15)",
            fontSize: "14px",
            fontWeight: "500",
            padding: "12px 16px",
            maxWidth: "400px",
          },
          success: {
            style: {
              background: "#f7f9f7",
              color: "#2d5016",
              border: "1px solid #4a7c59",
              boxShadow: "0 4px 12px rgba(74, 124, 89, 0.15)",
            },
            iconTheme: {
              primary: "#4a7c59",
              secondary: "#f7f9f7",
            },
          },
          error: {
            style: {
              background: "#fdf6f6",
              color: "#8B4513",
              border: "1px solid #CD853F",
              boxShadow: "0 4px 12px rgba(205, 133, 63, 0.15)",
            },
            iconTheme: {
              primary: "#CD853F",
              secondary: "#fdf6f6",
            },
          },
          loading: {
            style: {
              background: "#f8f6f3",
              color: "#6B5B73",
              border: "1px solid #9C8AA5",
              boxShadow: "0 4px 12px rgba(156, 138, 165, 0.15)",
            },
            iconTheme: {
              primary: "#9C8AA5",
              secondary: "#f8f6f3",
            },
          },
        }}
      />
      {children}
    </Provider>
  );
}
