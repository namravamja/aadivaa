"use client";

import type React from "react";

import { Shield, Lock, Check } from "lucide-react";
import { useAuthModal } from "@/app/(auth)/components/auth-modal-provider";

export default function SecuritySettings() {
  const { openForgotPassword } = useAuthModal();

  const handleChangePassword = () => {
    openForgotPassword("buyer");
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
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-stone-900 mb-1">Password</h3>
              <p className="text-sm text-stone-600">
                Keep your account secure with a strong password
              </p>
            </div>
            <button
              onClick={handleChangePassword}
              className="inline-flex items-center px-4 py-2 border border-stone-300 text-stone-700 hover:bg-stone-50 font-medium transition-colors cursor-pointer"
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
      </div>
    </div>
  );
}
