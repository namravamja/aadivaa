"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  X,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Trash2,
  User,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  useGetCartQuery,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
} from "@/services/api/cartApi";
import { useAuth } from "@/hooks/useAuth";
import { useAuthModal } from "@/app/(auth)/components/auth-modal-provider";

export default function BuyerCartPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated, isLoading: authLoading } = useAuth("buyer");
  const { openBuyerLogin } = useAuthModal();

  // RTK Query hooks - only run if authenticated
  const {
    data: cartResponse,
    isLoading: isLoadingCart,
    error,
    refetch: refetchCart,
  } = useGetCartQuery(undefined, {
    skip: !isAuthenticated,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const [updateCartItem] = useUpdateCartItemMutation();
  const [removeFromCart] = useRemoveFromCartMutation();

  // Extract cart items from the response, handling both old and new API response formats
  const cartItems = useMemo(() => {
    if (!cartResponse) return [];

    // Handle new Redis cache response format: {source: 'cache', data: [...]}
    if (cartResponse.data && Array.isArray(cartResponse.data)) {
      return cartResponse.data;
    }

    // Handle old direct array format: [...]
    if (Array.isArray(cartResponse)) {
      return cartResponse;
    }

    return [];
  }, [cartResponse]);

  const updateQuantity = async (
    productId: string,
    newQuantity: number,
    maxStock: number
  ) => {
    if (newQuantity < 1) return;

    // Check if new quantity exceeds available stock
    if (newQuantity > maxStock) {
      toast.error(`Only ${maxStock} items available in stock`, {
        duration: 3000,
        icon: "⚠️",
      });
      return;
    }

    setIsLoading(true);
    try {
      await updateCartItem({ productId, quantity: newQuantity }).unwrap();
      toast.success("Quantity updated", {
        duration: 1500,
        icon: "✅",
      });
      // Refetch cart data after mutation
      await refetchCart();
    } catch (error: any) {
      console.error("Failed to update quantity:", error);
      const errorMessage =
        error?.data?.message || error?.message || "Failed to update quantity";
      toast.error(errorMessage, {
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeItem = async (productId: string) => {
    setIsLoading(true);
    try {
      await removeFromCart(productId).unwrap();
      toast.success("Item removed from cart", {
        duration: 2000,
        icon: "🗑️",
      });
      // Refetch cart data after mutation
      await refetchCart();
    } catch (error: any) {
      console.error("Failed to remove item:", error);
      const errorMessage =
        error?.data?.message || error?.message || "Failed to remove item";
      toast.error(errorMessage, {
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    setIsLoading(true);
    try {
      // Remove all items one by one (you might want to create a bulk delete endpoint)
      await Promise.all(
        cartItems.map((item: any) => removeFromCart(item.productId).unwrap())
      );
      toast.success("Cart cleared", {
        duration: 2000,
        icon: "🧹",
      });
      // Refetch cart data after mutation
      await refetchCart();
    } catch (error: any) {
      console.error("Failed to clear cart:", error);
      const errorMessage =
        error?.data?.message || error?.message || "Failed to clear cart";
      toast.error(errorMessage, {
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate totals safely
  const subtotal = useMemo(() => {
    if (!cartItems || cartItems.length === 0) return 0;

    return cartItems.reduce((sum: number, item: any) => {
      const price = Number.parseFloat(item.product?.sellingPrice || 0);
      const quantity = item.quantity || 1;
      return sum + price * quantity;
    }, 0);
  }, [cartItems]);

  const shipping = subtotal >= 100 ? 0 : 15;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  // Show login prompt if not authenticated - UPDATED TO USE MODAL
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
              Please login to view your shopping cart.
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

  if (authLoading || isLoadingCart) {
    return (
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="flex justify-between items-center mb-8">
              <div>
                <div className="h-8 bg-stone-200 rounded w-48 mb-2"></div>
                <div className="h-4 bg-stone-200 rounded w-32"></div>
              </div>
              <div className="h-10 bg-stone-200 rounded w-24"></div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="bg-white border border-stone-200 p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-20 h-20 bg-stone-200 rounded"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-stone-200 rounded w-3/4"></div>
                        <div className="h-3 bg-stone-200 rounded w-1/2"></div>
                        <div className="h-8 bg-stone-200 rounded w-32"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="lg:col-span-1">
                <div className="bg-white border border-stone-200 p-6">
                  <div className="h-6 bg-stone-200 rounded w-32 mb-6"></div>
                  <div className="space-y-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="h-4 bg-stone-200 rounded"></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center py-16">
            <h1 className="text-3xl font-light text-stone-900 mb-4">
              Error loading cart
            </h1>
            <p className="text-stone-600 mb-8">Please try again later.</p>
            <button
              onClick={() => refetchCart()}
              className="bg-terracotta-600 hover:bg-terracotta-700 text-white px-6 py-3 font-medium transition-colors mr-4 cursor-pointer"
            >
              Retry
            </button>
            <Link href="/Products">
              <button className="border border-stone-300 text-stone-700 hover:bg-stone-50 px-6 py-3 font-medium transition-colors">
                Start Shopping
              </button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (cartItems.length === 0) {
    return (
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center py-16">
            <ShoppingBag className="w-24 h-24 mx-auto text-stone-300 mb-6" />
            <h1 className="text-3xl font-light text-stone-900 mb-4">
              Your cart is empty
            </h1>
            <p className="text-stone-600 mb-8">
              Discover our beautiful handcrafted items and add them to your
              cart.
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

  return (
    <main className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-light text-stone-900 mb-2">
              Shopping Cart
            </h1>
            <p className="text-stone-600">
              {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in
              your cart
            </p>
          </div>
          <button
            onClick={clearCart}
            disabled={isLoading}
            className="text-red-600 border border-red-200 hover:bg-red-50 px-4 py-2 font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 className="w-4 h-4 mr-2 inline" />
            Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item: any) => {
              const availableStock = Number.parseInt(
                item.product?.availableStock || "0"
              );
              const isQuantityAtMax = item.quantity >= availableStock;
              const isOutOfStock = availableStock === 0;

              return (
                <div key={item.id} className="bg-white border border-stone-200">
                  <div className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="relative w-20 h-20 flex-shrink-0">
                        <Image
                          src={
                            item.product?.productImages?.[0] || "/Profile.jpg"
                          }
                          alt={item.product?.productName || "Product"}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <Link href={`/Products/${item.product?.id || ""}`}>
                              <h3 className="font-medium text-stone-900 hover:text-terracotta-600 transition-colors">
                                {item.product?.productName || "Unknown Product"}
                              </h3>
                            </Link>
                            <p className="text-sm text-stone-500">
                              By{" "}
                              {item.product?.artist?.fullName ||
                                "Unknown Artist"}
                            </p>
                            <span className="inline-block bg-stone-100 text-stone-800 text-xs px-2 py-1 mt-1">
                              {item.product?.category || "Uncategorized"}
                            </span>
                          </div>
                          <button
                            onClick={() => removeItem(item.productId)}
                            disabled={isLoading}
                            className="text-stone-400 hover:text-red-600 p-1 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center border border-stone-300">
                              <button
                                onClick={() =>
                                  updateQuantity(
                                    item.productId,
                                    item.quantity - 1,
                                    availableStock
                                  )
                                }
                                disabled={isLoading || item.quantity <= 1}
                                className="h-8 w-8 flex items-center justify-center hover:bg-stone-50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="px-3 py-1 text-sm font-medium min-w-[2rem] text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(
                                    item.productId,
                                    item.quantity + 1,
                                    availableStock
                                  )
                                }
                                disabled={
                                  isLoading || isQuantityAtMax || isOutOfStock
                                }
                                className="h-8 w-8 flex items-center justify-center hover:bg-stone-50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                title={
                                  isQuantityAtMax
                                    ? `Maximum quantity reached (${availableStock} available)`
                                    : isOutOfStock
                                    ? "Out of stock"
                                    : "Increase quantity"
                                }
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            <div className="text-xs">
                              <span
                                className={`${
                                  isOutOfStock
                                    ? "text-red-500"
                                    : "text-stone-500"
                                }`}
                              >
                                {isOutOfStock
                                  ? "Out of stock"
                                  : `${availableStock} in stock`}
                              </span>
                              {isQuantityAtMax && !isOutOfStock && (
                                <span className="text-amber-600 block">
                                  Maximum reached
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="text-right">
                            <p className="font-medium text-stone-900">
                              ₹
                              {(
                                Number.parseFloat(
                                  item.product?.sellingPrice || "0"
                                ) * item.quantity
                              ).toFixed(2)}
                            </p>
                            <p className="text-sm text-stone-500">
                              ₹
                              {Number.parseFloat(
                                item.product?.sellingPrice || "0"
                              ).toFixed(2)}{" "}
                              each
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-stone-200 sticky top-24">
              <div className="p-6">
                <h2 className="text-xl font-medium text-stone-900 mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-stone-600">Subtotal</span>
                    <span className="text-stone-900">
                      ₹{subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-600">Shipping</span>
                    <span className="text-stone-900">
                      {shipping === 0 ? "Free" : `₹${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-600">Tax</span>
                    <span className="text-stone-900">₹{tax.toFixed(2)}</span>
                  </div>
                  <hr className="border-stone-200" />
                  <div className="flex justify-between font-medium text-lg">
                    <span className="text-stone-900">Total</span>
                    <span className="text-stone-900">₹{total.toFixed(2)}</span>
                  </div>
                </div>

                {shipping > 0 && (
                  <div className="bg-blue-50 border border-blue-200 p-3 mb-6">
                    <p className="text-sm text-blue-800">
                      Add ₹{(100 - subtotal).toFixed(2)} more for free shipping!
                    </p>
                  </div>
                )}

                <Link href="/Buyer/checkout">
                  <button className="w-full bg-terracotta-600 hover:bg-terracotta-700 text-white px-6 py-3 font-medium mb-4 transition-colors cursor-pointer">
                    Proceed to Checkout
                    <ArrowRight className="w-4 h-4 ml-2 inline" />
                  </button>
                </Link>

                <Link href="/Products">
                  <button className="w-full border border-stone-300 text-stone-700 hover:bg-stone-50 px-6 py-3 font-medium transition-colors cursor-pointer">
                    Continue Shopping
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
