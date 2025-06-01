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

  const [formErrors, setFormErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    storeName: "",
    mobile: "",
    businessType: "",
  });
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
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

    // Real-time validation
    const newErrors = { ...formErrors };

    switch (name) {
      case "firstName":
      case "lastName":
        newErrors[name] =
          value.trim().length < 2
            ? `${
                name === "firstName" ? "First" : "Last"
              } name must be at least 2 characters`
            : "";
        break;
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        newErrors.email = !emailRegex.test(value)
          ? "Please enter a valid email address"
          : "";
        break;
      case "password":
        const strength = {
          length: value.length >= 8,
          uppercase: /[A-Z]/.test(value),
          lowercase: /[a-z]/.test(value),
          number: /\d/.test(value),
        };
        setPasswordStrength(strength);
        const missingRequirements = [];
        if (!strength.length) missingRequirements.push("8 characters");
        if (!strength.uppercase) missingRequirements.push("uppercase letter");
        if (!strength.lowercase) missingRequirements.push("lowercase letter");
        if (!strength.number) missingRequirements.push("number");
        newErrors.password =
          missingRequirements.length > 0
            ? `Password must contain: ${missingRequirements.join(", ")}`
            : "";
        break;
      case "storeName":
        newErrors.storeName =
          value.trim().length < 2
            ? "Store name must be at least 2 characters"
            : "";
        break;
      case "mobile":
        const phoneRegex = /^\+?[\d\s-()]{10,}$/;
        newErrors.mobile = !phoneRegex.test(value)
          ? "Please enter a valid mobile number"
          : "";
        break;
      case "businessType":
        newErrors.businessType = !value ? "Please select a business type" : "";
        break;
    }

    setFormErrors(newErrors);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step === 1) {
      // Validate step 1 fields
      const hasErrors =
        formErrors.firstName ||
        formErrors.lastName ||
        formErrors.email ||
        formErrors.password ||
        !formData.firstName.trim() ||
        !formData.lastName.trim() ||
        !formData.email.trim() ||
        !formData.password ||
        !passwordStrength.length ||
        !passwordStrength.uppercase ||
        !passwordStrength.lowercase ||
        !passwordStrength.number;

      if (hasErrors) {
        // Trigger validation display
        setFormErrors((prev) => ({
          ...prev,
          firstName: !formData.firstName.trim()
            ? "First name is required"
            : prev.firstName,
          lastName: !formData.lastName.trim()
            ? "Last name is required"
            : prev.lastName,
          email: !formData.email.trim() ? "Email is required" : prev.email,
          password: !formData.password ? "Password is required" : prev.password,
        }));
        return;
      }
      setStep(2);
      return;
    }

    // Validate step 2 fields
    const hasStep2Errors =
      formErrors.storeName ||
      formErrors.mobile ||
      formErrors.businessType ||
      !formData.storeName.trim() ||
      !formData.mobile.trim() ||
      !formData.businessType;

    if (hasStep2Errors) {
      setFormErrors((prev) => ({
        ...prev,
        storeName: !formData.storeName.trim()
          ? "Store name is required"
          : prev.storeName,
        mobile: !formData.mobile.trim()
          ? "Mobile number is required"
          : prev.mobile,
        businessType: !formData.businessType
          ? "Business type is required"
          : prev.businessType,
      }));
      return;
    }

    try {
      // Prepare data according to your Prisma schema
      const artistData = {
        fullName: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        storeName: formData.storeName.trim(),
        mobile: formData.mobile.trim(),
        businessType: formData.businessType,
        termsAgreed: true, // Since they checked the terms checkbox
      };

      // Send data using RTK Query mutation
      const result = await signupArtist(artistData).unwrap();

      // Redirect to login on success
      router.push("/Artist/login");
    } catch (err) {
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
                  {(() => {
                    if ("status" in error) {
                      if (error.status === 409) {
                        return "An account with this email already exists. Please use a different email or try logging in.";
                      }
                      if (error.status === 400) {
                        return "Invalid information provided. Please check your details and try again.";
                      }
                      if (error.status === 429) {
                        return "Too many signup attempts. Please wait a few minutes before trying again.";
                      }
                      if (error.status === 500) {
                        return "Server error. Please try again later.";
                      }
                      if (error.status === "FETCH_ERROR") {
                        return "Network error. Please check your internet connection and try again.";
                      }
                      if (error.status === "TIMEOUT_ERROR") {
                        return "Request timed out. Please try again.";
                      }
                    }
                    if (
                      "data" in error &&
                      typeof error.data === "object" &&
                      error.data &&
                      "message" in error.data
                    ) {
                      return (
                        (error.data as { message?: string }).message ||
                        "Signup failed. Please try again."
                      );
                    }
                    return "Signup failed. Please try again.";
                  })()}
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
                          className={`block w-full pl-10 pr-3 py-3 border placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-sage-500 disabled:opacity-50 disabled:cursor-not-allowed ${
                            formErrors.firstName
                              ? "border-red-300 bg-red-50"
                              : error
                              ? "border-red-300 bg-red-50"
                              : "border-gray-300"
                          }`}
                          placeholder="First name"
                        />
                      </div>
                      {formErrors.firstName && (
                        <p className="mt-1 text-xs text-red-600">
                          {formErrors.firstName}
                        </p>
                      )}
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
                        className={`block w-full px-3 py-3 border placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-sage-500 disabled:opacity-50 disabled:cursor-not-allowed ${
                          formErrors.lastName
                            ? "border-red-300 bg-red-50"
                            : error
                            ? "border-red-300 bg-red-50"
                            : "border-gray-300"
                        }`}
                        placeholder="Last name"
                      />
                      {formErrors.lastName && (
                        <p className="mt-1 text-xs text-red-600">
                          {formErrors.lastName}
                        </p>
                      )}
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
                        className={`block w-full pl-10 pr-3 py-3 border placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-sage-500 disabled:opacity-50 disabled:cursor-not-allowed ${
                          formErrors.email
                            ? "border-red-300 bg-red-50"
                            : error
                            ? "border-red-300 bg-red-50"
                            : "border-gray-300"
                        }`}
                        placeholder="Enter your email"
                      />
                    </div>
                    {formErrors.email && (
                      <p className="mt-1 text-xs text-red-600">
                        {formErrors.email}
                      </p>
                    )}
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
                        className={`block w-full pl-10 pr-10 py-3 border placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-sage-500 disabled:opacity-50 disabled:cursor-not-allowed ${
                          formErrors.password
                            ? "border-red-300 bg-red-50"
                            : error
                            ? "border-red-300 bg-red-50"
                            : "border-gray-300"
                        }`}
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

                    {/* Password strength indicator */}
                    {formData.password && (
                      <div className="mt-2 space-y-1">
                        <div className="flex space-x-1">
                          <div
                            className={`h-1 flex-1 rounded ${
                              passwordStrength.length
                                ? "bg-green-500"
                                : "bg-gray-200"
                            }`}
                          ></div>
                          <div
                            className={`h-1 flex-1 rounded ${
                              passwordStrength.uppercase
                                ? "bg-green-500"
                                : "bg-gray-200"
                            }`}
                          ></div>
                          <div
                            className={`h-1 flex-1 rounded ${
                              passwordStrength.lowercase
                                ? "bg-green-500"
                                : "bg-gray-200"
                            }`}
                          ></div>
                          <div
                            className={`h-1 flex-1 rounded ${
                              passwordStrength.number
                                ? "bg-green-500"
                                : "bg-gray-200"
                            }`}
                          ></div>
                        </div>
                        <div className="text-xs space-y-1">
                          <div
                            className={`flex items-center ${
                              passwordStrength.length
                                ? "text-green-600"
                                : "text-gray-500"
                            }`}
                          >
                            <span className="mr-1">
                              {passwordStrength.length ? "✓" : "○"}
                            </span>
                            At least 8 characters
                          </div>
                          <div
                            className={`flex items-center ${
                              passwordStrength.uppercase
                                ? "text-green-600"
                                : "text-gray-500"
                            }`}
                          >
                            <span className="mr-1">
                              {passwordStrength.uppercase ? "✓" : "○"}
                            </span>
                            One uppercase letter
                          </div>
                          <div
                            className={`flex items-center ${
                              passwordStrength.lowercase
                                ? "text-green-600"
                                : "text-gray-500"
                            }`}
                          >
                            <span className="mr-1">
                              {passwordStrength.lowercase ? "✓" : "○"}
                            </span>
                            One lowercase letter
                          </div>
                          <div
                            className={`flex items-center ${
                              passwordStrength.number
                                ? "text-green-600"
                                : "text-gray-500"
                            }`}
                          >
                            <span className="mr-1">
                              {passwordStrength.number ? "✓" : "○"}
                            </span>
                            One number
                          </div>
                        </div>
                      </div>
                    )}

                    {formErrors.password && (
                      <p className="mt-1 text-xs text-red-600">
                        {formErrors.password}
                      </p>
                    )}
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
                        className={`block w-full pl-10 pr-3 py-3 border placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-sage-500 disabled:opacity-50 disabled:cursor-not-allowed ${
                          formErrors.storeName
                            ? "border-red-300 bg-red-50"
                            : error
                            ? "border-red-300 bg-red-50"
                            : "border-gray-300"
                        }`}
                        placeholder="Enter your store name"
                      />
                    </div>
                    {formErrors.storeName && (
                      <p className="mt-1 text-xs text-red-600">
                        {formErrors.storeName}
                      </p>
                    )}
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
                        className={`block w-full pl-10 pr-3 py-3 border placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-sage-500 disabled:opacity-50 disabled:cursor-not-allowed ${
                          formErrors.mobile
                            ? "border-red-300 bg-red-50"
                            : error
                            ? "border-red-300 bg-red-50"
                            : "border-gray-300"
                        }`}
                        placeholder="Enter your mobile number"
                      />
                    </div>
                    {formErrors.mobile && (
                      <p className="mt-1 text-xs text-red-600">
                        {formErrors.mobile}
                      </p>
                    )}
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
                        className={`block w-full pl-10 pr-3 py-3 border placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-sage-500 appearance-none disabled:opacity-50 disabled:cursor-not-allowed ${
                          formErrors.businessType
                            ? "border-red-300 bg-red-50"
                            : error
                            ? "border-red-300 bg-red-50"
                            : "border-gray-300"
                        }`}
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
                    {formErrors.businessType && (
                      <p className="mt-1 text-xs text-red-600">
                        {formErrors.businessType}
                      </p>
                    )}
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
