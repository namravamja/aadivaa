"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Package, Eye, Download, Filter, Search, Calendar } from "lucide-react";

interface OrderItem {
  id: string;
  productId: string;
  name: string;
  image: string;
  artist: string;
  quantity: number;
  price: number;
}

interface Order {
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
  items: OrderItem[];
  shippingAddress: {
    firstName: string;
    lastName: string;
    addressLine1: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  createdAt: string;
  updatedAt: string;
  estimatedDelivery?: string;
}

// Mock orders data
const mockOrders: Order[] = [
  {
    id: "1",
    orderNumber: "TC-2024-001",
    status: "DELIVERED",
    paymentStatus: "PAID",
    totalAmount: 234.48,
    shippingCost: 15.0,
    taxAmount: 18.48,
    items: [
      {
        id: "1",
        productId: "prod1",
        name: "Handwoven Basket",
        image: "/placeholder.svg?height=80&width=80",
        artist: "Maria Santos",
        quantity: 2,
        price: 89.99,
      },
      {
        id: "2",
        productId: "prod2",
        name: "Ceramic Vase",
        image: "/placeholder.svg?height=80&width=80",
        artist: "David Chen",
        quantity: 1,
        price: 65.0,
      },
    ],
    shippingAddress: {
      firstName: "John",
      lastName: "Doe",
      addressLine1: "123 Main St",
      city: "New York",
      state: "NY",
      postalCode: "10001",
      country: "USA",
    },
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-20T14:45:00Z",
    estimatedDelivery: "2024-01-18T00:00:00Z",
  },
  {
    id: "2",
    orderNumber: "TC-2024-002",
    status: "SHIPPED",
    paymentStatus: "PAID",
    totalAmount: 156.99,
    shippingCost: 0,
    taxAmount: 11.99,
    items: [
      {
        id: "3",
        productId: "prod3",
        name: "Beaded Necklace",
        image: "/placeholder.svg?height=80&width=80",
        artist: "Sarah Johnson",
        quantity: 1,
        price: 45.99,
      },
      {
        id: "4",
        productId: "prod4",
        name: "Wooden Sculpture",
        image: "/placeholder.svg?height=80&width=80",
        artist: "Michael Brown",
        quantity: 1,
        price: 99.0,
      },
    ],
    shippingAddress: {
      firstName: "John",
      lastName: "Doe",
      addressLine1: "123 Main St",
      city: "New York",
      state: "NY",
      postalCode: "10001",
      country: "USA",
    },
    createdAt: "2024-01-25T09:15:00Z",
    updatedAt: "2024-01-27T16:20:00Z",
    estimatedDelivery: "2024-01-30T00:00:00Z",
  },
];

const statusColors = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  PROCESSING: "bg-purple-100 text-purple-800",
  SHIPPED: "bg-orange-100 text-orange-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

const paymentStatusColors = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PAID: "bg-green-100 text-green-800",
  FAILED: "bg-red-100 text-red-800",
  REFUNDED: "bg-gray-100 text-gray-800",
};

export default function BuyerOrdersPage() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(mockOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");

  useEffect(() => {
    let filtered = orders;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.items.some(
            (item) =>
              item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              item.artist.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    // Date filter
    if (dateFilter !== "all") {
      const now = new Date();
      const filterDate = new Date();

      switch (dateFilter) {
        case "week":
          filterDate.setDate(now.getDate() - 7);
          break;
        case "month":
          filterDate.setMonth(now.getMonth() - 1);
          break;
        case "3months":
          filterDate.setMonth(now.getMonth() - 3);
          break;
        case "year":
          filterDate.setFullYear(now.getFullYear() - 1);
          break;
      }

      filtered = filtered.filter(
        (order) => new Date(order.createdAt) >= filterDate
      );
    }

    setFilteredOrders(filtered);
  }, [orders, searchTerm, statusFilter, dateFilter]);

  const downloadInvoice = (orderId: string) => {
    // Implementation for downloading invoice
    console.log(`Downloading invoice for order ${orderId}`);
  };

  if (orders.length === 0) {
    return (
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center py-16">
            <Package className="w-24 h-24 mx-auto text-stone-300 mb-6" />
            <h1 className="text-3xl font-light text-stone-900 mb-4">
              No orders yet
            </h1>
            <p className="text-stone-600 mb-8">
              Start shopping to see your orders here.
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
        <div className="mb-8">
          <h1 className="text-3xl font-light text-stone-900 mb-2">My Orders</h1>
          <p className="text-stone-600">Track and manage your orders</p>
        </div>

        {/* Filters */}
        <div className="bg-white border border-stone-200 shadow-sm mb-8">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-stone-300 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent"
              >
                <option value="all">All Statuses</option>
                <option value="PENDING">Pending</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="PROCESSING">Processing</option>
                <option value="SHIPPED">Shipped</option>
                <option value="DELIVERED">Delivered</option>
                <option value="CANCELLED">Cancelled</option>
              </select>

              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent"
              >
                <option value="all">All Time</option>
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
                <option value="3months">Last 3 Months</option>
                <option value="year">Last Year</option>
              </select>

              <div className="flex items-center text-sm text-stone-600">
                <Filter className="w-4 h-4 mr-2" />
                {filteredOrders.length} of {orders.length} orders
              </div>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white border border-stone-200 shadow-sm"
            >
              <div className="p-6 border-b border-stone-200">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-stone-900">
                      Order {order.orderNumber}
                    </h3>
                    <p className="text-sm text-stone-500 mt-1">
                      Placed on {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`inline-block px-2 py-1 text-xs font-medium ${
                        statusColors[order.status]
                      }`}
                    >
                      {order.status}
                    </span>
                    <span
                      className={`inline-block px-2 py-1 text-xs font-medium ${
                        paymentStatusColors[order.paymentStatus]
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {/* Order Items */}
                <div className="space-y-4 mb-6">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4">
                      <div className="relative w-16 h-16 flex-shrink-0">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <Link href={`/products/${item.productId}`}>
                          <h4 className="font-medium text-stone-900 hover:text-orange-600 transition-colors">
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

                <hr className="border-stone-200 my-4" />

                {/* Order Summary */}
                <div className="flex justify-between items-center mb-4">
                  <div className="text-sm text-stone-600">
                    <p>
                      Subtotal: $
                      {(
                        order.totalAmount -
                        order.shippingCost -
                        order.taxAmount
                      ).toFixed(2)}
                    </p>
                    <p>Shipping: ${order.shippingCost.toFixed(2)}</p>
                    <p>Tax: ${order.taxAmount.toFixed(2)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-medium text-stone-900">
                      Total: ${order.totalAmount.toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center pt-4 border-t border-stone-200">
                  <div className="text-sm text-stone-600">
                    {order.estimatedDelivery && order.status === "SHIPPED" && (
                      <p>
                        <Calendar className="w-4 h-4 inline mr-1" />
                        Estimated delivery:{" "}
                        {new Date(order.estimatedDelivery).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Link href={`/buyer/track-order/${order.id}`}>
                      <button className="border border-stone-300 text-stone-700 hover:bg-stone-50 px-3 py-1 text-sm font-medium transition-colors">
                        <Eye className="w-4 h-4 mr-2 inline" />
                        Track Order
                      </button>
                    </Link>
                    {order.paymentStatus === "PAID" && (
                      <button
                        onClick={() => downloadInvoice(order.id)}
                        className="border border-stone-300 text-stone-700 hover:bg-stone-50 px-3 py-1 text-sm font-medium transition-colors"
                      >
                        <Download className="w-4 h-4 mr-2 inline" />
                        Invoice
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-16">
            <Package className="w-16 h-16 mx-auto text-stone-300 mb-4" />
            <h3 className="text-lg font-medium text-stone-900 mb-2">
              No orders found
            </h3>
            <p className="text-stone-600">
              Try adjusting your filters or search terms.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
