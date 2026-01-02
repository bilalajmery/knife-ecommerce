"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShoppingBagIcon,
  UsersIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import Sidebar from "../../components/admin/Sidebar";

// Mock Data for Charts
const salesData = [
  { name: "Jan", sales: 4000, orders: 240 },
  { name: "Feb", sales: 3000, orders: 139 },
  { name: "Mar", sales: 2000, orders: 980 },
  { name: "Apr", sales: 2780, orders: 390 },
  { name: "May", sales: 1890, orders: 480 },
  { name: "Jun", sales: 2390, orders: 380 },
  { name: "Jul", sales: 3490, orders: 430 },
  { name: "Aug", sales: 4200, orders: 510 },
  { name: "Sep", sales: 5100, orders: 620 },
  { name: "Oct", sales: 4800, orders: 540 },
  { name: "Nov", sales: 6200, orders: 780 },
  { name: "Dec", sales: 7400, orders: 920 },
];

const categoryData = [
  { name: "Chef Knives", value: 400 },
  { name: "Hunting", value: 300 },
  { name: "Pocket", value: 300 },
  { name: "Accessories", value: 200 },
];

const COLORS = ["#DC2626", "#F87171", "#991B1B", "#450A0A"];

export default function AdminDashboard() {
  const router = useRouter();
  const [adminUser, setAdminUser] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get admin data
    const storedAdmin = localStorage.getItem("adminUser");
    if (storedAdmin) {
      setAdminUser(JSON.parse(storedAdmin));
    }

    const fetchData = async () => {
      try {
        const [analyticsRes, ordersRes] = await Promise.all([
          fetch("/api/admin/analytics"),
          fetch("/api/admin/orders")
        ]);

        const analyticsData = await analyticsRes.json();
        const ordersData = await ordersRes.json();

        if (analyticsData.success) setAnalytics(analyticsData);
        if (ordersData.success) setRecentOrders(ordersData.orders.slice(0, 5));

        setLoading(false);
      } catch (error) {
        console.error("Dashboard Fetch Error:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  const stats = analytics?.stats || {};

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen custom-scrollbar">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <p className="text-gray-400 mt-1">
              Overview of your store's performance.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-white">
                {adminUser?.name || "Admin"}
              </p>
            </div>
            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-primary to-red-900 flex items-center justify-center text-white font-bold shadow-lg shadow-primary/20">
              {adminUser?.name?.charAt(0) || "A"}
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Revenue"
            value={`$${stats.totalRevenue?.toLocaleString() || '0'}`}
            change="+12.5%"
            trend="up"
            icon={CurrencyDollarIcon}
            color="text-green-500"
          />
          <StatCard
            title="Total Orders"
            value={stats.totalOrders || '0'}
            change="+5.2%"
            trend="up"
            icon={ShoppingBagIcon}
            color="text-blue-500"
          />
          <StatCard
            title="Total Products"
            value={stats.totalProducts || '0'}
            change="Active"
            trend="neutral"
            icon={ShoppingBagIcon}
            color="text-purple-500"
          />
          <StatCard
            title="Total Users"
            value={stats.totalUsers || '0'}
            change="+3.1%"
            trend="up"
            icon={UsersIcon}
            color="text-orange-500"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Sales Chart */}
          <div className="lg:col-span-2 bg-[#111] border border-gray-900 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-white">Sales Overview</h3>
                <Link href="/admin/analytics" className="text-xs text-primary hover:underline italic font-medium">
                  View Detailed Tactical Analytics &rarr;
                </Link>
              </div>
              <select className="bg-black border border-gray-900 text-xs text-gray-400 rounded-lg px-3 py-1 focus:outline-none focus:border-primary">
                <option>Last 12 Months</option>
                <option>Last 30 Days</option>
                <option>Last 7 Days</option>
              </select>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={analytics?.revenueOverTime}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#DC2626" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#DC2626" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#333"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="_id"
                    stroke="#666"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => {
                      const date = new Date(val);
                      return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
                    }}
                  />
                  <YAxis
                    stroke="#666"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#000",
                      border: "1px solid #333",
                      borderRadius: "8px",
                    }}
                    itemStyle={{ color: "#fff" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#DC2626"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorSales)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Chart */}
          <div className="bg-[#111] border border-gray-900 rounded-2xl p-6 shadow-xl flex flex-col">
            <h3 className="text-lg font-bold text-white mb-6">
              Top Categories
            </h3>
            <div className="flex-1 min-h-[250px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics?.statusDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {analytics?.statusDistribution.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#000",
                      border: "1px solid #333",
                      borderRadius: "8px",
                    }}
                    itemStyle={{ color: "#fff" }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconType="circle"
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Center Text */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{stats.totalOrders || 0}</p>
                  <p className="text-xs text-gray-500">Orders</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Orders Table */}
          <div className="lg:col-span-2 bg-[#111] border border-gray-900 rounded-2xl overflow-hidden shadow-xl">
            <div className="px-6 py-5 border-b border-gray-900 flex justify-between items-center">
              <h3 className="font-bold text-lg">Recent Orders</h3>
              <Link
                href="/admin/orders"
                className="text-xs font-bold uppercase tracking-wider text-primary hover:text-red-400 transition-colors"
              >
                View All Orders
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-400">
                <thead className="bg-black text-gray-500 uppercase font-bold text-xs">
                  <tr>
                    <th className="px-6 py-4">Order ID</th>
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-900">
                  {recentOrders.map((order) => (
                    <tr
                      key={order._id}
                      className="hover:bg-gray-900/50 transition-colors group"
                    >
                      <td className="px-6 py-4 font-medium text-white group-hover:text-primary transition-colors">
                        #{order.orderId}
                      </td>
                      <td className="px-6 py-4">
                        {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}
                      </td>
                      <td className="px-6 py-4">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${order.status === 'delivered' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                            order.status === 'cancelled' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                              'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                          }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-white font-medium">
                        ${order.total?.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                  {recentOrders.length === 0 && (
                    <tr>
                      <td colSpan="5" className="px-6 py-10 text-center text-gray-500 italic">No orders found yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-[#111] border border-gray-900 rounded-2xl p-6 shadow-xl">
            <h3 className="font-bold text-lg mb-6">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-4 bg-black border border-gray-900 rounded-xl hover:border-primary/50 hover:bg-gray-900 transition-all group">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <ShoppingBagIcon className="h-5 w-5" />
                  </div>
                  <span className="ml-4 font-medium text-gray-300 group-hover:text-white">
                    Add New Product
                  </span>
                </div>
                <span className="text-gray-600 group-hover:text-primary">
                  &rarr;
                </span>
              </button>

              <button className="w-full flex items-center justify-between p-4 bg-black border border-gray-900 rounded-xl hover:border-blue-500/50 hover:bg-gray-900 transition-all group">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                    <UsersIcon className="h-5 w-5" />
                  </div>
                  <span className="ml-4 font-medium text-gray-300 group-hover:text-white">
                    Manage Users
                  </span>
                </div>
                <span className="text-gray-600 group-hover:text-blue-500">
                  &rarr;
                </span>
              </button>

              <button className="w-full flex items-center justify-between p-4 bg-black border border-gray-900 rounded-xl hover:border-green-500/50 hover:bg-gray-900 transition-all group">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center text-green-500 group-hover:bg-green-500 group-hover:text-white transition-colors">
                    <CurrencyDollarIcon className="h-5 w-5" />
                  </div>
                  <span className="ml-4 font-medium text-gray-300 group-hover:text-white">
                    View Transactions
                  </span>
                </div>
                <span className="text-gray-600 group-hover:text-green-500">
                  &rarr;
                </span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ title, value, change, trend, icon: Icon, color }) {
  return (
    <div className="bg-[#111] border border-gray-900 p-6 rounded-2xl shadow-lg hover:border-gray-800 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
        <div
          className={`p-2 rounded-lg bg-opacity-10 ${color.replace(
            "text-",
            "bg-"
          )}`}
        >
          <Icon className={`h-5 w-5 ${color}`} />
        </div>
      </div>
      <div className="flex items-end justify-between">
        <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
        <div
          className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${trend === "up"
            ? "bg-green-500/10 text-green-500"
            : trend === "down"
              ? "bg-red-500/10 text-red-500"
              : "bg-gray-500/10 text-gray-500"
            }`}
        >
          {trend === "up" ? (
            <ArrowTrendingUpIcon className="h-3 w-3 mr-1" />
          ) : trend === "down" ? (
            <ArrowTrendingDownIcon className="h-3 w-3 mr-1" />
          ) : (
            <ClockIcon className="h-3 w-3 mr-1" />
          )}
          {change}
        </div>
      </div>
    </div>
  );
}
