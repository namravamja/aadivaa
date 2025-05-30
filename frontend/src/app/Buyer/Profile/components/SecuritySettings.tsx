"use client";

import { useState } from "react";
import { Eye, Shield } from "lucide-react";

interface SecuritySettingsProps {
  onPasswordChange: (passwords: {
    current: string;
    new: string;
    confirm: string;
  }) => void;
  isLoading: boolean;
}

export default function SecuritySettings({
  onPasswordChange,
  isLoading,
}: SecuritySettingsProps) {
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const handlePasswordChange = async () => {
    if (passwords.new !== passwords.confirm) {
      alert("New passwords don't match");
      return;
    }

    if (passwords.new.length < 8) {
      alert("Password must be at least 8 characters long");
      return;
    }

    try {
      await onPasswordChange(passwords);
      setPasswords({ current: "", new: "", confirm: "" });
      setShowPasswordChange(false);
    } catch (error) {
      console.error("Failed to change password:", error);
    }
  };

  const handleCancel = () => {
    setShowPasswordChange(false);
    setPasswords({ current: "", new: "", confirm: "" });
  };

  return (
    <div className="bg-white border border-stone-200 shadow-sm">
      <div className="p-6 border-b border-stone-200">
        <h2 className="text-xl font-medium text-stone-900 flex items-center">
          <Shield className="w-5 h-5 mr-2" />
          Security Settings
        </h2>
      </div>

      <div className="p-6">
        {!showPasswordChange ? (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-medium text-stone-900">Password</h3>
                <p className="text-sm text-stone-600">
                  Last updated 3 months ago
                </p>
              </div>
              <button
                onClick={() => setShowPasswordChange(true)}
                className="border border-stone-300 text-stone-700 hover:bg-stone-50 px-4 py-2 font-medium transition-colors"
              >
                <Eye className="w-4 h-4 mr-2 inline" />
                Change Password
              </button>
            </div>

            <div className="bg-stone-50 p-4">
              <h4 className="font-medium text-stone-900 mb-2">Security Tips</h4>
              <ul className="text-sm text-stone-600 space-y-1">
                <li>• Use a strong, unique password</li>
                <li>• Include uppercase, lowercase, numbers, and symbols</li>
                <li>• Avoid using personal information</li>
                <li>• Change your password regularly</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label
                htmlFor="currentPassword"
                className="block text-sm font-medium text-stone-700 mb-1"
              >
                Current Password *
              </label>
              <input
                id="currentPassword"
                type="password"
                value={passwords.current}
                onChange={(e) =>
                  setPasswords((prev) => ({ ...prev, current: e.target.value }))
                }
                className="w-full px-3 py-2 border border-stone-300 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent"
                placeholder="Enter your current password"
              />
            </div>

            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-stone-700 mb-1"
              >
                New Password *
              </label>
              <input
                id="newPassword"
                type="password"
                value={passwords.new}
                onChange={(e) =>
                  setPasswords((prev) => ({ ...prev, new: e.target.value }))
                }
                className="w-full px-3 py-2 border border-stone-300 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent"
                placeholder="Enter your new password"
              />
              <p className="text-xs text-stone-500 mt-1">
                Must be at least 8 characters long
              </p>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-stone-700 mb-1"
              >
                Confirm New Password *
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={passwords.confirm}
                onChange={(e) =>
                  setPasswords((prev) => ({ ...prev, confirm: e.target.value }))
                }
                className="w-full px-3 py-2 border border-stone-300 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent"
                placeholder="Confirm your new password"
              />
            </div>

            <div className="flex space-x-2 pt-4 border-t border-stone-200">
              <button
                onClick={handlePasswordChange}
                disabled={
                  isLoading ||
                  !passwords.current ||
                  !passwords.new ||
                  !passwords.confirm
                }
                className="bg-terracotta-600 hover:bg-terracotta-700 text-white px-4 py-2 font-medium transition-colors disabled:opacity-50"
              >
                Update Password
              </button>
              <button
                onClick={handleCancel}
                className="border border-stone-300 text-stone-700 hover:bg-stone-50 px-4 py-2 font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
