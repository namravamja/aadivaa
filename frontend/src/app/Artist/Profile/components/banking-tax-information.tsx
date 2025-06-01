"use client";

import { useState } from "react";
import { CreditCard, Building, FileText } from "lucide-react";

interface BankingTaxData {
  bankAccountName: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  upiId: string;
  gstNumber: string;
  panNumber: string;
}

interface BankingTaxInformationProps {
  isEditing: boolean;
  onDataChange: (data: BankingTaxData) => void;
}

export default function BankingTaxInformation({
  isEditing,
  onDataChange,
}: BankingTaxInformationProps) {
  const [data, setData] = useState<BankingTaxData>({
    bankAccountName: "John Smith",
    bankName: "Craft Credit Union",
    accountNumber: "XXXX4567",
    ifscCode: "CCU12345",
    upiId: "johnsmith@upi",
    gstNumber: "GST9876543210",
    panNumber: "ABCDE1234F",
  });

  const handleInputChange = <K extends keyof BankingTaxData>(
    field: K,
    value: BankingTaxData[K]
  ) => {
    const newData = { ...data, [field]: value };
    setData(newData);
    onDataChange(newData);
  };

  return (
    <div className="bg-white border border-stone-200 shadow-sm">
      <div className="p-6 border-b border-stone-200">
        <h2 className="text-xl font-medium text-stone-900 flex items-center">
          <CreditCard className="w-5 h-5 mr-2" />
          Banking & Tax Information
        </h2>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Banking Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-stone-700 flex items-center mb-4">
              <Building className="w-4 h-4 mr-2" />
              Banking Details
            </h3>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Account Holder Name *
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={data.bankAccountName}
                  onChange={(e) =>
                    handleInputChange("bankAccountName", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-stone-300 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent transition-colors"
                  placeholder="Enter account holder name"
                />
              ) : (
                <p className="text-stone-600 py-2">{data.bankAccountName}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Bank Name *
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={data.bankName}
                  onChange={(e) =>
                    handleInputChange("bankName", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-stone-300 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent transition-colors"
                  placeholder="Enter bank name"
                />
              ) : (
                <p className="text-stone-600 py-2">{data.bankName}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Account Number *
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={data.accountNumber}
                  onChange={(e) =>
                    handleInputChange("accountNumber", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-stone-300 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent transition-colors"
                  placeholder="Enter account number"
                />
              ) : (
                <p className="text-stone-600 py-2">{data.accountNumber}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                IFSC Code *
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={data.ifscCode}
                  onChange={(e) =>
                    handleInputChange("ifscCode", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-stone-300 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent transition-colors"
                  placeholder="Enter IFSC code"
                />
              ) : (
                <p className="text-stone-600 py-2">{data.ifscCode}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                UPI ID
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={data.upiId}
                  onChange={(e) => handleInputChange("upiId", e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent transition-colors"
                  placeholder="Enter UPI ID"
                />
              ) : (
                <p className="text-stone-600 py-2">{data.upiId}</p>
              )}
            </div>
          </div>

          {/* Tax Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-stone-700 flex items-center mb-4">
              <FileText className="w-4 h-4 mr-2" />
              Tax Details
            </h3>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                GST Number
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={data.gstNumber}
                  onChange={(e) =>
                    handleInputChange("gstNumber", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-stone-300 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent transition-colors"
                  placeholder="Enter GST number"
                />
              ) : (
                <p className="text-stone-600 py-2">{data.gstNumber}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                PAN Number *
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={data.panNumber}
                  onChange={(e) =>
                    handleInputChange("panNumber", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-stone-300 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent transition-colors"
                  placeholder="Enter PAN number"
                />
              ) : (
                <p className="text-stone-600 py-2">{data.panNumber}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
