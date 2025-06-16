"use client";

import type React from "react";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  CreditCard,
  Truck,
  Shield,
  CheckCircle,
  User,
  MapPin,
  Plus,
} from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useGetCartQuery } from "@/services/api/cartApi";
import { useCreateOrderMutation } from "@/services/api/orderApi";
import { useGetBuyerQuery } from "@/services/api/buyerApi";
import { useAuth } from "@/hooks/useAuth";
import { useAuthModal } from "@/app/(auth)/components/auth-modal-provider";

export default function CheckoutPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const { openBuyerLogin } = useAuthModal();

  const {
    data: buyerData,
    isLoading: isBuyerLoading,
    error: buyerError,
    refetch: refetchBuyer,
  } = useGetBuyerQuery(undefined, {
    skip: !isAuthenticated,
    refetchOnMountOrArgChange: true,
  });

  const {
    data: cartData,
    isLoading: isLoadingCart,
    error: cartError,
    refetch: refetchCart,
  } = useGetCartQuery(undefined, {
    skip: !isAuthenticated,
    refetchOnMountOrArgChange: true,
  });

  const [createOrder] = useCreateOrderMutation();

  const cartItems = cartData || [];
  const addresses = buyerData?.addresses || [];
  console.log(addresses);

  // Effect to set default address when addresses are loaded
  useEffect(() => {
    if (addresses.length > 0) {
      const defaultAddressIndex = addresses.findIndex(
        (address: any) => address.isDefault
      );
      if (defaultAddressIndex !== -1) {
        setSelectedAddressIndex(defaultAddressIndex);
      }
    }
  }, [addresses]);

  const addressIds = addresses.map((address: any) => address.id);

  const subtotal = cartItems.reduce(
    (sum: number, item: any) =>
      sum + Number.parseFloat(item.product.sellingPrice) * item.quantity,
    0
  );
  const shipping = subtotal >= 100 ? 0 : 15;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (addresses.length === 0) {
      toast.error("Please add a shipping address first");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    const selectedAddress = addresses[selectedAddressIndex];
    if (!selectedAddress) {
      toast.error("Please select a shipping address");
      return;
    }

    setIsLoading(true);

    try {
      const orderData = {
        addressIds: addressIds[0],
        paymentMethod,
        buyer: {
          connect: {
            id: user?.id || buyerData?.id,
          },
        },
      };

      const result = await createOrder(orderData).unwrap();

      // ✅ Refetch cart and buyer data after placing order
      await refetchCart();
      await refetchBuyer();

      toast.success("Order placed successfully!", {
        duration: 3000,
        icon: "🎉",
      });

      router.push(`/Buyer/Orders/${result.data.id}`);
    } catch (error: any) {
      console.error("Error placing order:", error);
      const errorMessage =
        error?.data?.message || error?.message || "Failed to place order";
      toast.error(errorMessage, {
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle login button click
  const handleLoginClick = () => {
    openBuyerLogin();
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
              Please login to proceed with checkout.
            </p>
            <button
              onClick={handleLoginClick}
              className="bg-terracotta-600 hover:bg-terracotta-700 text-white px-6 py-3 font-medium transition-colors cursor-pointer mr-4"
            >
              Login to Continue
            </button>
            <Link href="/Buyer/Cart">
              <button className="border border-stone-300 text-stone-700 hover:bg-stone-50 px-6 py-3 font-medium transition-colors cursor-pointer">
                Back to Cart
              </button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (authLoading || isLoadingCart || isBuyerLoading) {
    return (
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-stone-200 rounded w-48 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
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

  if (cartError || cartItems.length === 0) {
    return (
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center py-16">
            <h1 className="text-3xl font-light text-stone-900 mb-4">
              Your cart is empty
            </h1>
            <p className="text-stone-600 mb-8">
              Add some items to your cart before proceeding to checkout.
            </p>
            <Link href="/Products">
              <button className="bg-terracotta-600 hover:bg-terracotta-700 text-white px-6 py-3 font-medium transition-colors cursor-pointer">
                Start Shopping
              </button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Show address required message if no addresses
  if (!isBuyerLoading && addresses.length === 0) {
    return (
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center py-16">
            <MapPin className="w-24 h-24 mx-auto text-stone-300 mb-6" />
            <h1 className="text-3xl font-light text-stone-900 mb-4">
              Address Required
            </h1>
            <p className="text-stone-600 mb-8">
              Please update your address first before proceeding to checkout.
            </p>
            <Link href="/Buyer/Profile">
              <button className="bg-terracotta-600 hover:bg-terracotta-700 text-white px-6 py-3 font-medium transition-colors cursor-pointer mr-4">
                Add Address
              </button>
            </Link>
            <Link href="/Buyer/Cart">
              <button className="border border-stone-300 text-stone-700 hover:bg-stone-50 px-6 py-3 font-medium transition-colors cursor-pointer">
                Back to Cart
              </button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link
            href="/Buyer/Cart"
            className="flex items-center text-stone-600 hover:text-terracotta-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to cart
          </Link>
        </div>

        <h1 className="text-3xl font-light text-stone-900 mb-8">Checkout</h1>

        <form onSubmit={handlePlaceOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Forms */}
            <div className="space-y-6">
              {/* Shipping Address */}
              <div className="bg-white border border-stone-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Truck className="w-5 h-5 text-terracotta-600 mr-2" />
                    <h2 className="text-xl font-medium text-stone-900">
                      Shipping Address
                    </h2>
                  </div>
                  <Link href="/Buyer/Profile">
                    <button
                      type="button"
                      className="flex items-center text-terracotta-600 hover:text-terracotta-700 text-sm font-medium cursor-pointer"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add New
                    </button>
                  </Link>
                </div>

                {addresses.length > 0 ? (
                  <div className="space-y-3">
                    {addresses.map((address: any, index: number) => (
                      <label
                        key={index}
                        className={`flex items-start space-x-3 p-4 border rounded-md hover:border-terracotta-300 cursor-pointer transition-colors ${
                          selectedAddressIndex === index
                            ? "border-terracotta-600 bg-terracotta-50"
                            : "border-stone-200"
                        }`}
                      >
                        <input
                          type="radio"
                          name="shippingAddress"
                          value={index}
                          checked={selectedAddressIndex === index}
                          onChange={() => setSelectedAddressIndex(index)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium text-stone-900">
                              {address.firstName} {address.lastName}
                            </span>
                            {address.isDefault && (
                              <span className="bg-terracotta-100 text-terracotta-800 text-xs px-2 py-1 rounded">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-stone-600 text-sm leading-relaxed">
                            {typeof address === "string"
                              ? address
                              : `${address.street || ""} ${
                                  address.apartment
                                    ? `, ${address.apartment}`
                                    : ""
                                } ${address.city || ""} ${
                                  address.state || ""
                                } ${address.postalCode || ""} ${
                                  address.country || ""
                                }`.trim()}
                          </p>
                          {address.phone && (
                            <p className="text-stone-500 text-xs mt-1">
                              Phone: {address.phone}
                            </p>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-stone-50 rounded-md">
                    <MapPin className="w-12 h-12 mx-auto text-stone-300 mb-3" />
                    <p className="text-stone-600 mb-4">No addresses found</p>
                    <Link href="/Buyer/Profile">
                      <button
                        type="button"
                        className="bg-terracotta-600 hover:bg-terracotta-700 text-white px-4 py-2 text-sm font-medium transition-colors cursor-pointer"
                      >
                        Add Address
                      </button>
                    </Link>
                  </div>
                )}
              </div>

              {/* Payment Method */}
              <div className="bg-white border border-stone-200 p-6">
                <div className="flex items-center mb-4">
                  <CreditCard className="w-5 h-5 text-terracotta-600 mr-2" />
                  <h2 className="text-xl font-medium text-stone-900">
                    Payment Method
                  </h2>
                </div>
                <div className="space-y-3">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={paymentMethod === "card"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3"
                    />
                    <span className="text-stone-700">Credit/Debit Card</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="upi"
                      checked={paymentMethod === "upi"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3"
                    />
                    <span className="text-stone-700">UPI</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3"
                    />
                    <span className="text-stone-700">Cash on Delivery</span>
                  </label>
                </div>
              </div>

              {/* Security Notice */}
              <div className="bg-green-50 border border-green-200 p-4 rounded-md">
                <div className="flex items-center">
                  <Shield className="w-5 h-5 text-green-600 mr-2" />
                  <span className="text-green-800 text-sm">
                    Your payment information is secure and encrypted
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              <div className="bg-white border border-stone-200 p-6">
                <h2 className="text-xl font-medium text-stone-900 mb-6">
                  Order Summary
                </h2>

                {/* Order Items */}
                <div className="space-y-4 mb-6">
                  {cartItems.map((item: any) => (
                    <div key={item.id} className="flex items-center space-x-3">
                      <div className="relative w-12 h-12 flex-shrink-0">
                        <Image
                          src={
                            item.product.productImages?.[0] ||
                            "/Profile.jpg"
                          }
                          alt={item.product.productName}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-stone-900 truncate">
                          {item.product.productName}
                        </h3>
                        <p className="text-xs text-stone-500">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <span className="text-sm font-medium text-stone-900">
                        ₹
                        {(
                          Number.parseFloat(item.product.sellingPrice) *
                          item.quantity
                        ).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <hr className="border-stone-200 mb-4" />

                {/* Pricing Breakdown */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-600">Subtotal</span>
                    <span className="text-stone-900">
                      ₹{subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-600">Shipping</span>
                    <span className="text-stone-900">
                      {shipping === 0 ? "Free" : `₹${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-600">Tax</span>
                    <span className="text-stone-900">₹{tax.toFixed(2)}</span>
                  </div>
                  <hr className="border-stone-200" />
                  <div className="flex justify-between font-medium text-lg">
                    <span className="text-stone-900">Total</span>
                    <span className="text-stone-900">₹{total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Place Order Button */}
                <button
                  type="submit"
                  disabled={isLoading || addresses.length === 0}
                  className="w-full bg-terracotta-600 hover:bg-terracotta-700 text-white px-6 py-3 font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Placing Order...
                    </span>
                  ) : addresses.length === 0 ? (
                    "Add Address to Continue"
                  ) : (
                    <span className="flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Place Order - ₹{total.toFixed(2)}
                    </span>
                  )}
                </button>

                <p className="text-xs text-stone-500 text-center mt-4">
                  By placing your order, you agree to our Terms of Service and
                  Privacy Policy.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
