"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
} from "lucide-react";

// Import your RTK Query hook - adjust the import path based on your file structure
import { useSignupArtistMutation } from "@/services/api/authApi"; // Adjust path as needed

export default function ArtistSignupPage() {
  const router = useRouter();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    // Artist-specific fields
    storeName: "",
    mobile: "",
    businessType: "",
  });

  // RTK Query mutation hook
  const [signupArtist, { isLoading, error, isSuccess }] =
    useSignupArtistMutation();

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
      setStep(2);
      return;
    }

    try {
      // Prepare data according to your Prisma schema
      const artistData = {
        fullName: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        password: formData.password,
        storeName: formData.storeName,
        mobile: formData.mobile,
        businessType: formData.businessType,
        termsAgreed: true, // Since they checked the terms checkbox
      };

      // Send data using RTK Query mutation
      const result = await signupArtist(artistData).unwrap();

      console.log("Artist signup successful:", result);

      // Redirect to dashboard on success
      router.push("/Artist/login");
    } catch (err) {
      console.error("Artist signup failed:", err);
      // Error handling is managed by RTK Query state
    }
  };

  const goBack = () => {
    setStep(1);
  };

  // Handle success state change
  useEffect(() => {
    if (isSuccess) {
      router.push("/Artist/login");
    }
  }, [isSuccess, router]);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left side - Signup Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-md">
          <div className="bg-white py-8 px-6 shadow-sm border border-gray-200">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                {step === 2 && (
                  <button
                    onClick={goBack}
                    className="mr-3 p-1 rounded hover:bg-gray-100 transition-colors duration-200"
                    aria-label="Go back"
                    disabled={isLoading}
                  >
                    <ChevronLeft size={20} />
                  </button>
                )}
                <h2 className="text-3xl font-bold text-gray-900">
                  {step === 1
                    ? "Create artist account"
                    : "Complete your profile"}
                </h2>
              </div>
              <p className="mt-2 text-gray-600">
                {step === 1
                  ? "Join AADIVAEARTH as an artist today"
                  : "Complete your business information"}
              </p>
            </div>

            {/* Display error message if signup fails */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">
                  {"data" in (error as object) && (error as any).data?.message
                    ? (error as any).data.message
                    : "Signup failed. Please try again."}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {step === 1 ? (
                <>
                  {/* Name fields */}
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
                          className="block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-sage-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
                        className="block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-sage-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder="Last name"
                      />
                    </div>
                  </div>

                  {/* Email */}
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
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-sage-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  {/* Password */}
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
                        className="block w-full pl-10 pr-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-sage-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder="Create a password"
                      />
                      <button
                        type="button"
                        onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                        disabled={isLoading}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer disabled:cursor-not-allowed"
                      >
                        {isPasswordVisible ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Must be at least 8 characters
                    </p>
                  </div>

                  {/* Terms checkbox */}
                  <div className="flex items-start">
                    <input
                      id="terms"
                      name="terms"
                      type="checkbox"
                      required
                      disabled={isLoading}
                      className="h-4 w-4 mt-1 text-sage-600 focus:ring-sage-500 border-gray-300 cursor-pointer disabled:cursor-not-allowed"
                    />
                    <label
                      htmlFor="terms"
                      className="ml-2 block text-sm text-gray-700 cursor-pointer"
                    >
                      I agree to the{" "}
                      <Link
                        href="/terms"
                        className="text-sage-600 hover:text-sage-500 font-medium cursor-pointer"
                      >
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link
                        href="/privacy"
                        className="text-sage-600 hover:text-sage-500 font-medium cursor-pointer"
                      >
                        Privacy Policy
                      </Link>
                    </label>
                  </div>
                </>
              ) : (
                <>
                  {/* Artist-specific fields for step 2 */}
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
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-sage-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-sage-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder="Enter your mobile number"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="businessType"
                      className="block text-sm font-medium text-gray-700 mb-1"
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
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-sage-500 appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <option value="">Select business type</option>
                        <option value="individual">Individual Artist</option>
                        <option value="cooperative">Artist Cooperative</option>
                        <option value="family_business">Family Business</option>
                        <option value="small_enterprise">
                          Small Enterprise
                        </option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {/* Submit button */}
              <div className="flex gap-3">
                {step === 2 && (
                  <button
                    type="button"
                    onClick={goBack}
                    disabled={isLoading}
                    className="flex-1 flex justify-center py-3 px-4 border border-sage-600 text-sm font-medium text-sage-600 bg-white hover:bg-sage-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sage-500 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Back
                  </button>
                )}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium text-white bg-sage-600 hover:bg-sage-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sage-500 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                <Link
                  href="/Artist/login"
                  className="font-medium text-sage-600 hover:text-sage-500 cursor-pointer"
                >
                  Sign in to your artist account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Branding */}
      <div className="hidden lg:flex lg:w-3/5 bg-sage-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-sage-700 opacity-10"></div>
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <div className="max-w-md">
            <h1 className="text-4xl font-bold mb-4">
              AADIVAA<span className="font-light">EARTH</span>
            </h1>
            <p className="text-xl text-sage-100 mb-8">
              Share your authentic crafts with the world
            </p>
            <div className="space-y-4 text-sage-100">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-terracotta-300 mr-3"></div>
                <span>Showcase your traditional crafts</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-clay-300 mr-3"></div>
                <span>Connect with global customers</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-sage-300 mr-3"></div>
                <span>Preserve cultural heritage</span>
              </div>
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-terracotta-500 opacity-20"></div>
        <div className="absolute top-1/4 left-8 w-16 h-16 bg-clay-400 opacity-30"></div>
      </div>
    </div>
  );
}
