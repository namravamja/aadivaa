"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Package,
  Eye,
  Download,
  Filter,
  Search,
  Calendar,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useGetBuyerOrdersQuery } from "@/services/api/orderApi";
import { useAuth } from "@/hooks/useAuth";

// Status color mappings
const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  processing: "bg-purple-100 text-purple-800",
  shipped: "bg-orange-100 text-orange-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const paymentStatusColors: Record<string, string> = {
  unpaid: "bg-yellow-100 text-yellow-800",
  paid: "bg-green-100 text-green-800",
  failed: "bg-red-100 text-red-800",
  refunded: "bg-gray-100 text-gray-800",
};

// Helper function to format price (assuming the API returns price in cents)
const formatPrice = (price: number) => {
  return (price / 100).toFixed(2);
};

export default function BuyerOrdersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  // RTK Query hook for fetching orders
  const {
    data: ordersResponse,
    isLoading,
    error,
    refetch,
  } = useGetBuyerOrdersQuery(
    {
      page: currentPage,
      limit: 10,
      ...(statusFilter !== "all" && { status: statusFilter }),
    },
    {
      skip: !isAuthenticated,
      refetchOnFocus: true,
      refetchOnReconnect: true,
    }
  );

  // Extract orders and pagination from the response
  const orders = ordersResponse?.data?.orders || [];
  const pagination = ordersResponse?.data?.pagination;

  // Filter orders based on search term and date
  const filteredOrders = useMemo(() => {
    let filtered = orders || [];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (order: any) =>
          order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.orderItems.some(
            (item: any) =>
              item.product.productName
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
              (item.artist?.fullName &&
                item.artist.fullName
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase())) ||
              (item.artist?.storeName &&
                item.artist.storeName
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase()))
          )
      );
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
        (order: any) => new Date(order.placedAt) >= filterDate
      );
    }

    return filtered;
  }, [orders, searchTerm, dateFilter]);

  const downloadInvoice = (orderId: string) => {
    // Implementation for downloading invoice
    console.log(`Downloading invoice for order ${orderId}`);
    // This would typically call an API endpoint to generate and download the invoice
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
              Please login to view your orders.
            </p>
            <Link href="/Buyer/login">
              <button className="bg-terracotta-600 hover:bg-terracotta-700 text-white px-6 py-3 font-medium transition-colors cursor-pointer">
                Login to Continue
              </button>
            </Link>
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
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white border border-stone-200 p-6">
                  <div className="h-6 bg-stone-200 rounded w-32 mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-stone-200 rounded w-full"></div>
                    <div className="h-4 bg-stone-200 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
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
              Error loading orders
            </h1>
            <p className="text-stone-600 mb-8">Please try again later.</p>
            <button
              onClick={() => refetch()}
              className="bg-terracotta-600 hover:bg-terracotta-700 text-white px-6 py-3 font-medium transition-colors cursor-pointer mr-4"
            >
              Retry
            </button>
            <Link href="/Products">
              <button className="border border-stone-300 text-stone-700 hover:bg-stone-50 px-6 py-3 font-medium transition-colors cursor-pointer">
                Continue Shopping
              </button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (!orders || orders.length === 0) {
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
                  className="w-full pl-10 pr-3 py-2 border border-stone-300 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent cursor-pointer"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 border border-stone-300 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>

              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent cursor-pointer"
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
          {filteredOrders.map((order: any) => (
            <div
              key={order.id}
              className="bg-white border border-stone-200 shadow-sm"
            >
              <div className="p-6 border-b border-stone-200">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                  <div>
                    <h3 className="text-lg font-medium text-stone-900">
                      Order #{order.id.slice(0, 8)}
                    </h3>
                    <p className="text-sm text-stone-500 mt-1">
                      Placed on {new Date(order.placedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                    <span
                      className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                        statusColors[order.status?.toLowerCase()] ||
                        "bg-stone-100 text-stone-800"
                      }`}
                    >
                      {order.status
                        ? order.status.charAt(0).toUpperCase() +
                          order.status.slice(1).toLowerCase()
                        : "Unknown"}
                    </span>
                    <span
                      className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                        paymentStatusColors[
                          order.paymentStatus?.toLowerCase()
                        ] || "bg-stone-100 text-stone-800"
                      }`}
                    >
                      {order.paymentStatus
                        ? order.paymentStatus.charAt(0).toUpperCase() +
                          order.paymentStatus.slice(1).toLowerCase()
                        : "Unknown"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {/* Order Items */}
                <div className="space-y-4 mb-6">
                  {order.orderItems?.map((item: any) => (
                    <div key={item.id} className="flex items-center space-x-4">
                      <div className="relative w-16 h-16 flex-shrink-0">
                        <Image
                          src={
                            item.product?.productImages?.[0] ||
                            "/placeholder.svg"
                          }
                          alt={item.product?.productName || "Product"}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                      <div className="flex-1">
                        <Link href={`/Products/${item.productId}`}>
                          <h4 className="font-medium text-stone-900 hover:text-terracotta-600 transition-colors">
                            {item.product?.productName || "Unknown Product"}
                          </h4>
                        </Link>
                        <p className="text-sm text-stone-500">
                          By{" "}
                          {item.artist?.storeName ||
                            item.artist?.fullName ||
                            "Unknown Artist"}
                        </p>
                        <p className="text-sm text-stone-600">
                          Category: {item.product?.category || "N/A"}
                        </p>
                        <p className="text-sm text-stone-600">
                          Qty: {item.quantity} × ₹
                          {formatPrice(item.priceAtPurchase)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-stone-900">
                          ₹{formatPrice(item.quantity * item.priceAtPurchase)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <hr className="border-stone-200 my-4" />

                {/* Order Summary */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
                  <div className="text-sm text-stone-600 mb-2 sm:mb-0">
                    <p>
                      Subtotal: ₹
                      {formatPrice(
                        order.totalAmount -
                          (order.shippingCost || 0) -
                          (order.taxAmount ||
                            Math.round(order.totalAmount * 0.08))
                      )}
                    </p>
                    <p>Shipping: ₹{formatPrice(order.shippingCost || 0)}</p>
                    <p>
                      Tax: ₹
                      {formatPrice(
                        order.taxAmount || Math.round(order.totalAmount * 0.08)
                      )}
                    </p>
                    <p>Payment Method: {order.paymentMethod || "N/A"}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-medium text-stone-900">
                      Total: ₹{formatPrice(order.totalAmount)}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pt-4 border-t border-stone-200">
                  <div className="text-sm text-stone-600 mb-2 sm:mb-0">
                    {order.estimatedDelivery &&
                      order.status?.toLowerCase() === "shipped" && (
                        <p>
                          <Calendar className="w-4 h-4 inline mr-1" />
                          Estimated delivery:{" "}
                          {new Date(
                            order.estimatedDelivery
                          ).toLocaleDateString()}
                        </p>
                      )}
                    {order.updatedAt && (
                      <p className="text-xs text-stone-500 mt-1">
                        Last updated:{" "}
                        {new Date(order.updatedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Link href={`/Buyer/Orders/${order.id}`}>
                      <button className="border border-stone-300 text-stone-700 hover:bg-stone-50 px-3 py-1 text-sm font-medium transition-colors cursor-pointer rounded">
                        <Eye className="w-4 h-4 mr-2 inline" />
                        View Details
                      </button>
                    </Link>
                    {order.paymentStatus?.toLowerCase() === "paid" && (
                      <button
                        onClick={() => downloadInvoice(order.id)}
                        className="border border-stone-300 text-stone-700 hover:bg-stone-50 px-3 py-1 text-sm font-medium transition-colors cursor-pointer rounded"
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

        {filteredOrders.length === 0 && orders.length > 0 && (
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

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex justify-center items-center space-x-4 mt-8">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={!pagination.hasPrev}
              className="px-4 py-2 border border-stone-300 text-stone-700 hover:bg-stone-50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed rounded"
            >
              Previous
            </button>
            <span className="text-stone-600">
              Page {pagination.currentPage} of {pagination.totalPages}
              {pagination.totalCount > 0 &&
                ` (${pagination.totalCount} orders total)`}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.min(pagination.totalPages, prev + 1)
                )
              }
              disabled={!pagination.hasNext}
              className="px-4 py-2 border border-stone-300 text-stone-700 hover:bg-stone-50 transition-colors cursor-pointer disabled:cursor-not-allowed rounded"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
