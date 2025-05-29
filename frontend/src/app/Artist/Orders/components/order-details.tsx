"use client";

import {
  ArrowLeft,
  MapPin,
  CreditCard,
  Package,
  Truck,
  Calendar,
  Phone,
} from "lucide-react";
import Image from "next/image";
import type { Order } from "../page";
import type { JSX } from "react";

interface OrderDetailsProps {
  order: Order;
  onBack: () => void;
  getStatusIcon: (status: Order["status"]) => JSX.Element;
  getStatusColor: (status: Order["status"]) => string;
}

export default function OrderDetails({
  order,
  onBack,
  getStatusIcon,
  getStatusColor,
}: OrderDetailsProps) {
  const getOrderProgress = (status: Order["status"]) => {
    const steps = ["pending", "confirmed", "shipped", "delivered"];
    const currentIndex = steps.indexOf(status);
    return status === "cancelled" ? -1 : currentIndex;
  };

  const progressIndex = getOrderProgress(order.status);

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center mb-6">
        <button
          onClick={onBack}
          className="flex items-center text-terracotta-600 hover:text-terracotta-700 transition-colors mr-4"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Orders
        </button>
      </div>

      <div className="bg-white border border-stone-200 rounded-md shadow-sm">
        {/* Order Header */}
        <div className="border-b border-stone-200 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-medium text-stone-900 mb-2">
                Order {order.orderNumber}
              </h1>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-stone-600">
                <span>
                  Placed on {new Date(order.date).toLocaleDateString()}
                </span>
                <span className="hidden sm:inline">•</span>
                <span>Total: ₹{order.total.toFixed(2)}</span>
              </div>
            </div>
            <div
              className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium ${getStatusColor(
                order.status
              )}`}
            >
              {getStatusIcon(order.status)}
              <span className="ml-2 capitalize">{order.status}</span>
            </div>
          </div>
        </div>

        {/* Order Progress */}
        {order.status !== "cancelled" && (
          <div className="border-b border-stone-200 p-4 sm:p-6">
            <h2 className="text-lg font-medium text-stone-900 mb-4">
              Order Progress
            </h2>
            <div className="flex items-center justify-between relative">
              {["Pending", "Confirmed", "Shipped", "Delivered"].map(
                (step, index) => (
                  <div
                    key={step}
                    className="flex flex-col items-center relative z-10"
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        index <= progressIndex
                          ? "bg-terracotta-600 text-white"
                          : "bg-stone-200 text-stone-500"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <span
                      className={`text-xs mt-2 text-center ${
                        index <= progressIndex
                          ? "text-terracotta-600"
                          : "text-stone-500"
                      }`}
                    >
                      {step}
                    </span>
                  </div>
                )
              )}

              {/* Progress Line */}
              <div className="absolute top-4 left-0 right-0 h-0.5 bg-stone-200">
                <div
                  className="h-full bg-terracotta-600 transition-all duration-300"
                  style={{ width: `${(progressIndex / 3) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* Order Items */}
        <div className="border-b border-stone-200 p-4 sm:p-6">
          <h2 className="text-lg font-medium text-stone-900 mb-4">
            Order Items
          </h2>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 p-4 bg-stone-50 rounded-md"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm sm:text-base font-medium text-stone-900 truncate">
                    {item.name}
                  </h3>
                  <p className="text-sm text-stone-600">SKU: {item.sku}</p>
                  <p className="text-sm text-stone-600">
                    Quantity: {item.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm sm:text-base font-medium text-stone-900">
                    ₹{item.price.toFixed(2)}
                  </p>
                  {item.quantity > 1 && (
                    <p className="text-xs text-stone-600">
                      ₹{(item.price / item.quantity).toFixed(2)} each
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Order Total */}
          <div className="mt-6 pt-4 border-t border-stone-200">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium text-stone-900">
                Total Amount
              </span>
              <span className="text-lg font-bold text-terracotta-700">
                ₹{order.total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Shipping & Payment Info */}
        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Shipping Address */}
            <div>
              <h3 className="text-base font-medium text-stone-900 mb-3 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-terracotta-600" />
                Shipping Address
              </h3>
              <div className="bg-stone-50 p-4 rounded-md">
                <p className="font-medium text-stone-900">
                  {order.shippingAddress.name}
                </p>
                <p className="text-sm text-stone-600 mt-1">
                  {order.shippingAddress.street}
                </p>
                <p className="text-sm text-stone-600">
                  {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                  {order.shippingAddress.pinCode}
                </p>
                <p className="text-sm text-stone-600 mt-2 flex items-center">
                  <Phone className="w-4 h-4 mr-1" />
                  {order.shippingAddress.phone}
                </p>
              </div>
            </div>

            {/* Payment & Delivery Info */}
            <div className="space-y-6">
              {/* Payment Method */}
              <div>
                <h3 className="text-base font-medium text-stone-900 mb-3 flex items-center">
                  <CreditCard className="w-5 h-5 mr-2 text-terracotta-600" />
                  Payment Method
                </h3>
                <div className="bg-stone-50 p-4 rounded-md">
                  <p className="text-sm text-stone-700">
                    {order.paymentMethod}
                  </p>
                </div>
              </div>

              {/* Tracking Info */}
              {order.trackingNumber && (
                <div>
                  <h3 className="text-base font-medium text-stone-900 mb-3 flex items-center">
                    <Package className="w-5 h-5 mr-2 text-terracotta-600" />
                    Tracking Information
                  </h3>
                  <div className="bg-stone-50 p-4 rounded-md">
                    <p className="text-sm text-stone-600">Tracking Number</p>
                    <p className="font-medium text-stone-900">
                      {order.trackingNumber}
                    </p>
                    {order.estimatedDelivery && (
                      <div className="mt-2 flex items-center text-sm text-stone-600">
                        <Calendar className="w-4 h-4 mr-1" />
                        Est. Delivery:{" "}
                        {new Date(order.estimatedDelivery).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 pt-6 border-t border-stone-200 flex flex-col sm:flex-row gap-3">
            {order.trackingNumber && (
              <button className="px-6 py-2 bg-sage-600 text-white rounded-md hover:bg-sage-700 transition-colors flex items-center justify-center">
                <Truck className="w-4 h-4 mr-2" />
                Track Package
              </button>
            )}

            {order.status === "delivered" && (
              <button className="px-6 py-2 border border-stone-300 text-stone-700 rounded-md hover:bg-stone-50 transition-colors">
                Download Invoice
              </button>
            )}

            {(order.status === "pending" || order.status === "confirmed") && (
              <button className="px-6 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50 transition-colors">
                Cancel Order
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
