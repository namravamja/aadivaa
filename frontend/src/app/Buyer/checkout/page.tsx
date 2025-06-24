"use client";

import type React from "react";
import { useState, useEffect, useMemo } from "react";
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
  Smartphone,
  Banknote,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useGetCartQuery } from "@/services/api/cartApi";
import {
  useCreateOrderMutation,
  useVerifyOrderMutation,
} from "@/services/api/orderApi";
import { useGetBuyerQuery } from "@/services/api/buyerApi";
import { useAuth } from "@/hooks/useAuth";
import { useAuthModal } from "@/app/(auth)/components/auth-modal-provider";

// Razorpay types
declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: any) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
  modal: {
    ondismiss: () => void;
  };
}

export default function CheckoutPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading, user } = useAuth("buyer");
  const { openBuyerLogin } = useAuthModal();

  const {
    data: buyerResponse,
    isLoading: isBuyerLoading,
    error: buyerError,
    refetch: refetchBuyer,
  } = useGetBuyerQuery(undefined, {
    skip: !isAuthenticated,
    refetchOnMountOrArgChange: true,
  });

  const {
    data: cartResponse,
    isLoading: isLoadingCart,
    error: cartError,
    refetch: refetchCart,
  } = useGetCartQuery(undefined, {
    skip: !isAuthenticated,
    refetchOnMountOrArgChange: true,
  });

  const [createOrder] = useCreateOrderMutation();
  const [verifyOrder] = useVerifyOrderMutation();

  // Load Razorpay script
  useEffect(() => {
    const loadRazorpay = () => {
      if (window.Razorpay) {
        setRazorpayLoaded(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => setRazorpayLoaded(true);
      script.onerror = () => {
        console.error("Failed to load Razorpay SDK");
        toast.error("Payment system unavailable. Please try again later.");
      };
      document.body.appendChild(script);
    };

    loadRazorpay();
  }, []);

  // Extract data from cache responses
  const buyerData = useMemo(() => {
    if (!buyerResponse) return null;

    if (
      buyerResponse &&
      typeof buyerResponse === "object" &&
      "data" in buyerResponse
    ) {
      return buyerResponse.data;
    }

    return buyerResponse;
  }, [buyerResponse]);

  const cartItems = useMemo(() => {
    if (!cartResponse) return [];

    if (
      cartResponse &&
      typeof cartResponse === "object" &&
      "data" in cartResponse
    ) {
      return Array.isArray(cartResponse.data) ? cartResponse.data : [];
    }

    return Array.isArray(cartResponse) ? cartResponse : [];
  }, [cartResponse]);

  const addresses = useMemo(() => {
    return buyerData?.addresses || [];
  }, [buyerData]);

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

  // Safe calculation with proper null checks
  const subtotal = useMemo(() => {
    return cartItems.reduce((sum: number, item: any) => {
      const price = item?.product?.sellingPrice
        ? Number.parseFloat(item.product.sellingPrice)
        : 0;
      const quantity = item?.quantity || 0;
      return sum + price * quantity;
    }, 0);
  }, [cartItems]);

  const shipping = subtotal >= 100 ? 0 : 15;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  // Handle Razorpay payment
  const handleRazorpayPayment = async (razorpayOrderData: any) => {
    if (!razorpayLoaded) {
      toast.error("Payment system is loading. Please try again.");
      return;
    }

    const selectedAddress = addresses[selectedAddressIndex];

    const options: RazorpayOptions = {
      key: razorpayOrderData.razorpayKeyId,
      amount: razorpayOrderData.totalAmount,
      currency: razorpayOrderData.currency,
      name: "Aadivaa Earth",
      description: "Order Payment",
      order_id: razorpayOrderData.razorpayOrderId,
      handler: async (response: any) => {
        try {
          setIsLoading(true);

          // Verify payment with backend
          const verificationResult = await verifyOrder({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          }).unwrap();

          // Refetch cart and buyer data after successful payment
          await Promise.all([refetchCart(), refetchBuyer()]);

          toast.success("Payment successful! Order placed.", {
            duration: 3000,
            icon: "🎉",
          });

          router.push(`/Buyer/Orders/${verificationResult.data.id}`);
        } catch (error: any) {
          console.error("Payment verification failed:", error);
          const errorMessage =
            error?.data?.message || "Payment verification failed";
          toast.error(errorMessage, { duration: 3000 });
        } finally {
          setIsLoading(false);
        }
      },
      prefill: {
        name: `${selectedAddress?.firstName || buyerData?.firstName || ""} ${
          selectedAddress?.lastName || buyerData?.lastName || ""
        }`,
        email: buyerData?.email || "",
        contact: selectedAddress?.phone || buyerData?.phone || "",
      },
      theme: {
        color: "#D97706", // terracotta color
      },
      modal: {
        ondismiss: () => {
          setIsLoading(false);
          toast.error("Payment cancelled");
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  // Handle COD order
  const handleCODOrder = async () => {
    try {
      const selectedAddress = addresses[selectedAddressIndex];

      const orderData = {
        addressIds: [selectedAddress.id],
        paymentMethod: "cod",
      };

      const result = await createOrder(orderData).unwrap();

      // Refetch cart and buyer data after placing order
      await Promise.all([refetchCart(), refetchBuyer()]);

      toast.success("Order placed successfully!", {
        duration: 3000,
        icon: "🎉",
      });

      router.push(`/Buyer/Orders/${result.data.id}`);
    } catch (error: any) {
      console.error("Error placing COD order:", error);
      const errorMessage = error?.data?.message || "Failed to place order";
      toast.error(errorMessage, { duration: 3000 });
    }
  };

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
      if (paymentMethod === "cod") {
        await handleCODOrder();
      } else {
        // Handle Razorpay payments (card, upi, etc.)
        const orderData = {
          addressIds: [selectedAddress.id],
          paymentMethod: "razorpay",
        };

        const result = await createOrder(orderData).unwrap();

        if (result.data.razorpayOrderId) {
          await handleRazorpayPayment(result.data);
        } else {
          throw new Error("Failed to create Razorpay order");
        }
      }
    } catch (error: any) {
      console.error("Error placing order:", error);
      const errorMessage = error?.data?.message || "Failed to place order";
      toast.error(errorMessage, { duration: 3000 });
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
                <div className="space-y-4">
                  {/* Card Payment */}
                  <label
                    className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                      paymentMethod === "card"
                        ? "border-terracotta-600 bg-terracotta-50"
                        : "border-stone-200 hover:border-stone-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={paymentMethod === "card"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3"
                    />
                    <CreditCard className="w-5 h-5 text-stone-600 mr-3" />
                    <div>
                      <span className="text-stone-900 font-medium">
                        Credit/Debit Card
                      </span>
                      <p className="text-stone-500 text-sm">
                        Visa, MasterCard, RuPay
                      </p>
                    </div>
                  </label>

                  {/* UPI Payment */}
                  <label
                    className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                      paymentMethod === "upi"
                        ? "border-terracotta-600 bg-terracotta-50"
                        : "border-stone-200 hover:border-stone-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="upi"
                      checked={paymentMethod === "upi"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3"
                    />
                    <Smartphone className="w-5 h-5 text-stone-600 mr-3" />
                    <div>
                      <span className="text-stone-900 font-medium">UPI</span>
                      <p className="text-stone-500 text-sm">
                        Pay using UPI apps like GPay, PhonePe, Paytm
                      </p>
                    </div>
                  </label>

                  {/* Net Banking */}
                  <label
                    className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                      paymentMethod === "netbanking"
                        ? "border-terracotta-600 bg-terracotta-50"
                        : "border-stone-200 hover:border-stone-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="netbanking"
                      checked={paymentMethod === "netbanking"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3"
                    />
                    <Banknote className="w-5 h-5 text-stone-600 mr-3" />
                    <div>
                      <span className="text-stone-900 font-medium">
                        Net Banking
                      </span>
                      <p className="text-stone-500 text-sm">
                        Pay using your bank account
                      </p>
                    </div>
                  </label>

                  {/* Cash on Delivery */}
                  <label
                    className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                      paymentMethod === "cod"
                        ? "border-terracotta-600 bg-terracotta-50"
                        : "border-stone-200 hover:border-stone-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3"
                    />
                    <Truck className="w-5 h-5 text-stone-600 mr-3" />
                    <div>
                      <span className="text-stone-900 font-medium">
                        Cash on Delivery
                      </span>
                      <p className="text-stone-500 text-sm">
                        Pay when your order is delivered
                      </p>
                    </div>
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
                            item.product?.productImages?.[0] || "/Profile.jpg"
                          }
                          alt={item.product?.productName || "Product"}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-stone-900 truncate">
                          {item.product?.productName || "Unknown Product"}
                        </h3>
                        <p className="text-xs text-stone-500">
                          Qty: {item.quantity || 0}
                        </p>
                      </div>
                      <span className="text-sm font-medium text-stone-900">
                        ₹
                        {(
                          Number.parseFloat(item.product?.sellingPrice || "0") *
                          (item.quantity || 0)
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
                  disabled={
                    isLoading ||
                    addresses.length === 0 ||
                    (paymentMethod !== "cod" && !razorpayLoaded)
                  }
                  className="w-full bg-terracotta-600 hover:bg-terracotta-700 text-white px-6 py-3 font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <Loader2 className="animate-spin h-4 w-4 mr-2" />
                      {paymentMethod === "cod"
                        ? "Placing Order..."
                        : "Processing Payment..."}
                    </span>
                  ) : addresses.length === 0 ? (
                    "Add Address to Continue"
                  ) : paymentMethod !== "cod" && !razorpayLoaded ? (
                    "Loading Payment System..."
                  ) : (
                    <span className="flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      {paymentMethod === "cod" ? "Place Order" : "Pay Now"} - ₹
                      {total.toFixed(2)}
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
