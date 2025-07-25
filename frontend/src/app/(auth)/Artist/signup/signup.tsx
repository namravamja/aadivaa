"use client";

import type React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  ArrowRight,
  User,
  Mail,
  Lock,
  Store,
  Phone,
  ChevronLeft,
  Building,
  Loader2,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

import { useSignupArtistMutation } from "@/services/api/authApi";
import { useAuthModal } from "@/app/(auth)/components/auth-modal-provider";

interface ArtistSignupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ArtistSignupModal({
  isOpen,
  onClose,
}: ArtistSignupModalProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    storeName: "",
    mobile: "",
    businessType: "",
  });

  const [signupArtist, { isLoading }] = useSignupArtistMutation();
  const { openArtistLogin } = useAuthModal();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step === 1) {
      if (!formData.firstName.trim()) {
        toast.error("First name is required");
        return;
      }
      if (!formData.lastName.trim()) {
        toast.error("Last name is required");
        return;
      }
      if (!formData.email.trim()) {
        toast.error("Email is required");
        return;
      }
      if (!formData.password) {
        toast.error("Password is required");
        return;
      }

      setStep(2);
      return;
    }

    if (!formData.storeName.trim()) {
      toast.error("Store name is required");
      return;
    }
    if (!formData.mobile.trim()) {
      toast.error("Mobile number is required");
      return;
    }
    if (!formData.businessType) {
      toast.error("Business type is required");
      return;
    }

    try {
      const artistData = {
        fullName: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        storeName: formData.storeName.trim(),
        mobile: formData.mobile.trim(),
        businessType: formData.businessType,
        termsAgreed: true,
      };

      await signupArtist(artistData).unwrap();
      toast.success("Signup done, Check Verification mail sent successfully!");
      onClose();
      openArtistLogin();
    } catch (err: any) {
      const errorMessage =
        err?.data?.message || err?.message || "Signup failed. Please try again";
      toast.error(errorMessage);
    }
  };

  const goBack = () => {
    setStep(1);
  };

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        storeName: "",
        mobile: "",
        businessType: "",
      });
      setIsPasswordVisible(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-none transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 cursor-pointer right-4 text-gray-400 hover:text-gray-600 transition-colors z-10 p-1 rounded-full hover:bg-gray-100"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-6">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              {step === 2 && (
                <button
                  onClick={goBack}
                  className="mr-3 p-1 rounded hover:bg-gray-100  transition-colors duration-200"
                  disabled={isLoading}
                >
                  <ChevronLeft size={20} />
                </button>
              )}
              <h2 className="text-3xl mt-3 font-bold text-gray-900">
                {step === 1 ? "Create artist account" : "Complete your profile"}
              </h2>
            </div>
            <p className=" text-gray-600">
              {step === 1
                ? "Join AADIVAEARTH as an artist today"
                : "Complete your business information"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      First name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={handleChange}
                        disabled={isLoading}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-sage-500 disabled:opacity-50"
                        placeholder="First name"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Last name
                    </label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      disabled={isLoading}
                      className="block w-full px-3 py-3 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-sage-500 disabled:opacity-50"
                      placeholder="Last name"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      disabled={isLoading}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-sage-500 disabled:opacity-50"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={isPasswordVisible ? "text" : "password"}
                      required
                      value={formData.password}
                      onChange={handleChange}
                      disabled={isLoading}
                      className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-sage-500 disabled:opacity-50"
                      placeholder="Create a password"
                    />
                    <button
                      type="button"
                      onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                      disabled={isLoading}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {isPasswordVisible ? (
                        <EyeOff className="h-5 w-5 cursor-pointer" />
                      ) : (
                        <Eye className="h-5 w-5 cursor-pointer" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-start">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    required
                    disabled={isLoading}
                    className="h-4 w-4 mt-1 text-sage-600 focus:ring-sage-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="terms"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    I agree to the{" "}
                    <Link
                      href="/terms"
                      className="text-sage-600 hover:text-sage-500 font-medium"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy"
                      className="text-sage-600 hover:text-sage-500 font-medium"
                    >
                      Privacy Policy
                    </Link>
                  </label>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label
                    htmlFor="storeName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Store Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Store className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="storeName"
                      name="storeName"
                      type="text"
                      required
                      value={formData.storeName}
                      onChange={handleChange}
                      disabled={isLoading}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-sage-500 disabled:opacity-50"
                      placeholder="Enter your store name"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="mobile"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Mobile Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="mobile"
                      name="mobile"
                      type="tel"
                      required
                      value={formData.mobile}
                      onChange={handleChange}
                      disabled={isLoading}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-sage-500 disabled:opacity-50"
                      placeholder="Enter your mobile number"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="businessType"
                    className="block text-sm font-medium cursor-pointer text-gray-700 mb-1"
                  >
                    Business Type
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Building className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      id="businessType"
                      name="businessType"
                      required
                      value={formData.businessType}
                      onChange={handleChange}
                      disabled={isLoading}
                      className="block cursor-pointer w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-sage-500 appearance-none disabled:opacity-50"
                    >
                      <option value="">Select business type</option>
                      <option value="individual">Individual Artist</option>
                      <option value="cooperative">Artist Cooperative</option>
                      <option value="family_business">Family Business</option>
                      <option value="small_enterprise">Small Enterprise</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            <div className="flex gap-3">
              {step === 2 && (
                <button
                  type="button"
                  onClick={goBack}
                  disabled={isLoading}
                  className="flex-1 flex justify-center py-3 px-4 border border-sage-600 rounded-md text-sm font-medium text-sage-600 bg-white hover:bg-sage-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sage-500 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Back
                </button>
              )}
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 flex justify-center items-center py-3 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-sage-600 hover:bg-sage-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sage-500 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {step === 1 ? "Next" : "Creating Account..."}
                  </>
                ) : (
                  <>
                    {step === 1 ? "Next" : "Create Account"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Already have an account?
                </span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  onClose();
                  openArtistLogin();
                }}
                className="font-medium text-sage-600 cursor-pointer hover:text-sage-500"
              >
                Sign in to your artist account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
