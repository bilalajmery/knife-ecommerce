"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    ArrowLeftIcon,
    UserCircleIcon,
    EnvelopeIcon,
    CalendarDaysIcon,
    ShoppingBagIcon,
    CurrencyDollarIcon,
    TruckIcon,
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon,
    CreditCardIcon
} from "@heroicons/react/24/outline";
import { showAlert } from "../../../../utils/sweetAlert";
import Sidebar from "../../../components/admin/Sidebar";
import Link from "next/link";

export default function UserDetailsPage() {
    const { id } = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [stats, setStats] = useState(null);
    const [recentOrders, setRecentOrders] = useState([]);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const res = await fetch(`/api/admin/users/${id}`);
                const data = await res.json();

                if (data.success) {
                    setUser(data.user);
                    setStats(data.stats);
                    setRecentOrders(data.recentOrders);
                } else {
                    showAlert("error", "Error", data.message);
                    router.push("/admin/users");
                }
            } catch (error) {
                showAlert("error", "Error", "Failed to fetch user details");
                router.push("/admin/users");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchUserDetails();
        }
    }, [id, router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!user) return null;

    const getStatusColor = (status) => {
        switch (status) {
            case "delivered": return "text-green-500 bg-green-500/10 border-green-500/20";
            case "processing": return "text-blue-500 bg-blue-500/10 border-blue-500/20";
            case "shipped": return "text-purple-500 bg-purple-500/10 border-purple-500/20";
            case "cancelled": return "text-red-500 bg-red-500/10 border-red-500/20";
            default: return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "delivered": return <CheckCircleIcon className="h-4 w-4" />;
            case "processing": return <ClockIcon className="h-4 w-4" />;
            case "shipped": return <TruckIcon className="h-4 w-4" />;
            case "cancelled": return <XCircleIcon className="h-4 w-4" />;
            default: return <ClockIcon className="h-4 w-4" />;
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-sans flex">
            <Sidebar />

            <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen custom-scrollbar">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => router.back()}
                        className="p-2 rounded-lg bg-[#111] border border-gray-800 text-gray-400 hover:text-white hover:border-gray-600 transition-all"
                    >
                        <ArrowLeftIcon className="h-5 w-5" />
                    </button>
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">User Details</h2>
                        <p className="text-gray-400 text-sm">View complete user profile and order history</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: User Profile */}
                    <div className="space-y-8">
                        {/* Profile Card */}
                        <div className="bg-[#111] border border-gray-900 rounded-2xl p-6 shadow-xl">
                            <div className="flex flex-col items-center">
                                <div className="h-24 w-24 rounded-full bg-gray-800 border-2 border-primary mb-4 overflow-hidden flex items-center justify-center">
                                    {user.profile ? (
                                        <img src={user.profile} alt={user.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <UserCircleIcon className="h-16 w-16 text-gray-600" />
                                    )}
                                </div>
                                <h3 className="text-xl font-bold">{user.name}</h3>
                                <p className="text-gray-400 text-sm mb-4">{user.email}</p>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${user.provider === "GOOGLE"
                                        ? "bg-red-500/10 text-red-500 border-red-500/20"
                                        : "bg-blue-500/10 text-blue-500 border-blue-500/20"
                                    }`}>
                                    {user.provider}
                                </span>
                            </div>

                            <div className="mt-8 space-y-4">
                                <div className="flex items-center gap-3 p-3 rounded-xl bg-black/50 border border-gray-900">
                                    <div className="p-2 rounded-lg bg-gray-800 text-primary">
                                        <EnvelopeIcon className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Email Address</p>
                                        <p className="font-medium text-sm">{user.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 rounded-xl bg-black/50 border border-gray-900">
                                    <div className="p-2 rounded-lg bg-gray-800 text-primary">
                                        <CalendarDaysIcon className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Joined On</p>
                                        <p className="font-medium text-sm">
                                            {new Date(user.createdAt).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric"
                                            })}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 rounded-xl bg-black/50 border border-gray-900">
                                    <div className="p-2 rounded-lg bg-gray-800 text-primary">
                                        <CheckCircleIcon className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Verification Status</p>
                                        <p className={`font-bold text-sm ${user.emailVerification ? "text-green-500" : "text-yellow-500"}`}>
                                            {user.emailVerification ? "Verified" : "Unverified"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Order Status Breakdown */}
                        <div className="bg-[#111] border border-gray-900 rounded-2xl p-6 shadow-xl">
                            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                                <ShoppingBagIcon className="h-5 w-5 text-primary" />
                                Order Statistics
                            </h3>
                            <div className="space-y-4">
                                {["pending", "processing", "shipped", "delivered", "cancelled"].map((status) => (
                                    <div key={status} className="flex items-center justify-between p-3 rounded-xl bg-black/30 border border-gray-900/50">
                                        <div className="flex items-center gap-3">
                                            <span className={`p-1.5 rounded-full ${getStatusColor(status).split(" ")[1]} ${getStatusColor(status).split(" ")[0]}`}>
                                                {getStatusIcon(status)}
                                            </span>
                                            <span className="capitalize text-sm font-medium text-gray-300">{status}</span>
                                        </div>
                                        <span className={`font-bold ${stats?.statusCounts[status] > 0 ? "text-white" : "text-gray-600"}`}>
                                            {stats?.statusCounts[status] || 0}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Stats & Recent Orders */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Summary Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-[#111] p-6 rounded-2xl border border-gray-900 shadow-xl flex items-center gap-4">
                                <div className="p-4 rounded-full bg-blue-500/10 text-blue-500">
                                    <ShoppingBagIcon className="h-8 w-8" />
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm">Total Orders</p>
                                    <h4 className="text-3xl font-bold text-white">{stats?.totalOrders || 0}</h4>
                                </div>
                            </div>
                            <div className="bg-[#111] p-6 rounded-2xl border border-gray-900 shadow-xl flex items-center gap-4">
                                <div className="p-4 rounded-full bg-green-500/10 text-green-500">
                                    <CurrencyDollarIcon className="h-8 w-8" />
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm">Total Spent</p>
                                    <h4 className="text-3xl font-bold text-white text-nowrap">
                                        ${(stats?.totalSpent || 0).toLocaleString()}
                                    </h4>
                                </div>
                            </div>
                            <div className="bg-[#111] p-6 rounded-2xl border border-gray-900 shadow-xl flex items-center gap-4">
                                <div className="p-4 rounded-full bg-purple-500/10 text-purple-500">
                                    <CreditCardIcon className="h-8 w-8" />
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm">Avg. Order Value</p>
                                    <h4 className="text-3xl font-bold text-white text-nowrap">
                                        ${stats?.totalOrders > 0
                                            ? ((stats?.totalSpent || 0) / stats?.totalOrders).toLocaleString(undefined, { maximumFractionDigits: 2 })
                                            : "0"}
                                    </h4>
                                </div>
                            </div>
                        </div>

                        {/* Recent Orders */}
                        <div className="bg-[#111] border border-gray-900 rounded-2xl overflow-hidden shadow-xl">
                            <div className="p-6 border-b border-gray-900 flex justify-between items-center">
                                <h3 className="text-lg font-bold">Recent Orders</h3>
                                {recentOrders.length > 0 && <Link href={`/admin/orders?search=${user.email}`} className="text-primary text-sm hover:underline">View All</Link>}
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm text-gray-400">
                                    <thead className="bg-black text-gray-200 uppercase font-bold text-xs tracking-wider border-b border-gray-900">
                                        <tr>
                                            <th className="px-6 py-4">Order ID</th>
                                            <th className="px-6 py-4">Date</th>
                                            <th className="px-6 py-4">Items</th>
                                            <th className="px-6 py-4">Status</th>
                                            <th className="px-6 py-4 text-right">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-900">
                                        {recentOrders.length > 0 ? (
                                            recentOrders.map((order) => (
                                                <tr key={order._id} className="hover:bg-gray-900/50 transition-colors">
                                                    <td className="px-6 py-4 font-mono text-xs text-white">
                                                        #{order.orderId}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {new Date(order.createdAt).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {order.items?.length || 0} items
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${getStatusColor(order.status)}`}>
                                                            {order.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right font-medium text-white">
                                                        ${order.total?.toLocaleString()}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                                    No orders found
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
