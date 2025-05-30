"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Plus, Minus, ShoppingBag, ArrowRight, Trash2 } from "lucide-react";

interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  artist: string;
  quantity: number;
  stock: number;
  category: string;
}

// Mock cart data - replace with actual API calls
const mockCartItems: CartItem[] = [
  {
    id: "1",
    productId: "prod1",
    name: "Handwoven Basket",
    price: 89.99,
    image: "/placeholder.svg?height=100&width=100",
    artist: "Maria Santos",
    quantity: 2,
    stock: 5,
    category: "Home Decor",
  },
  {
    id: "2",
    productId: "prod2",
    name: "Ceramic Bowl Set",
    price: 124.5,
    image: "/placeholder.svg?height=100&width=100",
    artist: "David Chen",
    quantity: 1,
    stock: 3,
    category: "Kitchenware",
  },
  {
    id: "3",
    productId: "prod3",
    name: "Beaded Necklace",
    price: 45.99,
    image: "/placeholder.svg?height=100&width=100",
    artist: "Sarah Johnson",
    quantity: 1,
    stock: 8,
    category: "Jewelry",
  },
];

export default function BuyerCartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>(mockCartItems);
  const [isLoading, setIsLoading] = useState(false);

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    setIsLoading(true);
    try {
      // API call would go here
      setCartItems((items) =>
        items.map((item) =>
          item.id === itemId
            ? { ...item, quantity: Math.min(newQuantity, item.stock) }
            : item
        )
      );
    } catch (error) {
      console.error("Failed to update quantity:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const removeItem = async (itemId: string) => {
    setIsLoading(true);
    try {
      // API call would go here
      setCartItems((items) => items.filter((item) => item.id !== itemId));
    } catch (error) {
      console.error("Failed to remove item:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    setIsLoading(true);
    try {
      // API call would go here
      setCartItems([]);
    } catch (error) {
      console.error("Failed to clear cart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal >= 100 ? 0 : 15;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

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
            <Link href="/products">
              <button className="bg-terracotta-600 hover:bg-terracotta-700 text-white px-6 py-3 font-medium transition-colors">
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
            className="text-red-600 border border-red-200 hover:bg-red-50 px-4 py-2 font-medium transition-colors disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4 mr-2 inline" />
            Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-white border border-stone-200">
                <div className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="relative w-20 h-20 flex-shrink-0">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <Link href={`/products/${item.productId}`}>
                            <h3 className="font-medium text-stone-900 hover:text-terracotta-600 transition-colors">
                              {item.name}
                            </h3>
                          </Link>
                          <p className="text-sm text-stone-500">
                            By {item.artist}
                          </p>
                          <span className="inline-block bg-stone-100 text-stone-800 text-xs px-2 py-1 mt-1">
                            {item.category}
                          </span>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          disabled={isLoading}
                          className="text-stone-400 hover:text-red-600 p-1 transition-colors disabled:opacity-50"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center border border-stone-300">
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              disabled={isLoading || item.quantity <= 1}
                              className="h-8 w-8 flex items-center justify-center hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-3 py-1 text-sm font-medium min-w-[2rem] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              disabled={
                                isLoading || item.quantity >= item.stock
                              }
                              className="h-8 w-8 flex items-center justify-center hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <span className="text-xs text-stone-500">
                            {item.stock} in stock
                          </span>
                        </div>

                        <div className="text-right">
                          <p className="font-medium text-stone-900">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                          <p className="text-sm text-stone-500">
                            ${item.price.toFixed(2)} each
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
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
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-600">Shipping</span>
                    <span className="text-stone-900">
                      {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-600">Tax</span>
                    <span className="text-stone-900">${tax.toFixed(2)}</span>
                  </div>
                  <hr className="border-stone-200" />
                  <div className="flex justify-between font-medium text-lg">
                    <span className="text-stone-900">Total</span>
                    <span className="text-stone-900">${total.toFixed(2)}</span>
                  </div>
                </div>

                {shipping > 0 && (
                  <div className="bg-blue-50 border border-blue-200 p-3 mb-6">
                    <p className="text-sm text-blue-800">
                      Add ${(100 - subtotal).toFixed(2)} more for free shipping!
                    </p>
                  </div>
                )}

                <Link href="/buyer/checkout">
                  <button className="w-full bg-terracotta-600 hover:bg-terracotta-700 text-white px-6 py-3 font-medium mb-4 transition-colors">
                    Proceed to Checkout
                    <ArrowRight className="w-4 h-4 ml-2 inline" />
                  </button>
                </Link>

                <Link href="/products">
                  <button className="w-full border border-stone-300 text-stone-700 hover:bg-stone-50 px-6 py-3 font-medium transition-colors">
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
