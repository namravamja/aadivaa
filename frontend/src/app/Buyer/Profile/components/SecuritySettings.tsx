"use client";

import type React from "react";

import { useState } from "react";
import { Eye, Shield, Lock, Check, X } from "lucide-react";
import { useUpdateBuyerMutation } from "@/services/api/buyerApi";
import { toast } from "react-hot-toast";

export default function SecuritySettings() {
  const [updateBuyer, { isLoading }] = useUpdateBuyerMutation();

  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [showChangeConfirm, setShowChangeConfirm] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [errors, setErrors] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Password strength validation
  const getPasswordStrength = (password: string) => {
    let score = 0;
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      numbers: /\d/.test(password),
      symbols: /[^A-Za-z0-9]/.test(password),
    };

    Object.values(checks).forEach((check) => {
      if (check) score++;
    });

    return { score, checks };
  };

  const validatePasswords = () => {
    const newErrors = {
      current: "",
      new: "",
      confirm: "",
    };

    if (!passwords.current.trim()) {
      newErrors.current = "Current password is required";
    }

    if (!passwords.new.trim()) {
      newErrors.new = "New password is required";
    } else {
      const strength = getPasswordStrength(passwords.new);
      if (strength.score < 3) {
        newErrors.new =
          "Password is too weak. Please include more character types.";
      }
    }

    if (!passwords.confirm.trim()) {
      newErrors.confirm = "Please confirm your new password";
    } else if (passwords.new !== passwords.confirm) {
      newErrors.confirm = "Passwords do not match";
    }

    if (passwords.current === passwords.new && passwords.current.trim()) {
      newErrors.new = "New password must be different from current password";
    }

    setErrors(newErrors);
    return !newErrors.current && !newErrors.new && !newErrors.confirm;
  };

  const hasFormData = () => {
    return passwords.current || passwords.new || passwords.confirm;
  };

  const handlePasswordChange = async () => {
    if (!validatePasswords()) {
      setShowChangeConfirm(false);
      return;
    }

    try {
      await updateBuyer({
        passwordChange: passwords,
      }).unwrap();

      // Reset form
      setPasswords({
        current: "",
        new: "",
        confirm: "",
      });
      setErrors({
        current: "",
        new: "",
        confirm: "",
      });
      setShowPasswordChange(false);
      setShowChangeConfirm(false);

      toast.success("Password changed successfully!");
    } catch (error: any) {
      console.error("Failed to change password:", error);

      let errorMessage = "Failed to change password. Please try again.";

      if (error?.data?.message) {
        errorMessage = error.data.message;
        if (error.data.message.includes("current password")) {
          setErrors((prev) => ({
            ...prev,
            current: "Current password is incorrect",
          }));
        }
      } else if (error?.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
      setShowChangeConfirm(false);
    }
  };

  const handleCancel = () => {
    if (hasFormData()) {
      setShowCancelConfirm(true);
    } else {
      performCancel();
    }
  };

  const performCancel = () => {
    setShowPasswordChange(false);
    setPasswords({ current: "", new: "", confirm: "" });
    setErrors({ current: "", new: "", confirm: "" });
    setShowPassword({ current: false, new: false, confirm: false });
    setShowCancelConfirm(false);
  };

  const togglePasswordVisibility = (field: keyof typeof showPassword) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validatePasswords()) {
      setShowChangeConfirm(true);
    }
  };

  const passwordStrength = getPasswordStrength(passwords.new);

  const getStrengthColor = (score: number) => {
    if (score < 2) return "bg-red-500";
    if (score < 4) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStrengthText = (score: number) => {
    if (score < 2) return "Weak";
    if (score < 4) return "Medium";
    return "Strong";
  };

  return (
    <div className="bg-white border border-stone-200 shadow-sm">
      <div className="p-6 border-b border-stone-200">
        <h2 className="text-xl font-semibold text-stone-900 flex items-center">
          <Shield className="w-5 h-5 mr-2 text-stone-500" />
          Security Settings
        </h2>
      </div>

      <div className="p-6">
        {!showPasswordChange ? (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-semibold text-stone-900 mb-1">Password</h3>
                <p className="text-sm text-stone-600">
                  Keep your account secure with a strong password
                </p>
              </div>
              <button
                onClick={() => setShowPasswordChange(true)}
                className="inline-flex items-center px-4 py-2 border border-stone-300 text-stone-700 hover:bg-stone-50 font-medium transition-colors"
              >
                <Lock className="w-4 h-4 mr-2" />
                Change Password
              </button>
            </div>

            <div className="bg-clay-50 border border-clay-200 p-4 rounded-lg">
              <h4 className="font-semibold text-stone-900 mb-3 flex items-center">
                <Shield className="w-4 h-4 mr-2 text-stone-600" />
                Security Tips
              </h4>
              <ul className="text-sm text-stone-600 space-y-2">
                <li className="flex items-start">
                  <Check className="w-4 h-4 mr-2 text-green-600 mt-0.5 flex-shrink-0" />
                  Use a strong, unique password for your account
                </li>
                <li className="flex items-start">
                  <Check className="w-4 h-4 mr-2 text-green-600 mt-0.5 flex-shrink-0" />
                  Include uppercase, lowercase, numbers, and symbols
                </li>
                <li className="flex items-start">
                  <Check className="w-4 h-4 mr-2 text-green-600 mt-0.5 flex-shrink-0" />
                  Avoid using personal information or common words
                </li>
                <li className="flex items-start">
                  <Check className="w-4 h-4 mr-2 text-green-600 mt-0.5 flex-shrink-0" />
                  Change your password regularly (every 3-6 months)
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Change Password Confirmation */}
            {showChangeConfirm && (
              <div className="fixed inset-0  bg-opacity-30 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                  <h3 className="text-lg font-semibold text-stone-900 mb-2">
                    Change Password
                  </h3>
                  <p className="text-stone-600 mb-6">
                    Are you sure you want to change your password? You will need
                    to use the new password for future logins.
                  </p>
                  <div className="flex space-x-3">
                    <button
                      onClick={handlePasswordChange}
                      disabled={isLoading}
                      className="flex-1 bg-terracotta-500 hover:bg-terracotta-600 disabled:bg-terracotta-300 disabled:cursor-not-allowed text-white px-4 py-2 font-medium transition-colors cursor-pointer"
                    >
                      {isLoading ? "Changing..." : "Change Password"}
                    </button>
                    <button
                      onClick={() => setShowChangeConfirm(false)}
                      disabled={isLoading}
                      className="flex-1 border border-stone-300 text-stone-700 hover:bg-stone-50 disabled:opacity-50 px-4 py-2 font-medium transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Cancel Confirmation */}
            {showCancelConfirm && (
              <div className="fixed inset-0  bg-opacity-30 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                  <h3 className="text-lg font-semibold text-stone-900 mb-2">
                    Discard Changes
                  </h3>
                  <p className="text-stone-600 mb-6">
                    You have unsaved password changes. Are you sure you want to
                    discard them?
                  </p>
                  <div className="flex space-x-3">
                    <button
                      onClick={performCancel}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 font-medium transition-colors"
                    >
                      Discard Changes
                    </button>
                    <button
                      onClick={() => setShowCancelConfirm(false)}
                      className="flex-1 border border-stone-300 text-stone-700 hover:bg-stone-50 px-4 py-2 font-medium transition-colors"
                    >
                      Keep Editing
                    </button>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-stone-900">
                  Change Password
                </h3>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="p-2 text-stone-400 hover:text-stone-600 transition-colors disabled:opacity-50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Current Password */}
              <div>
                <label
                  htmlFor="currentPassword"
                  className="block text-sm font-medium text-stone-700 mb-2"
                >
                  Current Password *
                </label>
                <div className="relative">
                  <input
                    id="currentPassword"
                    type={showPassword.current ? "text" : "password"}
                    value={passwords.current}
                    onChange={(e) => {
                      setPasswords((prev) => ({
                        ...prev,
                        current: e.target.value,
                      }));
                      if (errors.current)
                        setErrors((prev) => ({ ...prev, current: "" }));
                    }}
                    disabled={isLoading}
                    className={`w-full px-3 py-2 pr-10 border ${
                      errors.current ? "border-red-500" : "border-stone-300"
                    } focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent transition-colors disabled:bg-stone-50 disabled:text-stone-500`}
                    placeholder="Enter your current password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("current")}
                    disabled={isLoading}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600 disabled:opacity-50"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
                {errors.current && (
                  <p className="mt-1 text-sm text-red-600">{errors.current}</p>
                )}
              </div>

              {/* New Password */}
              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-stone-700 mb-2"
                >
                  New Password *
                </label>
                <div className="relative">
                  <input
                    id="newPassword"
                    type={showPassword.new ? "text" : "password"}
                    value={passwords.new}
                    onChange={(e) => {
                      setPasswords((prev) => ({
                        ...prev,
                        new: e.target.value,
                      }));
                      if (errors.new)
                        setErrors((prev) => ({ ...prev, new: "" }));
                    }}
                    disabled={isLoading}
                    className={`w-full px-3 py-2 pr-10 border ${
                      errors.new ? "border-red-500" : "border-stone-300"
                    } focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent transition-colors disabled:bg-stone-50 disabled:text-stone-500`}
                    placeholder="Enter your new password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("new")}
                    disabled={isLoading}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600 disabled:opacity-50"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {passwords.new && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-stone-600">
                        Password strength:
                      </span>
                      <span
                        className={`text-xs font-medium ${
                          passwordStrength.score < 2
                            ? "text-red-600"
                            : passwordStrength.score < 4
                            ? "text-yellow-600"
                            : "text-green-600"
                        }`}
                      >
                        {getStrengthText(passwordStrength.score)}
                      </span>
                    </div>
                    <div className="w-full bg-stone-200 h-1.5">
                      <div
                        className={`h-1.5 transition-all duration-300 ${getStrengthColor(
                          passwordStrength.score
                        )}`}
                        style={{
                          width: `${(passwordStrength.score / 5) * 100}%`,
                        }}
                      ></div>
                    </div>

                    {/* Password Requirements */}
                    <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs">
                      <div
                        className={`flex items-center ${
                          passwordStrength.checks.length
                            ? "text-green-600"
                            : "text-stone-400"
                        }`}
                      >
                        <div
                          className={`w-1 h-1 mr-2 ${
                            passwordStrength.checks.length
                              ? "bg-green-600"
                              : "bg-stone-400"
                          }`}
                        ></div>
                        8+ characters
                      </div>
                      <div
                        className={`flex items-center ${
                          passwordStrength.checks.uppercase
                            ? "text-green-600"
                            : "text-stone-400"
                        }`}
                      >
                        <div
                          className={`w-1 h-1 mr-2 ${
                            passwordStrength.checks.uppercase
                              ? "bg-green-600"
                              : "bg-stone-400"
                          }`}
                        ></div>
                        Uppercase letter
                      </div>
                      <div
                        className={`flex items-center ${
                          passwordStrength.checks.lowercase
                            ? "text-green-600"
                            : "text-stone-400"
                        }`}
                      >
                        <div
                          className={`w-1 h-1 mr-2 ${
                            passwordStrength.checks.lowercase
                              ? "bg-green-600"
                              : "bg-stone-400"
                          }`}
                        ></div>
                        Lowercase letter
                      </div>
                      <div
                        className={`flex items-center ${
                          passwordStrength.checks.numbers
                            ? "text-green-600"
                            : "text-stone-400"
                        }`}
                      >
                        <div
                          className={`w-1 h-1 mr-2 ${
                            passwordStrength.checks.numbers
                              ? "bg-green-600"
                              : "bg-stone-400"
                          }`}
                        ></div>
                        Number
                      </div>
                      <div
                        className={`flex items-center ${
                          passwordStrength.checks.symbols
                            ? "text-green-600"
                            : "text-stone-400"
                        }`}
                      >
                        <div
                          className={`w-1 h-1 mr-2 ${
                            passwordStrength.checks.symbols
                              ? "bg-green-600"
                              : "bg-stone-400"
                          }`}
                        ></div>
                        Special character
                      </div>
                    </div>
                  </div>
                )}

                {errors.new && (
                  <p className="mt-1 text-sm text-red-600">{errors.new}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-stone-700 mb-2"
                >
                  Confirm New Password *
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showPassword.confirm ? "text" : "password"}
                    value={passwords.confirm}
                    onChange={(e) => {
                      setPasswords((prev) => ({
                        ...prev,
                        confirm: e.target.value,
                      }));
                      if (errors.confirm)
                        setErrors((prev) => ({ ...prev, confirm: "" }));
                    }}
                    disabled={isLoading}
                    className={`w-full px-3 py-2 pr-10 border ${
                      errors.confirm ? "border-red-500" : "border-stone-300"
                    } focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent transition-colors disabled:bg-stone-50 disabled:text-stone-500`}
                    placeholder="Confirm your new password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("confirm")}
                    disabled={isLoading}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600 disabled:opacity-50"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
                {errors.confirm && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirm}</p>
                )}
                {passwords.confirm && passwords.new === passwords.confirm && (
                  <p className="mt-1 text-sm text-green-600 flex items-center">
                    <Check className="w-4 h-4 mr-1" />
                    Passwords match
                  </p>
                )}
              </div>

              <div className="flex space-x-3 pt-4 border-t border-stone-200">
                <button
                  type="submit"
                  disabled={
                    isLoading ||
                    !passwords.current ||
                    !passwords.new ||
                    !passwords.confirm ||
                    passwordStrength.score < 3
                  }
                  className="bg-terracotta-500 hover:bg-terracotta-600 disabled:bg-terracotta-300 disabled:cursor-not-allowed text-white px-6 py-2 font-medium transition-colors cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 mr-2 inline-block animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Updating Password...
                    </>
                  ) : (
                    "Update Password"
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="border border-stone-300 text-stone-700 hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-2 font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
