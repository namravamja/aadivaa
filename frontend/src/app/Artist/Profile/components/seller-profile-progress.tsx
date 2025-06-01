interface SellerProfileProgressProps {
  profileData: {
    basicInfo: {
      fullName?: string;
      storeName?: string;
      email?: string;
      mobile?: string;
      businessType?: string;
      businessRegistrationNumber?: string;
      productCategories?: string[];
    };
    addressInfo: {
      businessAddress?: {
        street?: string;
        city?: string;
        state?: string;
        country?: string;
        pinCode?: string;
      };
      warehouseAddress?: {
        sameAsBusiness?: boolean;
        street?: string;
        city?: string;
        state?: string;
        country?: string;
        pinCode?: string;
      };
    };
    bankingTaxInfo: {
      bankAccountName?: string;
      bankName?: string;
      accountNumber?: string;
      ifscCode?: string;
      panNumber?: string;
      gstNumber?: string;
      upiId?: string;
    };
    shippingLogisticsInfo: {
      shippingType?: string;
      serviceAreas?: string[];
      inventoryVolume?: string;
      supportContact?: string;
      returnPolicy?: string;
      workingHours?: string;
    };
    socialMediaInfo: {
      website?: string;
      instagram?: string;
      facebook?: string;
      twitter?: string;
    };
  };
}

export default function SellerProfileProgress({
  profileData,
}: SellerProfileProgressProps) {
  const calculateProgress = () => {
    let completed = 0;
    const total = 15; // Total required fields

    // Basic Information (6 required fields)
    if (profileData.basicInfo?.fullName) completed++;
    if (profileData.basicInfo?.storeName) completed++;
    if (profileData.basicInfo?.email) completed++;
    if (profileData.basicInfo?.mobile) completed++;
    if (profileData.basicInfo?.businessType) completed++;
    if (profileData.basicInfo?.productCategories?.length) completed++;

    // Address Information (2 required fields)
    const hasCompleteBusinessAddress =
      profileData.addressInfo?.businessAddress &&
      profileData.addressInfo.businessAddress.street &&
      profileData.addressInfo.businessAddress.city &&
      profileData.addressInfo.businessAddress.state &&
      profileData.addressInfo.businessAddress.country &&
      profileData.addressInfo.businessAddress.pinCode;
    if (hasCompleteBusinessAddress) completed++;

    const hasCompleteWarehouseAddress =
      profileData.addressInfo?.warehouseAddress?.sameAsBusiness ||
      (profileData.addressInfo?.warehouseAddress &&
        profileData.addressInfo.warehouseAddress.street &&
        profileData.addressInfo.warehouseAddress.city &&
        profileData.addressInfo.warehouseAddress.state &&
        profileData.addressInfo.warehouseAddress.country &&
        profileData.addressInfo.warehouseAddress.pinCode);
    if (hasCompleteWarehouseAddress) completed++;

    // Banking & Tax Information (5 required fields)
    if (profileData.bankingTaxInfo?.bankAccountName) completed++;
    if (profileData.bankingTaxInfo?.bankName) completed++;
    if (profileData.bankingTaxInfo?.accountNumber) completed++;
    if (profileData.bankingTaxInfo?.ifscCode) completed++;
    if (profileData.bankingTaxInfo?.panNumber) completed++;

    // Shipping & Logistics (2 required fields)
    if (profileData.shippingLogisticsInfo?.shippingType) completed++;
    if (profileData.shippingLogisticsInfo?.supportContact) completed++;

    return Math.round((completed / total) * 100);
  };

  const progress = calculateProgress();

  const getProgressColor = () => {
    if (progress >= 80) return "bg-sage-500";
    if (progress >= 50) return "bg-terracotta-600";
    return "bg-yellow-500";
  };

  const getProgressText = () => {
    if (progress === 100) return "Profile Complete!";
    if (progress >= 80) return "Almost Complete";
    if (progress >= 50) return "Good Progress";
    return "Getting Started";
  };

  const getMissingFields = () => {
    const missing = [];

    // Basic Information
    if (!profileData.basicInfo?.fullName) missing.push("Add your full name");
    if (!profileData.basicInfo?.storeName) missing.push("Add your store name");
    if (!profileData.basicInfo?.email) missing.push("Add your email address");
    if (!profileData.basicInfo?.mobile) missing.push("Add your mobile number");
    if (!profileData.basicInfo?.businessType)
      missing.push("Select your business type");
    if (!profileData.basicInfo?.productCategories?.length)
      missing.push("Add product categories");

    // Address Information
    const hasCompleteBusinessAddress =
      profileData.addressInfo?.businessAddress &&
      profileData.addressInfo.businessAddress.street &&
      profileData.addressInfo.businessAddress.city &&
      profileData.addressInfo.businessAddress.state &&
      profileData.addressInfo.businessAddress.country &&
      profileData.addressInfo.businessAddress.pinCode;
    if (!hasCompleteBusinessAddress)
      missing.push("Complete your business address");

    const hasCompleteWarehouseAddress =
      profileData.addressInfo?.warehouseAddress?.sameAsBusiness ||
      (profileData.addressInfo?.warehouseAddress &&
        profileData.addressInfo.warehouseAddress.street &&
        profileData.addressInfo.warehouseAddress.city &&
        profileData.addressInfo.warehouseAddress.state &&
        profileData.addressInfo.warehouseAddress.country &&
        profileData.addressInfo.warehouseAddress.pinCode);
    if (!hasCompleteWarehouseAddress)
      missing.push("Complete your warehouse address");

    // Banking & Tax Information
    if (!profileData.bankingTaxInfo?.bankAccountName)
      missing.push("Add bank account holder name");
    if (!profileData.bankingTaxInfo?.bankName) missing.push("Add bank name");
    if (!profileData.bankingTaxInfo?.accountNumber)
      missing.push("Add bank account number");
    if (!profileData.bankingTaxInfo?.ifscCode) missing.push("Add IFSC code");
    if (!profileData.bankingTaxInfo?.panNumber) missing.push("Add PAN number");

    // Shipping & Logistics
    if (!profileData.shippingLogisticsInfo?.shippingType)
      missing.push("Select shipping type");
    if (!profileData.shippingLogisticsInfo?.supportContact)
      missing.push("Add support contact");

    return missing;
  };

  const missingFields = getMissingFields();

  return (
    <div className="bg-white border border-stone-200 shadow-sm mb-8">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-medium text-stone-900">
              Profile Completion
            </h2>
            <p className="text-sm text-stone-600">{getProgressText()}</p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold text-stone-900">
              {progress}%
            </span>
          </div>
        </div>

        <div className="w-full bg-stone-200 h-3">
          <div
            className={`h-3 transition-all duration-500 ${getProgressColor()}`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {progress < 100 && (
          <div className="mt-4 text-sm text-stone-600">
            <p>Complete your seller profile to start selling:</p>
            <ul className="mt-2 space-y-1">
              {missingFields.slice(0, 5).map((field, index) => (
                <li key={index}>• {field}</li>
              ))}
              {missingFields.length > 5 && (
                <li>• And {missingFields.length - 5} more fields...</li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
