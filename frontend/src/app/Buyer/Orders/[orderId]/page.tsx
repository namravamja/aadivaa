"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Package,
  Calendar,
  CreditCard,
  MapPin,
  User,
  X,
  AlertTriangle,
} from "lucide-react";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import {
  useGetOrderByIdQuery,
  useCancelOrderMutation,
} from "@/services/api/orderApi";
import { useAuth } from "@/hooks/useAuth";
import { useAuthModal } from "@/app/(auth)/components/auth-modal-provider";

// Custom Confirmation Dialog Component
type ConfirmationDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
};

const ConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger", // danger, warning, info
}: ConfirmationDialogProps) => {
  if (!isOpen) return null;

  const getVariantStyles = () => {
    switch (variant) {
      case "danger":
        return {
          icon: <X className="w-6 h-6 text-red-600 cursor-pointer" />,
          confirmButton: "bg-red-600 hover:bg-red-700 text-white",
          iconBg: "bg-red-100",
        };
      case "warning":
        return {
          icon: <AlertTriangle className="w-6 h-6 text-yellow-600" />,
          confirmButton: "bg-yellow-600 hover:bg-yellow-700 text-white",
          iconBg: "bg-yellow-100",
        };
      default:
        return {
          icon: <AlertTriangle className="w-6 h-6 text-blue-600" />,
          confirmButton: "bg-blue-600 hover:bg-blue-700 text-white",
          iconBg: "bg-blue-100",
        };
    }
  };

  const variantStyles = getVariantStyles();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <div
              className={`w-12 h-12 rounded-full ${variantStyles.iconBg} flex items-center justify-center mr-4`}
            >
              {variantStyles.icon}
            </div>
            <div>
              <h3 className="text-lg font-medium text-stone-900">{title}</h3>
            </div>
          </div>

          <p className="text-stone-600 mb-6 leading-relaxed">{message}</p>

          <div className="flex space-x-3 justify-end">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 border border-stone-300 text-stone-700 hover:bg-stone-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className={`px-4 py-2 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles.confirmButton}`}
            >
              {isLoading ? "Processing..." : confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function OrderDetailsPage() {
  const params = useParams();
  const orderId = params.orderId as string;
  const { isAuthenticated, isLoading: authLoading } = useAuth("buyer");
  const { openBuyerLogin } = useAuthModal();

  // State for confirmation dialog
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  // RTK Query hooks
  const {
    data: orderResponse,
    isLoading,
    error,
    refetch,
  } = useGetOrderByIdQuery(orderId, {
    skip: !isAuthenticated || !orderId,
  });

  const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation();

  // Extract the actual order data from the cache response
  const order = useMemo(() => {
    if (!orderResponse) return null;

    // Handle new cache format: {source: 'cache'|'db', data: {...}}
    if (
      orderResponse &&
      typeof orderResponse === "object" &&
      "data" in orderResponse
    ) {
      return orderResponse.data;
    }

    // Handle old direct format: {...}
    return orderResponse;
  }, [orderResponse]);

  const handleCancelOrderClick = () => {
    setShowCancelDialog(true);
  };

  const handleConfirmCancel = async () => {
    try {
      await cancelOrder(orderId).unwrap();
      toast.success("Order cancelled successfully", {
        duration: 2000,
        icon: "✅",
      });
      setShowCancelDialog(false);
      refetch();
    } catch (error: any) {
      console.error("Error cancelling order:", error);
      const errorMessage =
        error?.data?.message || error?.message || "Failed to cancel order";
      toast.error(errorMessage, {
        duration: 3000,
      });
      setShowCancelDialog(false);
    }
  };

  const handleCancelDialogClose = () => {
    if (!isCancelling) {
      setShowCancelDialog(false);
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-stone-100 text-stone-800";
    }
  };

  const getPaymentStatusColor = (status?: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "unpaid":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-stone-100 text-stone-800";
    }
  };

  // Helper function to format shipping address
  const formatShippingAddress = (shippingAddress: any) => {
    if (!shippingAddress) {
      return "Address not available";
    }

    // If it's a string, return it as is
    if (typeof shippingAddress === "string") {
      return shippingAddress;
    }

    // If it's an object, format it properly
    if (typeof shippingAddress === "object") {
      const parts = [];

      if (shippingAddress.firstName || shippingAddress.lastName) {
        parts.push(
          `${shippingAddress.firstName || ""} ${
            shippingAddress.lastName || ""
          }`.trim()
        );
      }

      if (shippingAddress.company) {
        parts.push(shippingAddress.company);
      }

      if (shippingAddress.street) {
        parts.push(shippingAddress.street);
      }

      if (shippingAddress.apartment) {
        parts.push(shippingAddress.apartment);
      }

      if (
        shippingAddress.city ||
        shippingAddress.state ||
        shippingAddress.postalCode
      ) {
        const cityStateZip = [
          shippingAddress.city,
          shippingAddress.state,
          shippingAddress.postalCode,
        ]
          .filter(Boolean)
          .join(", ");
        if (cityStateZip) parts.push(cityStateZip);
      }

      if (shippingAddress.country) {
        parts.push(shippingAddress.country);
      }

      if (shippingAddress.phone) {
        parts.push(`Phone: ${shippingAddress.phone}`);
      }

      return parts.length > 0 ? parts.join("\n") : "Address not available";
    }

    return "Address not available";
  };

  // Show login prompt if not authenticated
  if (!authLoading && !isAuthenticated) {
    return (
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center py-16">
            <User className="w-24 h-24 mx-auto text-stone-300 mb-6" />
            <h1 className="text-3xl font-light text-stone-900 mb-4">
              Login Required
            </h1>
            <p className="text-stone-600 mb-8">
              Please login to view order details.
            </p>
            <button
              onClick={openBuyerLogin}
              className="bg-terracotta-600 hover:bg-terracotta-700 text-white px-6 py-3 font-medium transition-colors cursor-pointer"
            >
              Login to Continue
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (authLoading || isLoading) {
    return (
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-stone-200 rounded w-48 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-64 bg-stone-200 rounded"></div>
                <div className="h-48 bg-stone-200 rounded"></div>
              </div>
              <div className="h-96 bg-stone-200 rounded"></div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center py-16">
            <h1 className="text-3xl font-light text-stone-900 mb-4">
              Order not found
            </h1>
            <p className="text-stone-600 mb-8">
              The order you're looking for doesn't exist or you don't have
              access to it.
            </p>
            <button
              onClick={() => refetch()}
              className="bg-terracotta-600 hover:bg-terracotta-700 text-white px-6 py-3 font-medium transition-colors cursor-pointer mr-4"
            >
              Retry
            </button>
            <Link href="/Buyer/Orders">
              <button className="border border-stone-300 text-stone-700 hover:bg-stone-50 px-6 py-3 font-medium transition-colors cursor-pointer">
                View All Orders
              </button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <>
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <div className="mb-8">
            <Link
              href="/Buyer/Orders"
              className="flex items-center text-stone-600 hover:text-terracotta-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to orders
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Header */}
              <div className="bg-white border border-stone-200 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                  <div>
                    <h1 className="text-2xl font-light text-stone-900 mb-2">
                      Order Details
                    </h1>
                    <p className="text-stone-600">Order ID: {order.id}</p>
                  </div>
                  <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                    <span
                      className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status
                        ? order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)
                        : "Unknown"}
                    </span>
                    <span
                      className={`px-3 py-1 text-sm font-medium rounded-full ${getPaymentStatusColor(
                        order.paymentStatus
                      )}`}
                    >
                      {order.paymentStatus
                        ? order.paymentStatus.charAt(0).toUpperCase() +
                          order.paymentStatus.slice(1)
                        : "Unknown"}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 text-stone-400 mr-2" />
                    <div>
                      <p className="text-stone-600">Placed on</p>
                      <p className="font-medium">
                        {order.placedAt
                          ? new Date(order.placedAt).toLocaleDateString()
                          : "-"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <CreditCard className="w-4 h-4 text-stone-400 mr-2" />
                    <div>
                      <p className="text-stone-600">Payment</p>
                      <p className="font-medium capitalize">
                        {order.paymentMethod || "-"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Package className="w-4 h-4 text-stone-400 mr-2" />
                    <div>
                      <p className="text-stone-600">Total</p>
                      <p className="font-medium">
                        {order.totalAmount !== undefined
                          ? `₹${order.totalAmount.toFixed(2)}`
                          : "-"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-white border border-stone-200 p-6">
                <h2 className="text-xl font-medium text-stone-900 mb-4">
                  Order Items
                </h2>
                <div className="space-y-4">
                  {order.orderItems?.map((item: any) => (
                    <div
                      key={item.id}
                      className="flex items-center space-x-4 pb-4 border-b border-stone-200 last:border-b-0 last:pb-0"
                    >
                      <div className="relative w-20 h-20 flex-shrink-0">
                        <Image
                          src={
                            item.product?.productImages?.[0] || "/Profile.jpg"
                          }
                          alt={item.product?.productName || "Product"}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-stone-900">
                          {item.product?.productName || "Unknown Product"}
                        </h3>
                        <p className="text-sm text-stone-500 mb-1">
                          By{" "}
                          {item.product?.artist?.fullName ||
                            item.product?.artist?.storeName ||
                            "Unknown Artist"}
                        </p>
                        <p className="text-sm text-stone-600">
                          Category: {item.product?.category || "-"}
                        </p>
                        <p className="text-sm text-stone-600">
                          SKU: {item.product?.skuCode || "-"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-stone-900">
                          ₹
                          {(
                            (item.quantity || 0) * (item.priceAtPurchase || 0)
                          ).toFixed(2)}
                        </p>
                        <p className="text-sm text-stone-600">
                          {item.quantity || 0} × ₹
                          {(item.priceAtPurchase || 0).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Product Details */}
              {order.orderItems?.[0]?.product && (
                <div className="bg-white border border-stone-200 p-6">
                  <h2 className="text-xl font-medium text-stone-900 mb-4">
                    Product Details
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-stone-600">Dimensions</p>
                      <p className="font-medium">
                        {`${order.orderItems[0].product.length}" × ${order.orderItems[0].product.width}" × ${order.orderItems[0].product.height}"`}
                      </p>
                    </div>
                    <div>
                      <p className="text-stone-600">Weight</p>
                      <p className="font-medium">
                        {order.orderItems[0].product.weight} gm
                      </p>
                    </div>
                    <div>
                      <p className="text-stone-600">Delivery Time</p>
                      <p className="font-medium">
                        {order.orderItems[0].product.deliveryTimeEstimate} days
                      </p>
                    </div>
                    <div>
                      <p className="text-stone-600">Shipping Cost</p>
                      <p className="font-medium">
                        ₹{order.orderItems[0].product.shippingCost}
                      </p>
                    </div>
                  </div>
                  {order.orderItems[0].product.shortDescription && (
                    <div className="mt-4">
                      <p className="text-stone-600 mb-2">Description</p>
                      <p className="text-stone-900">
                        {order.orderItems[0].product.shortDescription}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Shipping Address */}
              <div className="bg-white border border-stone-200 p-6">
                <div className="flex items-center mb-4">
                  <MapPin className="w-5 h-5 text-terracotta-600 mr-2" />
                  <h2 className="text-xl font-medium text-stone-900">
                    Shipping Address
                  </h2>
                </div>
                <div className="text-stone-700 leading-relaxed whitespace-pre-line">
                  {formatShippingAddress(order.shippingAddress) ||
                    (order.shippingAddressId
                      ? `Address ID: ${order.shippingAddressId}`
                      : "Address not available")}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-stone-200 p-6 sticky top-24">
                <h2 className="text-xl font-medium text-stone-900 mb-6">
                  Order Actions
                </h2>

                {order.status === "pending" && (
                  <button
                    onClick={handleCancelOrderClick}
                    disabled={isCancelling}
                    className="w-full flex items-center justify-center px-4 py-3 border border-red-300 text-red-700 hover:bg-red-50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mb-4"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel Order
                  </button>
                )}

                <Link href="/Buyer/Orders">
                  <button className="w-full px-4 py-3 border border-stone-300 text-stone-700 hover:bg-stone-50 transition-colors cursor-pointer mb-4">
                    View All Orders
                  </button>
                </Link>

                <Link href="/Products">
                  <button className="w-full px-4 py-3 bg-terracotta-600 hover:bg-terracotta-700 text-white transition-colors cursor-pointer">
                    Continue Shopping
                  </button>
                </Link>

                {/* Order Summary */}
                <div className="mt-6 pt-6 border-t border-stone-200">
                  <h3 className="font-medium text-stone-900 mb-4">
                    Order Summary
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-stone-600">Subtotal</span>
                      <span className="text-stone-900">
                        ₹
                        {order.totalAmount -
                          (order.orderItems?.[0]?.product?.shippingCost || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-600">Shipping</span>
                      <span className="text-stone-900">
                        ₹{order.orderItems?.[0]?.product?.shippingCost || 0}
                      </span>
                    </div>
                    <div className="flex justify-between font-medium text-base pt-2 border-t border-stone-200">
                      <span className="text-stone-900">Total</span>
                      <span className="text-stone-900">
                        ₹{order.totalAmount}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Artist Information */}
                {order.orderItems?.[0]?.product?.artist && (
                  <div className="mt-6 pt-6 border-t border-stone-200">
                    <h3 className="font-medium text-stone-900 mb-4">
                      Artist Information
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-stone-600">Store: </span>
                        <span className="text-stone-900">
                          {order.orderItems[0].product.artist.storeName}
                        </span>
                      </div>
                      <div>
                        <span className="text-stone-600">Artist: </span>
                        <span className="text-stone-900">
                          {order.orderItems[0].product.artist.fullName}
                        </span>
                      </div>
                      <div>
                        <span className="text-stone-600">Contact: </span>
                        <span className="text-stone-900">
                          {order.orderItems[0].product.artist.email}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Custom Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showCancelDialog}
        onClose={handleCancelDialogClose}
        onConfirm={handleConfirmCancel}
        isLoading={isCancelling}
        title="Cancel Order"
        message="Are you sure you want to cancel this order? This action cannot be undone and you will need to place a new order if you change your mind."
        confirmText="Yes, Cancel Order"
        cancelText="Keep Order"
        variant="danger"
      />
    </>
  );
}
