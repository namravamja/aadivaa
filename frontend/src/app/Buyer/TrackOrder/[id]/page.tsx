"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useMemo } from "react";
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  Mail,
  Loader2,
} from "lucide-react";

// RTK Query hook (add this to your buyerOrderApi.ts file)
import { useGetOrderByIdQuery } from "@/services/api/orderApi";

// Authentication imports
import { useAuthModal } from "@/app/(auth)/components/auth-modal-provider";
import { useAuth } from "@/hooks/useAuth";

interface TrackingEvent {
  id: string;
  status: string;
  description: string;
  location: string;
  timestamp: string;
}

interface OrderDetails {
  id: string;
  buyerId: string;
  totalAmount: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  shippingAddressId: number;
  paymentMethod: string;
  paymentStatus: "paid" | "unpaid" | "failed";
  placedAt: string;
  updatedAt: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  buyer: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string | null;
  };
  orderItems: Array<{
    id: string;
    orderId: string;
    productId: string;
    quantity: number;
    priceAtPurchase: number;
    artistId: string;
    product: {
      id: string;
      productName: string;
      category: string;
      shortDescription: string;
      productImages: string[];
      skuCode: string;
      weight?: string;
      length?: string;
      width?: string;
      height?: string;
      availableStock?: number;
      artist: {
        id: string;
        fullName: string;
        storeName: string;
        email: string;
        mobile: string;
      };
    };
  }>;
  shippingAddress: {
    id: number;
    firstName: string;
    lastName: string;
    company?: string;
    street: string;
    apartment?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone: string;
    userId: string;
    isDefault: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

const statusIcons = {
  pending: Clock,
  confirmed: CheckCircle,
  shipped: Truck,
  delivered: CheckCircle,
  cancelled: Package,
};

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

// Generate tracking history based on order status and dates
const generateTrackingHistory = (order: OrderDetails): TrackingEvent[] => {
  const events: TrackingEvent[] = [];
  const placedDate = new Date(order.placedAt);

  // Always add order placed event
  events.push({
    id: "1",
    status: "pending",
    description: "Order placed successfully",
    location: "Online",
    timestamp: order.placedAt,
  });

  // Add events based on current status
  if (["confirmed", "shipped", "delivered"].includes(order.status)) {
    const confirmedDate = new Date(placedDate.getTime() + 2 * 60 * 60 * 1000); // 2 hours after placed
    events.push({
      id: "2",
      status: "confirmed",
      description: "Order confirmed and being prepared",
      location: "Artist Studio",
      timestamp: confirmedDate.toISOString(),
    });
  }

  if (["shipped", "delivered"].includes(order.status)) {
    const shippedDate = new Date(placedDate.getTime() + 24 * 60 * 60 * 1000); // 1 day after placed
    events.push({
      id: "3",
      status: "shipped",
      description: "Package shipped and in transit",
      location: "Fulfillment Center",
      timestamp: shippedDate.toISOString(),
    });

    // Add in-transit events for shipped orders
    if (order.status === "shipped") {
      const transitDate = new Date(placedDate.getTime() + 36 * 60 * 60 * 1000); // 1.5 days after placed
      events.push({
        id: "4",
        status: "shipped",
        description: "Package in transit - on the way to you",
        location: "Regional Hub",
        timestamp: transitDate.toISOString(),
      });
    }
  }

  if (order.status === "delivered") {
    const deliveredDate = new Date(placedDate.getTime() + 72 * 60 * 60 * 1000); // 3 days after placed
    events.push({
      id: "4",
      status: "delivered",
      description: "Package delivered successfully",
      location: "Destination",
      timestamp: deliveredDate.toISOString(),
    });
  }

  if (order.status === "cancelled") {
    events.push({
      id: "2",
      status: "cancelled",
      description: "Order has been cancelled",
      location: "System",
      timestamp: order.updatedAt,
    });
  }

  return events.sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
};

// Generate estimated delivery date (3 days after order placed)
const getEstimatedDelivery = (placedAt: string): string => {
  const placedDate = new Date(placedAt);
  const estimatedDate = new Date(
    placedDate.getTime() + 3 * 24 * 60 * 60 * 1000
  ); // 3 days after placed
  return estimatedDate.toISOString();
};

// Generate tracking number
const generateTrackingNumber = (orderId: string): string => {
  return `TC${orderId.substring(0, 8).toUpperCase()}${Date.now()
    .toString()
    .slice(-4)}`;
};

// Generate order number from ID - Updated to use Order # format
const getOrderNumber = (id: string): string => {
  return `Order #${id.substring(0, 8)}`;
};

export default function TrackOrderByIdPage() {
  const params = useParams();
  const orderId = params.id as string;

  // Authentication hooks
  const { openBuyerLogin } = useAuthModal();
  const { isAuthenticated, isLoading: authLoading } = useAuth("buyer");

  const {
    data: response,
    isLoading,
    error,
  } = useGetOrderByIdQuery(orderId, {
    refetchOnMountOrArgChange: true,
    skip: !isAuthenticated, // Skip the query if not authenticated
  });

  // Extract order data from cache response
  const order = useMemo(() => {
    if (!response) return null;

    // Handle new cache format: {source: 'cache'|'db', data: {...}}
    if (response && typeof response === "object" && "data" in response) {
      return response.data as OrderDetails;
    }

    // Handle old direct format: {...}
    return response as OrderDetails;
  }, [response]);

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <main className="pt-24 pb-16 min-h-screen bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-terracotta-600 mx-auto mb-4" />
              <span className="text-terracotta-600 font-medium">
                Checking authentication...
              </span>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <main className="pt-24 pb-16 min-h-screen bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <Package className="w-24 h-24 mx-auto text-stone-300 mb-6" />
              <h1 className="text-3xl font-light text-stone-900 mb-4">
                Please sign in to track your order
              </h1>
              <p className="text-stone-600 mb-8 leading-relaxed">
                You need to be logged in to view your order details and tracking
                information.
              </p>
              <div className="space-y-4">
                <button
                  onClick={openBuyerLogin}
                  className="w-full cursor-pointer bg-terracotta-600 hover:bg-terracotta-700 text-white px-8 py-3 font-medium transition-colors"
                >
                  Sign In
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Show loading while fetching order data
  if (isLoading) {
    return (
      <main className="pt-24 pb-16 min-h-screen bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-terracotta-600 mx-auto mb-4" />
              <span className="text-terracotta-600 font-medium">
                Loading order details...
              </span>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="pt-24 pb-16 min-h-screen bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <Package className="w-24 h-24 mx-auto text-stone-300 mb-6" />
              <h1 className="text-3xl font-light text-stone-900 mb-4">
                Order not found
              </h1>
              <p className="text-stone-600 mb-8 leading-relaxed">
                The order you're looking for doesn't exist or you don't have
                permission to view it.
              </p>
              <Link href="/Buyer/TrackOrder">
                <button className="bg-terracotta-600 hover:bg-terracotta-700 text-white px-8 py-3 font-medium transition-colors ">
                  View All Orders
                </button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const getProgressValue = () => {
    const statusOrder = ["pending", "confirmed", "shipped", "delivered"];
    const currentIndex = statusOrder.indexOf(order.status);
    return order.status === "cancelled"
      ? -1
      : ((currentIndex + 1) / statusOrder.length) * 100;
  };

  const trackingEvents = generateTrackingHistory(order);
  const estimatedDelivery = getEstimatedDelivery(order.placedAt);
  const trackingNumber = generateTrackingNumber(order.id);
  const orderNumber = getOrderNumber(order.id);

  return (
    <main className="pt-24 pb-16 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header Section */}
        <div className="mb-8">
          <Link href="/Buyer/TrackOrder">
            <button className="inline-flex cursor-pointer items-center border border-gray-300 text-gray-700 hover:bg-gray-100 px-4 py-2 font-medium transition-colors mb-6 ">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Orders
            </button>
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-light text-stone-900 mb-2">
                Track Order
              </h1>
              <p className="text-stone-600 text-lg">{orderNumber}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="xl:col-span-2 space-y-8">
            {/* Status Overview */}
            <div className="bg-white  border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-5 flex justify-between border-b border-gray-200 bg-gray-50">
                <h2 className="text-xl px-3 py-2 font-semibold text-stone-900">
                  Order Status
                </h2>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    statusColors[order.status]
                  }`}
                >
                  {order.status.toUpperCase()}
                </span>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  {order.status !== "cancelled" && (
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-stone-600">
                          Progress
                        </span>
                        <span className="text-sm text-stone-500">
                          {Math.round(getProgressValue())}% Complete
                        </span>
                      </div>
                      <div className="w-full bg-gray-200  h-3">
                        <div
                          className="bg-terracotta-600 h-3  transition-all duration-300 ease-in-out"
                          style={{ width: `${getProgressValue()}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {order.status !== "pending" &&
                    order.status !== "cancelled" && (
                      <div className="bg-stone-50  p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <p className="text-sm font-medium text-stone-900 mb-1">
                              Tracking Number
                            </p>
                            <p className="text-xl font-mono text-stone-700 mb-2">
                              {trackingNumber}
                            </p>
                            <p className="text-sm text-stone-500">
                              Carrier: Standard Shipping
                            </p>
                          </div>
                          {order.status !== "delivered" && (
                            <div className="text-left md:text-right">
                              <p className="text-sm font-medium text-stone-900 mb-1">
                                Estimated Delivery
                              </p>
                              <p className="text-xl text-terracotta-600 font-semibold">
                                {new Date(
                                  estimatedDelivery
                                ).toLocaleDateString()}
                              </p>
                              <p className="text-sm text-stone-500">
                                Standard Delivery
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                </div>
              </div>
            </div>

            {/* Tracking Timeline */}
            <div className="bg-white  border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
                <h2 className="text-xl font-semibold text-stone-900">
                  Tracking History
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  {trackingEvents.map((event, index) => {
                    const IconComponent =
                      statusIcons[event.status as keyof typeof statusIcons] ||
                      Clock;
                    const isLatest = index === trackingEvents.length - 1;

                    return (
                      <div
                        key={event.id}
                        className="flex items-start space-x-4 relative"
                      >
                        {/* Timeline line */}
                        {index < trackingEvents.length - 1 && (
                          <div className="absolute left-4 top-8 w-0.5 h-6 bg-gray-200"></div>
                        )}

                        {/* Icon */}
                        <div
                          className={`flex-shrink-0 w-8 h-8  flex items-center justify-center relative z-10 ${
                            isLatest
                              ? "bg-terracotta-600 text-white shadow-lg"
                              : "bg-stone-200 text-stone-600"
                          }`}
                        >
                          <IconComponent className="w-4 h-4" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0 pb-4">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                            <div className="flex-1">
                              <p
                                className={`font-medium text-base ${
                                  isLatest
                                    ? "text-terracotta-600"
                                    : "text-stone-900"
                                }`}
                              >
                                {event.description}
                              </p>
                              <p className="text-sm text-stone-500 flex items-center mt-1">
                                <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                                {event.location}
                              </p>
                            </div>
                            <div className="text-left sm:text-right flex-shrink-0">
                              <p className="text-sm font-medium text-stone-700">
                                {new Date(event.timestamp).toLocaleDateString()}
                              </p>
                              <p className="text-sm text-stone-500">
                                {new Date(event.timestamp).toLocaleTimeString(
                                  [],
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white  border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
                <h2 className="text-xl font-semibold text-stone-900">
                  Order Items ({order.orderItems.length})
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  {order.orderItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start space-x-4 p-4 bg-gray-50 "
                    >
                      <div className="relative w-20 h-20 flex-shrink-0">
                        <Image
                          src={
                            item.product.productImages?.[0] || "/Profile.jpg"
                          }
                          alt={item.product.productName}
                          fill
                          className="object-cover "
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link href={`/Products/${item.productId}`}>
                          <h4 className="font-semibold text-stone-900 hover:text-terracotta-600 transition-colors text-lg">
                            {item.product.productName}
                          </h4>
                        </Link>
                        <p className="text-sm text-stone-500 mt-1">
                          By {item.product.artist.fullName}
                        </p>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-2 gap-2">
                          <p className="text-sm text-stone-600">
                            Quantity: {item.quantity} × ₹
                            {item.priceAtPurchase.toFixed(2)}
                          </p>
                          <p className="font-semibold text-lg text-stone-900">
                            ₹{(item.quantity * item.priceAtPurchase).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="xl:col-span-1 space-y-6">
            {/* Order Summary */}
            <div className="bg-white  border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
                <h2 className="text-xl font-semibold text-stone-900">
                  Order Summary
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-stone-600">Subtotal</span>
                  <span className="text-stone-900 font-medium">
                    ₹{(order.totalAmount * 0.85).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-stone-600">Shipping</span>
                  <span className="text-stone-900 font-medium">
                    ₹{(order.totalAmount * 0.1).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-stone-600">Tax</span>
                  <span className="text-stone-900 font-medium">
                    ₹{(order.totalAmount * 0.05).toFixed(2)}
                  </span>
                </div>
                <hr className="border-gray-200 my-4" />
                <div className="flex justify-between items-center">
                  <span className="text-stone-900 font-semibold text-lg">
                    Total
                  </span>
                  <span className="text-stone-900 font-bold text-xl">
                    ₹{order.totalAmount.toFixed(2)}
                  </span>
                </div>
                <div className="pt-4 flex justify-center">
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-2  text-sm font-medium ${
                      order.paymentStatus === "paid"
                        ? "bg-green-100 text-green-800"
                        : order.paymentStatus === "unpaid"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    Payment {order.paymentStatus.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white  border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
                <h2 className="text-xl font-semibold text-stone-900">
                  Shipping Address
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-2">
                  <p className="font-semibold text-stone-900">
                    {order.shippingAddress.firstName}{" "}
                    {order.shippingAddress.lastName}
                  </p>
                  {order.shippingAddress.company && (
                    <p className="text-stone-600">
                      {order.shippingAddress.company}
                    </p>
                  )}
                  <p className="text-stone-600">
                    {order.shippingAddress.street}
                  </p>
                  {order.shippingAddress.apartment && (
                    <p className="text-stone-600">
                      {order.shippingAddress.apartment}
                    </p>
                  )}
                  <p className="text-stone-600">
                    {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                    {order.shippingAddress.postalCode}
                  </p>
                  <p className="text-stone-600">
                    {order.shippingAddress.country}
                  </p>
                  <div className="pt-3 border-t border-gray-100">
                    <p className="text-stone-600 flex items-center">
                      <Phone className="w-4 h-4 mr-2 text-stone-400" />
                      {order.shippingAddress.phone}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Timeline */}
            <div className="bg-white  border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
                <h2 className="text-xl font-semibold text-stone-900">
                  Order Timeline
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-stone-600 font-medium">
                    Order Placed
                  </span>
                  <span className="text-sm font-semibold text-stone-900">
                    {new Date(order.placedAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-stone-600 font-medium">
                    Last Updated
                  </span>
                  <span className="text-sm font-semibold text-stone-900">
                    {new Date(order.updatedAt).toLocaleDateString()}
                  </span>
                </div>
                {order.status !== "delivered" &&
                  order.status !== "cancelled" && (
                    <div className="flex justify-between items-center p-3 bg-terracotta-50 ">
                      <span className="text-sm text-terracotta-700 font-medium">
                        Expected Delivery
                      </span>
                      <span className="text-sm font-bold text-terracotta-800">
                        {new Date(estimatedDelivery).toLocaleDateString()}
                      </span>
                    </div>
                  )}
              </div>
            </div>

            {/* Support */}
            <div className="bg-white  border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
                <h2 className="text-xl font-semibold text-stone-900">
                  Need Help?
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-sm text-stone-600 leading-relaxed">
                  If you have questions about your order, we're here to help.
                </p>
                <div className="space-y-3">
                  <Link
                    href="/About"
                    className="w-full inline-flex items-center justify-center border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-3 font-medium transition-colors "
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Contact Support
                  </Link>
                  <Link
                    href="/About"
                    className="w-full inline-flex items-center justify-center border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-3 font-medium transition-colors "
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Call Us
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
