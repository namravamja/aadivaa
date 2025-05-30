interface ProfileProgressProps {
  user: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    dateOfBirth?: string;
    gender?: string;
    addresses: Array<{
      id: string;
      firstName: string;
      lastName: string;
      addressLine1: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
      phone?: string;
      isDefault: boolean;
    }>;
  };
}

export default function ProfileProgress({ user }: ProfileProgressProps) {
  const calculateProgress = () => {
    let completed = 0;
    const total = 8; // Total required fields

    // Account Details (4 fields)
    if (user.firstName) completed++;
    if (user.lastName) completed++;
    if (user.email) completed++;
    if (user.phone) completed++;

    // Personal Info (2 fields)
    if (user.dateOfBirth) completed++;
    if (user.gender) completed++;

    // Shipping Address (2 requirements)
    const hasCompleteAddress = user.addresses.some(
      (addr) =>
        addr.firstName &&
        addr.lastName &&
        addr.addressLine1 &&
        addr.city &&
        addr.state &&
        addr.postalCode &&
        addr.country
    );
    if (hasCompleteAddress) completed++;

    const hasAddressPhone = user.addresses.some((addr) => addr.phone);
    if (hasAddressPhone) completed++;

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
            <p>Complete your profile to get the best shopping experience:</p>
            <ul className="mt-2 space-y-1">
              {!user.firstName && <li>• Add your first name</li>}
              {!user.lastName && <li>• Add your last name</li>}
              {!user.phone && <li>• Add your phone number</li>}
              {!user.dateOfBirth && <li>• Add your date of birth</li>}
              {!user.gender && <li>• Add your gender</li>}
              {!user.addresses.some(
                (addr) =>
                  addr.firstName &&
                  addr.lastName &&
                  addr.addressLine1 &&
                  addr.city &&
                  addr.state &&
                  addr.postalCode &&
                  addr.country
              ) && <li>• Add a complete shipping address</li>}
              {!user.addresses.some((addr) => addr.phone) && (
                <li>• Add phone number to shipping address</li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
