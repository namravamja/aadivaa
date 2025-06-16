"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";

interface TrackingEvent {
  id: string;
  status: string;
  description: string;
  location: string;
  timestamp: string;
}

interface OrderDetails {
  id: string;
  orderNumber: string;
  status:
    | "PENDING"
    | "CONFIRMED"
    | "PROCESSING"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELLED";
  paymentStatus: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
  totalAmount: number;
  shippingCost: number;
  taxAmount: number;
  items: Array<{
    id: string;
    productId: string;
    name: string;
    image: string;
    artist: string;
    quantity: number;
    price: number;
  }>;
  shippingAddress: {
    firstName: string;
    lastName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone?: string;
  };
  trackingNumber?: string;
  carrier?: string;
  estimatedDelivery?: string;
  createdAt: string;
  trackingEvents: TrackingEvent[];
}

// Mock order data
const mockOrder: OrderDetails = {
  id: "1",
  orderNumber: "TC-2024-001",
  status: "SHIPPED",
  paymentStatus: "PAID",
  totalAmount: 234.48,
  shippingCost: 15.0,
  taxAmount: 18.48,
  items: [
    {
      id: "1",
      productId: "prod1",
      name: "Handwoven Basket",
      image: "/Profile.jpg?height=80&width=80",
      artist: "Maria Santos",
      quantity: 2,
      price: 89.99,
    },
    {
      id: "2",
      productId: "prod2",
      name: "Ceramic Vase",
      image: "/Profile.jpg?height=80&width=80",
      artist: "David Chen",
      quantity: 1,
      price: 65.0,
    },
  ],
  shippingAddress: {
    firstName: "John",
    lastName: "Doe",
    addressLine1: "123 Main Street",
    addressLine2: "Apt 4B",
    city: "New York",
    state: "NY",
    postalCode: "10001",
    country: "USA",
    phone: "+1 (555) 123-4567",
  },
  trackingNumber: "1Z999AA1234567890",
  carrier: "UPS",
  estimatedDelivery: "2024-01-30T00:00:00Z",
  createdAt: "2024-01-25T09:15:00Z",
  trackingEvents: [
    {
      id: "1",
      status: "ORDER_PLACED",
      description: "Order placed successfully",
      location: "Online",
      timestamp: "2024-01-25T09:15:00Z",
    },
    {
      id: "2",
      status: "PAYMENT_CONFIRMED",
      description: "Payment confirmed",
      location: "Payment Center",
      timestamp: "2024-01-25T09:20:00Z",
    },
    {
      id: "3",
      status: "PROCESSING",
      description: "Order is being prepared",
      location: "Fulfillment Center - Austin, TX",
      timestamp: "2024-01-26T10:30:00Z",
    },
    {
      id: "4",
      status: "SHIPPED",
      description: "Package shipped",
      location: "Austin, TX",
      timestamp: "2024-01-27T16:20:00Z",
    },
    {
      id: "5",
      status: "IN_TRANSIT",
      description: "Package in transit",
      location: "Dallas, TX",
      timestamp: "2024-01-28T08:45:00Z",
    },
    {
      id: "6",
      status: "IN_TRANSIT",
      description: "Package in transit",
      location: "Memphis, TN",
      timestamp: "2024-01-28T22:15:00Z",
    },
  ],
};

const statusIcons = {
  ORDER_PLACED: Clock,
  PAYMENT_CONFIRMED: CheckCircle,
  PROCESSING: Package,
  SHIPPED: Truck,
  IN_TRANSIT: Truck,
  OUT_FOR_DELIVERY: Truck,
  DELIVERED: CheckCircle,
};

const statusColors = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  PROCESSING: "bg-purple-100 text-purple-800",
  SHIPPED: "bg-orange-100 text-orange-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

export default function TrackOrderPage() {
  const params = useParams();
  const [order, setOrder] = useState<OrderDetails | null>(mockOrder);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      setIsLoading(true);
      try {
        // API call would go here
        // const response = await fetch(`/api/orders/${params.id}`)
        // const orderData = await response.json()
        // setOrder(orderData)
      } catch (error) {
        console.error("Failed to fetch order:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchOrder();
    }
  }, [params.id]);

  if (!order) {
    return (
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center py-16">
            <Package className="w-24 h-24 mx-auto text-stone-300 mb-6" />
            <h1 className="text-3xl font-light text-stone-900 mb-4">
              Order not found
            </h1>
            <p className="text-stone-600 mb-8">
              The order you're looking for doesn't exist or you don't have
              permission to view it.
            </p>
            <Link href="/buyer/orders">
              <button className="bg-terracotta-600 hover:bg-terracotta-700 text-white px-6 py-3 font-medium transition-colors">
                View All Orders
              </button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const getProgressValue = () => {
    const statusOrder = [
      "PENDING",
      "CONFIRMED",
      "PROCESSING",
      "SHIPPED",
      "DELIVERED",
    ];
    const currentIndex = statusOrder.indexOf(order.status);
    return ((currentIndex + 1) / statusOrder.length) * 100;
  };

  return (
    <main className="pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <Link href="/buyer/orders">
            <button className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 font-medium transition-colors mb-4">
              <ArrowLeft className="w-4 h-4 mr-2 inline" />
              Back to Orders
            </button>
          </Link>
          <h1 className="text-3xl font-light text-stone-900 mb-2">
            Track Order
          </h1>
          <p className="text-stone-600">Order {order.orderNumber}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Status */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Overview */}
            <div className="bg-white border border-gray-200 shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-medium text-stone-900">
                    Order Status
                  </h2>
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      statusColors[order.status]
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-terracotta-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${getProgressValue()}%` }}
                    ></div>
                  </div>

                  {order.trackingNumber && (
                    <div className="bg-stone-50 p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium text-stone-900">
                            Tracking Number
                          </p>
                          <p className="text-lg font-mono text-stone-700">
                            {order.trackingNumber}
                          </p>
                          {order.carrier && (
                            <p className="text-sm text-stone-500">
                              Carrier: {order.carrier}
                            </p>
                          )}
                        </div>
                        {order.estimatedDelivery && (
                          <div className="text-right">
                            <p className="text-sm font-medium text-stone-900">
                              Estimated Delivery
                            </p>
                            <p className="text-lg text-stone-700">
                              {new Date(
                                order.estimatedDelivery
                              ).toLocaleDateString()}
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
            <div className="bg-white border border-gray-200 shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-medium text-stone-900">
                  Tracking History
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {order.trackingEvents.map((event, index) => {
                    const IconComponent =
                      statusIcons[event.status as keyof typeof statusIcons] ||
                      Clock;
                    const isLatest = index === order.trackingEvents.length - 1;

                    return (
                      <div
                        key={event.id}
                        className="flex items-start space-x-4"
                      >
                        <div
                          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                            isLatest
                              ? "bg-terracotta-600 text-white"
                              : "bg-stone-200 text-stone-600"
                          }`}
                        >
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <div>
                              <p
                                className={`font-medium ${
                                  isLatest
                                    ? "text-terracotta-600"
                                    : "text-stone-900"
                                }`}
                              >
                                {event.description}
                              </p>
                              <p className="text-sm text-stone-500 flex items-center mt-1">
                                <MapPin className="w-3 h-3 mr-1" />
                                {event.location}
                              </p>
                            </div>
                            <p className="text-sm text-stone-500">
                              {new Date(event.timestamp).toLocaleDateString()}{" "}
                              at{" "}
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
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white border border-gray-200 shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-medium text-stone-900">
                  Order Items
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4">
                      <div className="relative w-16 h-16 flex-shrink-0">
                        <Image
                          src={item.image || "/Profile.jpg"}
                          alt={item.name}
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>
                      <div className="flex-1">
                        <Link href={`/products/${item.productId}`}>
                          <h4 className="font-medium text-stone-900 hover:text-terracotta-600 transition-colors">
                            {item.name}
                          </h4>
                        </Link>
                        <p className="text-sm text-stone-500">
                          By {item.artist}
                        </p>
                        <p className="text-sm text-stone-600">
                          Qty: {item.quantity} × ${item.price.toFixed(2)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-stone-900">
                          ${(item.quantity * item.price).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary & Shipping */}
          <div className="lg:col-span-1 space-y-6">
            {/* Order Summary */}
            <div className="bg-white border border-gray-200 shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-medium text-stone-900">
                  Order Summary
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between">
                  <span className="text-stone-600">Subtotal</span>
                  <span className="text-stone-900">
                    $
                    {(
                      order.totalAmount -
                      order.shippingCost -
                      order.taxAmount
                    ).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-600">Shipping</span>
                  <span className="text-stone-900">
                    ${order.shippingCost.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-600">Tax</span>
                  <span className="text-stone-900">
                    ${order.taxAmount.toFixed(2)}
                  </span>
                </div>
                <hr className="border-gray-200" />
                <div className="flex justify-between font-medium text-lg">
                  <span className="text-stone-900">Total</span>
                  <span className="text-stone-900">
                    ${order.totalAmount.toFixed(2)}
                  </span>
                </div>
                <div className="pt-2">
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      order.paymentStatus === "PAID"
                        ? "bg-green-100 text-green-800"
                        : order.paymentStatus === "PENDING"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    Payment {order.paymentStatus}
                  </span>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white border border-gray-200 shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-medium text-stone-900">
                  Shipping Address
                </h2>
              </div>
              <div className="p-6">
                <div className="text-sm space-y-1">
                  <p className="font-medium text-stone-900">
                    {order.shippingAddress.firstName}{" "}
                    {order.shippingAddress.lastName}
                  </p>
                  <p className="text-stone-600">
                    {order.shippingAddress.addressLine1}
                  </p>
                  {order.shippingAddress.addressLine2 && (
                    <p className="text-stone-600">
                      {order.shippingAddress.addressLine2}
                    </p>
                  )}
                  <p className="text-stone-600">
                    {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                    {order.shippingAddress.postalCode}
                  </p>
                  <p className="text-stone-600">
                    {order.shippingAddress.country}
                  </p>
                  {order.shippingAddress.phone && (
                    <p className="text-stone-600 flex items-center mt-2">
                      <Phone className="w-3 h-3 mr-1" />
                      {order.shippingAddress.phone}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Support */}
            <div className="bg-white border border-gray-200 shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-medium text-stone-900">
                  Need Help?
                </h2>
              </div>
              <div className="p-6 space-y-3">
                <p className="text-sm text-stone-600">
                  If you have questions about your order, we're here to help.
                </p>
                <div className="space-y-2">
                  <button className="w-full border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 font-medium transition-colors flex items-center justify-start">
                    <Mail className="w-4 h-4 mr-2" />
                    Contact Support
                  </button>
                  <button className="w-full border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 font-medium transition-colors flex items-center justify-start">
                    <Phone className="w-4 h-4 mr-2" />
                    Call Us
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
