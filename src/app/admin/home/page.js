"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  HomeIcon,
  ShoppingBagIcon,
  UsersIcon,
  CurrencyDollarIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

export default function AdminDashboard() {
  const router = useRouter();
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for admin session
    const storedAdmin = localStorage.getItem("adminUser");
    if (!storedAdmin) {
      router.push("/admin/signin");
    } else {
      setAdminUser(JSON.parse(storedAdmin));
      setLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("adminUser");
    router.push("/admin/signin");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col fixed h-full z-10">
        <div className="h-20 flex items-center px-8 border-b border-gray-800">
          <h1 className="text-xl font-black uppercase tracking-tighter">
            Blade<span className="text-primary">Admin</span>
          </h1>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          <NavItem href="/admin/home" icon={HomeIcon} active>
            Dashboard
          </NavItem>
          <NavItem href="/admin/products" icon={ShoppingBagIcon}>
            Products
          </NavItem>
          <NavItem href="/admin/orders" icon={CurrencyDollarIcon}>
            Orders
          </NavItem>
          <NavItem href="/admin/users" icon={UsersIcon}>
            Users
          </NavItem>
          <NavItem href="/admin/admins" icon={UsersIcon}>
            Admins
          </NavItem>
          <NavItem href="/admin/analytics" icon={ChartBarIcon}>
            Analytics
          </NavItem>
          <NavItem href="/admin/settings" icon={Cog6ToothIcon}>
            Settings
          </NavItem>
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-3" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold">Dashboard</h2>
            <p className="text-gray-400 text-sm">Welcome back, Admin</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="h-10 w-10 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-primary font-bold">
              A
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Revenue"
            value="$45,231.89"
            change="+20.1%"
            trend="up"
            icon={CurrencyDollarIcon}
          />
          <StatCard
            title="Active Orders"
            value="12"
            change="-4.5%"
            trend="down"
            icon={ShoppingBagIcon}
          />
          <StatCard
            title="Total Products"
            value="48"
            change="+2"
            trend="neutral"
            icon={ShoppingBagIcon}
          />
          <StatCard
            title="Total Users"
            value="2,345"
            change="+10.5%"
            trend="up"
            icon={UsersIcon}
          />
        </div>

        {/* Recent Orders */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
            <h3 className="font-bold">Recent Orders</h3>
            <Link
              href="/admin/orders"
              className="text-sm text-primary hover:text-red-400 transition-colors"
            >
              View All
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-400">
              <thead className="bg-gray-950 text-gray-200 uppercase font-bold text-xs">
                <tr>
                  <th className="px-6 py-3">Order ID</th>
                  <th className="px-6 py-3">Customer</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {[1, 2, 3, 4, 5].map((order) => (
                  <tr
                    key={order}
                    className="hover:bg-gray-800/50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-white">
                      #ORD-00{order}
                    </td>
                    <td className="px-6 py-4">John Doe</td>
                    <td className="px-6 py-4">Dec 15, 2025</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded-full text-xs font-bold bg-green-500/10 text-green-500">
                        Completed
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-white">$120.00</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

function NavItem({ href, icon: Icon, children, active }) {
  return (
    <Link
      href={href}
      className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
        active
          ? "bg-primary text-white"
          : "text-gray-400 hover:text-white hover:bg-gray-800"
      }`}
    >
      <Icon className="h-5 w-5 mr-3" />
      {children}
    </Link>
  );
}

function StatCard({ title, value, change, trend, icon: Icon }) {
  return (
    <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
        <div className="p-2 bg-gray-800 rounded-lg text-gray-400">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="flex items-baseline">
        <p className="text-2xl font-bold text-white">{value}</p>
        <span
          className={`ml-2 text-xs font-medium ${
            trend === "up"
              ? "text-green-500"
              : trend === "down"
              ? "text-red-500"
              : "text-gray-500"
          }`}
        >
          {change}
        </span>
      </div>
    </div>
  );
}
