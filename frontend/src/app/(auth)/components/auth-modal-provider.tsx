"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import ArtistLoginModal from "../Artist/login/page";
import BuyerLoginModal from "../Buyer/login/page";
import ArtistSignupModal from "../Artist/signup/page";
import BuyerSignupModal from "../Buyer/signup/page";

interface AuthModalContextType {
  openArtistLogin: () => void;
  openBuyerLogin: () => void;
  openArtistSignup: () => void;
  openBuyerSignup: () => void;
  closeModals: () => void;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(
  undefined
);

export function useAuthModal() {
  const context = useContext(AuthModalContext);
  if (!context) {
    throw new Error("useAuthModal must be used within an AuthModalProvider");
  }
  return context;
}

interface AuthModalProviderProps {
  children: ReactNode;
}

export function AuthModalProvider({ children }: AuthModalProviderProps) {
  const [isArtistLoginOpen, setIsArtistLoginOpen] = useState(false);
  const [isBuyerLoginOpen, setIsBuyerLoginOpen] = useState(false);
  const [isArtistSignupOpen, setIsArtistSignupOpen] = useState(false);
  const [isBuyerSignupOpen, setIsBuyerSignupOpen] = useState(false);

  const openArtistLogin = () => {
    setIsBuyerLoginOpen(false);
    setIsArtistSignupOpen(false);
    setIsBuyerSignupOpen(false);
    setIsArtistLoginOpen(true);
  };

  const openBuyerLogin = () => {
    setIsArtistLoginOpen(false);
    setIsArtistSignupOpen(false);
    setIsBuyerSignupOpen(false);
    setIsBuyerLoginOpen(true);
  };

  const openArtistSignup = () => {
    setIsArtistLoginOpen(false);
    setIsBuyerLoginOpen(false);
    setIsBuyerSignupOpen(false);
    setIsArtistSignupOpen(true);
  };

  const openBuyerSignup = () => {
    setIsArtistLoginOpen(false);
    setIsBuyerLoginOpen(false);
    setIsArtistSignupOpen(false);
    setIsBuyerSignupOpen(true);
  };

  const closeModals = () => {
    const wasOpen =
      isArtistLoginOpen ||
      isBuyerLoginOpen ||
      isArtistSignupOpen ||
      isBuyerSignupOpen;

    setIsArtistLoginOpen(false);
    setIsBuyerLoginOpen(false);
    setIsArtistSignupOpen(false);
    setIsBuyerSignupOpen(false);
  };

  return (
    <AuthModalContext.Provider
      value={{
        openArtistLogin,
        openBuyerLogin,
        openArtistSignup,
        openBuyerSignup,
        closeModals,
      }}
    >
      {children}
      <ArtistLoginModal isOpen={isArtistLoginOpen} onClose={closeModals} />
      <BuyerLoginModal isOpen={isBuyerLoginOpen} onClose={closeModals} />
      <ArtistSignupModal isOpen={isArtistSignupOpen} onClose={closeModals} />
      <BuyerSignupModal isOpen={isBuyerSignupOpen} onClose={closeModals} />
    </AuthModalContext.Provider>
  );
}
