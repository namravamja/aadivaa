"use client";

import { useState } from "react";
import {
  Package,
  Users,
  DollarSign,
  Star,
  ShoppingBag,
  MessageSquare,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  TrendingUp,
  ShoppingCart,
  AlertCircle,
  Clock,
  Bell,
  CheckCircle2,
  ChevronRight,
  Layers,
  Activity,
  Eye,
} from "lucide-react";
import Image from "next/image";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  type TooltipProps,
} from "recharts";
import Link from "next/link";

// Mock data - in a real app, this would come from APIs
const revenueData = [
  { date: "Jan", revenue: 12500 },
  { date: "Feb", revenue: 18200 },
  { date: "Mar", revenue: 15800 },
  { date: "Apr", revenue: 21500 },
  { date: "May", revenue: 19800 },
  { date: "Jun", revenue: 24500 },
  { date: "Jul", revenue: 28900 },
];

const salesData = [
  { name: "Jewelry", value: 35 },
  { name: "Home Decor", value: 25 },
  { name: "Textiles", value: 20 },
  { name: "Pottery", value: 15 },
  { name: "Accessories", value: 5 },
];

const visitorData = [
  { date: "Mon", visitors: 520 },
  { date: "Tue", visitors: 680 },
  { date: "Wed", visitors: 750 },
  { date: "Thu", visitors: 890 },
  { date: "Fri", visitors: 920 },
  { date: "Sat", visitors: 1100 },
  { date: "Sun", visitors: 980 },
];

const recentOrders = [
  {
    id: "ORD-2024-001",
    customer: "John Smith",
    date: "2024-05-22",
    amount: 145.99,
    status: "delivered",
    items: 3,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "ORD-2024-002",
    customer: "Sarah Johnson",
    date: "2024-05-22",
    amount: 89.99,
    status: "processing",
    items: 1,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "ORD-2024-003",
    customer: "Michael Brown",
    date: "2024-05-21",
    amount: 235.5,
    status: "shipped",
    items: 4,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "ORD-2024-004",
    customer: "Emily Davis",
    date: "2024-05-21",
    amount: 67.25,
    status: "processing",
    items: 2,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "ORD-2024-005",
    customer: "Robert Wilson",
    date: "2024-05-20",
    amount: 129.99,
    status: "cancelled",
    items: 1,
    image: "/placeholder.svg?height=40&width=40",
  },
];

const topProducts = [
  {
    id: "1",
    name: "Beaded Turquoise Necklace",
    sales: 45,
    revenue: 2069.55,
    stock: 12,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "2",
    name: "Handwoven Wool Scarf",
    sales: 38,
    revenue: 3419.62,
    stock: 8,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "3",
    name: "Ceramic Vase Set",
    sales: 32,
    revenue: 2080.0,
    stock: 15,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "4",
    name: "Silver Bracelet",
    sales: 29,
    revenue: 3480.0,
    stock: 7,
    image: "/placeholder.svg?height=40&width=40",
  },
];

const notifications = [
  {
    id: "1",
    type: "alert",
    message: "Low stock alert for 'Beaded Turquoise Necklace'",
    time: "10 minutes ago",
  },
  {
    id: "2",
    type: "order",
    message: "New order #ORD-2024-006 received",
    time: "25 minutes ago",
  },
  {
    id: "3",
    type: "review",
    message: "New 5-star review for 'Handwoven Wool Scarf'",
    time: "1 hour ago",
  },
  {
    id: "4",
    type: "system",
    message: "System update scheduled for tonight at 2 AM",
    time: "2 hours ago",
  },
];

const tasks = [
  {
    id: "1",
    title: "Update product descriptions",
    priority: "high",
    due: "Today",
    completed: false,
  },
  {
    id: "2",
    title: "Approve new product listings",
    priority: "medium",
    due: "Today",
    completed: false,
  },
  {
    id: "3",
    title: "Respond to customer inquiries",
    priority: "high",
    due: "Tomorrow",
    completed: false,
  },
  {
    id: "4",
    title: "Review inventory reports",
    priority: "medium",
    due: "Tomorrow",
    completed: true,
  },
  {
    id: "5",
    title: "Plan summer promotion campaign",
    priority: "low",
    due: "May 28",
    completed: false,
  },
];

const customerReviews = [
  {
    id: "1",
    customer: "Jennifer L.",
    product: "Beaded Turquoise Necklace",
    rating: 5,
    comment:
      "Absolutely beautiful craftsmanship! The necklace exceeded my expectations.",
    date: "2024-05-22",
  },
  {
    id: "2",
    customer: "David M.",
    product: "Ceramic Vase Set",
    rating: 4,
    comment:
      "Great quality and design. Shipping was a bit slow but worth the wait.",
    date: "2024-05-21",
  },
  {
    id: "3",
    customer: "Sophia K.",
    product: "Handwoven Wool Scarf",
    rating: 5,
    comment: "So soft and warm! The colors are even more vibrant in person.",
    date: "2024-05-20",
  },
];

// Custom tooltip component for charts
const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-stone-200 shadow-md rounded-md">
        <p className="text-sm font-medium text-stone-900">{label}</p>
        <p className="text-sm text-terracotta-600">
          {payload[0].name === "revenue" ? "$" : ""}
          {payload[0].value?.toLocaleString()}
          {payload[0].name === "visitors" ? " visitors" : ""}
          {payload[0].name === "value" ? "%" : ""}
        </p>
      </div>
    );
  }
  return null;
};

const stats = [
  {
    title: "Total Products",
    value: "127",
    change: "+12%",
    trend: "up",
    icon: Package,
    color: "terracotta",
  },
  {
    title: "Orders",
    value: "89",
    change: "+15%",
    trend: "up",
    icon: ShoppingBag,
    color: "clay",
  },
  {
    title: "Reviews",
    value: "4.8",
    change: "+0.2",
    trend: "up",
    icon: Star,
    color: "terracotta",
  },
  {
    title: "Total Revenue",
    value: "4.8",
    change: "+0.2",
    trend: "up",
    icon: Star,
    color: "terracotta",
  },
];

export default function ArtistDashboard() {
  const [timeRange, setTimeRange] = useState("30d");
  const [selectedTimeframe, setSelectedTimeframe] = useState("weekly");
  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-light text-stone-900 mb-2">Dashboard</h1>
        <p className="text-stone-600">
          Welcome back! Here's what's happening with your store.
        </p>
      </div>

      {/* Time Range Selector */}
      <div className="mb-8">
        <div className="flex space-x-2">
          {["7d", "30d", "90d", "1y"].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 text-sm font-medium rounded-sm transition-colors ${
                timeRange === range
                  ? "bg-terracotta-600 text-white"
                  : "bg-white text-stone-600 border border-stone-300 hover:bg-stone-50"
              }`}
            >
              {range === "7d" && "Last 7 days"}
              {range === "30d" && "Last 30 days"}
              {range === "90d" && "Last 90 days"}
              {range === "1y" && "Last year"}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white p-6 border border-stone-200 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-sm bg-${stat.color}-100`}>
                  <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
                <div
                  className={`flex items-center text-sm ${
                    stat.trend === "up" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {stat.trend === "up" ? (
                    <ArrowUpRight className="w-4 h-4 mr-1" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 mr-1" />
                  )}
                  {stat.change}
                </div>
              </div>
              <div>
                <div className="text-2xl font-semibold text-stone-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-stone-500 text-sm">{stat.title}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 sm:mb-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-stone-200 p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-stone-900 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-terracotta-600" />
              Revenue Overview
            </h3>
            <div className="flex items-center space-x-2">
              <select
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value)}
                className="text-sm border border-stone-300 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-terracotta-500"
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={revenueData}
                margin={{ top: 10, right: 10, bottom: 30, left: 40 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f1f1"
                />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tickFormatter={(value) => `$${value.toLocaleString()}`}
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  width={80}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="revenue"
                  name="revenue"
                  fill="rgba(203, 79, 48, 0.8)"
                  radius={[4, 4, 0, 0]}
                  barSize={30}
                  className="hover:fill-terracotta-500"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sales by Category */}
        <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-stone-900 flex items-center">
              <Layers className="w-5 h-5 mr-2 text-sage-600" />
              Sales by Category
            </h3>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={salesData}
                layout="vertical"
                margin={{ top: 10, right: 10, bottom: 20, left: 80 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={true}
                  vertical={false}
                  stroke="#f1f1f1"
                />
                <XAxis
                  type="number"
                  tickFormatter={(value) => `${value}%`}
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  width={80}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="value"
                  name="value"
                  fill="rgba(107, 134, 107, 0.8)"
                  radius={[0, 4, 4, 0]}
                  barSize={20}
                  className="hover:fill-sage-500"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Orders and Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 sm:mb-8">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-sm border border-stone-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between p-5 border-b border-stone-100">
            <h3 className="text-lg font-medium text-stone-900 flex items-center">
              <ShoppingCart className="w-5 h-5 mr-2 text-terracotta-600" />
              Recent Orders
            </h3>
            <Link
              href="/Artist/Orders"
              className="text-sm text-terracotta-600 hover:text-terracotta-700 flex items-center"
            >
              View All
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-stone-50 text-left">
                <tr>
                  <th className="px-5 py-3 text-xs font-medium text-stone-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-5 py-3 text-xs font-medium text-stone-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-5 py-3 text-xs font-medium text-stone-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-5 py-3 text-xs font-medium text-stone-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-5 py-3 text-xs font-medium text-stone-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-stone-50 transition-colors"
                  >
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-stone-900">
                        {order.id}
                      </span>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="relative w-8 h-8 mr-3 rounded-full overflow-hidden">
                          <Image
                            src={order.image || "/placeholder.svg"}
                            alt={order.customer}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="text-sm text-stone-900">
                          {order.customer}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className="text-sm text-stone-600">
                        {new Date(order.date).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-stone-900">
                        ${order.amount.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-1 text-xs rounded-full ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-lg shadow-sm border border-stone-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between p-5 border-b border-stone-100">
            <h3 className="text-lg font-medium text-stone-900 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-sage-600" />
              Top Selling Products
            </h3>
            <Link
              href="/Artist/Products"
              className="text-sm text-sage-600 hover:text-sage-700 flex items-center"
            >
              View All
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-stone-50 text-left">
                <tr>
                  <th className="px-5 py-3 text-xs font-medium text-stone-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-5 py-3 text-xs font-medium text-stone-500 uppercase tracking-wider">
                    Sales
                  </th>
                  <th className="px-5 py-3 text-xs font-medium text-stone-500 uppercase tracking-wider">
                    Revenue
                  </th>
                  <th className="px-5 py-3 text-xs font-medium text-stone-500 uppercase tracking-wider">
                    Stock
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {topProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-stone-50 transition-colors"
                  >
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="relative w-8 h-8 mr-3 rounded overflow-hidden">
                          <Image
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="text-sm font-medium text-stone-900">
                          {product.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className="text-sm text-stone-600">
                        {product.sales} units
                      </span>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-stone-900">
                        ${product.revenue.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span
                        className={`text-sm ${
                          product.stock < 10 ? "text-red-600" : "text-stone-600"
                        }`}
                      >
                        {product.stock} in stock
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-xl font-medium text-stone-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/Artist/products/new"
            className="bg-white border border-stone-200 p-6 hover:shadow-md transition-shadow"
          >
            <Package className="w-8 h-8 text-terracotta-600 mb-3" />
            <h3 className="font-medium text-stone-900 mb-1">Add New Product</h3>
            <p className="text-stone-500 text-sm">
              Create a new product listing
            </p>
          </Link>
          <Link
            href="/Artist/journal/new"
            className="bg-white border border-stone-200 p-6 hover:shadow-md transition-shadow"
          >
            <MessageSquare className="w-8 h-8 text-sage-600 mb-3" />
            <h3 className="font-medium text-stone-900 mb-1">Write Article</h3>
            <p className="text-stone-500 text-sm">
              Share your story in the journal
            </p>
          </Link>
          <Link
            href="/Artist/profile"
            className="bg-white border border-stone-200 p-6 hover:shadow-md transition-shadow"
          >
            <Users className="w-8 h-8 text-clay-600 mb-3" />
            <h3 className="font-medium text-stone-900 mb-1">Update Profile</h3>
            <p className="text-stone-500 text-sm">Manage your artist profile</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
