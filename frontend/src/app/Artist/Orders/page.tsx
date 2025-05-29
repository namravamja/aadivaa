"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
} from "lucide-react";
import OrderDetails from "./components/order-details";

// Define order data types
export interface OrderItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  sku: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  total: number;
  items: OrderItem[];
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    state: string;
    pinCode: string;
    phone: string;
  };
  paymentMethod: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
}

// Sample order data
const sampleOrders: Order[] = [
  {
    id: "1",
    orderNumber: "ORD-2024-001",
    date: "2024-01-15",
    status: "delivered",
    total: 2499.99,
    items: [
      {
        id: "1",
        name: "Wireless Bluetooth Headphones",
        image: "/placeholder.svg?height=80&width=80",
        price: 1999.99,
        quantity: 1,
        sku: "WBH-001",
      },
      {
        id: "2",
        name: "Phone Case - Clear",
        image: "/placeholder.svg?height=80&width=80",
        price: 499.99,
        quantity: 1,
        sku: "PC-002",
      },
    ],
    shippingAddress: {
      name: "John Smith",
      street: "123 Main Street",
      city: "Mumbai",
      state: "Maharashtra",
      pinCode: "400001",
      phone: "+91 98765 43210",
    },
    paymentMethod: "Credit Card",
    trackingNumber: "TRK123456789",
    estimatedDelivery: "2024-01-18",
  },
  {
    id: "2",
    orderNumber: "ORD-2024-002",
    date: "2024-01-20",
    status: "shipped",
    total: 1299.99,
    items: [
      {
        id: "3",
        name: "Cotton T-Shirt - Blue",
        image: "/placeholder.svg?height=80&width=80",
        price: 799.99,
        quantity: 1,
        sku: "CT-003",
      },
      {
        id: "4",
        name: "Denim Jeans",
        image: "/placeholder.svg?height=80&width=80",
        price: 1299.99,
        quantity: 1,
        sku: "DJ-004",
      },
    ],
    shippingAddress: {
      name: "John Smith",
      street: "123 Main Street",
      city: "Mumbai",
      state: "Maharashtra",
      pinCode: "400001",
      phone: "+91 98765 43210",
    },
    paymentMethod: "UPI",
    trackingNumber: "TRK987654321",
    estimatedDelivery: "2024-01-25",
  },
  {
    id: "3",
    orderNumber: "ORD-2024-003",
    date: "2024-01-22",
    status: "confirmed",
    total: 899.99,
    items: [
      {
        id: "5",
        name: "Coffee Mug Set",
        image: "/placeholder.svg?height=80&width=80",
        price: 899.99,
        quantity: 1,
        sku: "CM-005",
      },
    ],
    shippingAddress: {
      name: "John Smith",
      street: "123 Main Street",
      city: "Mumbai",
      state: "Maharashtra",
      pinCode: "400001",
      phone: "+91 98765 43210",
    },
    paymentMethod: "Cash on Delivery",
    estimatedDelivery: "2024-01-28",
  },
  {
    id: "4",
    orderNumber: "ORD-2024-004",
    date: "2024-01-23",
    status: "pending",
    total: 3499.99,
    items: [
      {
        id: "6",
        name: "Laptop Stand",
        image: "/placeholder.svg?height=80&width=80",
        price: 2999.99,
        quantity: 1,
        sku: "LS-006",
      },
      {
        id: "7",
        name: "Wireless Mouse",
        image: "/placeholder.svg?height=80&width=80",
        price: 1499.99,
        quantity: 1,
        sku: "WM-007",
      },
    ],
    shippingAddress: {
      name: "John Smith",
      street: "123 Main Street",
      city: "Mumbai",
      state: "Maharashtra",
      pinCode: "400001",
      phone: "+91 98765 43210",
    },
    paymentMethod: "Credit Card",
  },
];

export default function OrdersPage() {
  const [orders] = useState<Order[]>(sampleOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "confirmed":
        return <CheckCircle className="w-4 h-4" />;
      case "shipped":
        return <Truck className="w-4 h-4" />;
      case "delivered":
        return <Package className="w-4 h-4" />;
      case "cancelled":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "text-clay-600 bg-clay-100";
      case "confirmed":
        return "text-terracotta-600 bg-terracotta-100";
      case "shipped":
        return "text-sage-600 bg-sage-100";
      case "delivered":
        return "text-sage-700 bg-sage-200";
      case "cancelled":
        return "text-red-600 bg-red-100";
      default:
        return "text-stone-600 bg-stone-100";
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (selectedOrder) {
    return (
      <OrderDetails
        order={selectedOrder}
        onBack={() => setSelectedOrder(null)}
        getStatusIcon={getStatusIcon}
        getStatusColor={getStatusColor}
      />
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-light text-stone-900 mb-2">
          My Orders
        </h1>
        <p className="text-sm sm:text-base text-stone-600">
          Track and manage your orders
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search orders by order number or product name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-stone-300 rounded-md focus:border-terracotta-500 focus:outline-none focus:ring-1 focus:ring-terracotta-500"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-4 h-4" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-10 pr-8 py-2 border border-stone-300 rounded-md focus:border-terracotta-500 focus:outline-none focus:ring-1 focus:ring-terracotta-500 bg-white"
          >
            <option value="all">All Orders</option> 
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-stone-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-stone-900 mb-2">
              No orders found
            </h3>
            <p className="text-stone-600">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search or filter criteria"
                : "You haven't placed any orders yet"}
            </p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white border border-stone-200 rounded-md p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Order Info */}
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-3">
                    <h3 className="text-base sm:text-lg font-medium text-stone-900">
                      {order.orderNumber}
                    </h3>
                    <div
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {getStatusIcon(order.status)}
                      <span className="ml-1 capitalize">{order.status}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-stone-600 mb-4">
                    <div>
                      <span className="font-medium">Order Date:</span>{" "}
                      {new Date(order.date).toLocaleDateString()}
                    </div>
                    <div>
                      <span className="font-medium">Total:</span> ₹
                      {order.total.toFixed(2)}
                    </div>
                    <div>
                      <span className="font-medium">Items:</span>{" "}
                      {order.items.length} item
                      {order.items.length > 1 ? "s" : ""}
                    </div>
                  </div>

                  {/* Order Items Preview */}
                  <div className="flex flex-wrap gap-2">
                    {order.items.slice(0, 3).map((item, index) => (
                      <div
                        key={item.id}
                        className="flex items-center bg-stone-50 rounded-md px-2 py-1"
                      >
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="w-6 h-6 object-cover rounded mr-2"
                        />
                        <span className="text-xs text-stone-700 truncate max-w-[120px]">
                          {item.name}
                        </span>
                        {item.quantity > 1 && (
                          <span className="text-xs text-stone-500 ml-1">
                            ×{item.quantity}
                          </span>
                        )}
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <div className="flex items-center bg-stone-50 rounded-md px-2 py-1">
                        <span className="text-xs text-stone-700">
                          +{order.items.length - 3} more
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-2 lg:flex-col lg:items-end">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="px-4 py-2 bg-terracotta-600 text-white rounded-md hover:bg-terracotta-700 transition-colors flex items-center justify-center text-sm"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </button>

                  {order.trackingNumber && (
                    <button className="px-4 py-2 border border-stone-300 text-stone-700 rounded-md hover:bg-stone-50 transition-colors flex items-center justify-center text-sm">
                      <Truck className="w-4 h-4 mr-2" />
                      Track Order
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

    
    </div>
  );
}
