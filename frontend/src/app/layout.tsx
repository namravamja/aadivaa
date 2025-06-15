import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import StoreProvider from "@/lib/store/provider";
import { AuthModalProvider } from "./(auth)/components/auth-modal-provider";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aadivaa — Handcrafted With Heritage",
  description:
    "Explore beautifully handcrafted creations by indigenous artisans. Aadivaa connects you with timeless tribal artistry—shop ethically, support communities, and celebrate culture.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${jakarta.variable} ${jetbrains.variable} antialiased bg-white text-neutral-900`}
      >
        <StoreProvider>
          <AuthModalProvider>{children}</AuthModalProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
