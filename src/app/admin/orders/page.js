"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    MagnifyingGlassIcon,
    FunnelIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    EyeIcon
} from "@heroicons/react/24/outline";
import Sidebar from "@/app/components/admin/Sidebar";
import Pagination from "@/app/components/admin/Pagination";

export default function OrdersPage() {
    const router = useRouter();
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filter & Pagination State
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/admin/orders");
            const data = await res.json();
            if (res.ok) {
                setOrders(data.orders);
                setFilteredOrders(data.orders);
            }
        } catch (error) {
            console.error("Failed to fetch orders", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    // Handle Filter & Search
    useEffect(() => {
        let result = orders;

        // Search Filter (Order ID, Email, or Name)
        if (searchTerm) {
            const query = searchTerm.toLowerCase();
            result = result.filter(
                (order) =>
                    order.orderId.toLowerCase().includes(query) ||
                    order.shippingAddress?.email?.toLowerCase().includes(query) ||
                    order.shippingAddress?.firstName?.toLowerCase().includes(query) ||
                    order.shippingAddress?.lastName?.toLowerCase().includes(query)
            );
        }

        // Status Filter
        if (filterStatus !== "all") {
            result = result.filter((order) => order.status === filterStatus);
        }

        setFilteredOrders(result);
        setCurrentPage(1); // Reset to first page on filter change
    }, [searchTerm, filterStatus, orders]);

    // Pagination Logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentOrders = filteredOrders.slice(
        indexOfFirstItem,
        indexOfLastItem
    );
    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

    const getStatusColor = (status) => {
        switch (status) {
            case "pending": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
            case "processing": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
            case "shipped": return "bg-purple-500/10 text-purple-500 border-purple-500/20";
            case "delivered": return "bg-green-500/10 text-green-500 border-green-500/20";
            case "cancelled": return "bg-red-500/10 text-red-500 border-red-500/20";
            default: return "bg-gray-500/10 text-gray-500 border-gray-500/20";
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-sans flex">
            <Sidebar />

            <main className="flex-1 lg:ml-64 p-4 md:p-8 overflow-y-auto min-h-screen">
                <header className="mt-12 lg:mt-0 flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">
                            Order Management
                        </h2>
                        <p className="text-gray-400 mt-1">
                            Track and manage your customer orders
                        </p>
                    </div>
                </header>

                {/* Filters & Search */}
                <div className="flex flex-col md:flex-row gap-4 mb-8 justify-between items-center bg-[#111] p-6 rounded-2xl border border-gray-900 shadow-xl">
                    <div className="relative w-full md:w-96 group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <MagnifyingGlassIcon className="h-5 w-5 text-gray-500 group-focus-within:text-primary transition-colors" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search by ID, name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="block w-full pl-11 pr-4 py-3 bg-black border border-gray-800 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
                        <div className="flex items-center gap-2">
                            <FunnelIcon className="h-5 w-5 text-gray-500" />
                            <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                                Status:
                            </span>
                        </div>

                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="bg-black border border-gray-800 text-white text-sm rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary block p-3 min-w-[150px] transition-all"
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                </div>

                {/* Orders Table */}
                <div className="bg-[#111] border border-gray-900 rounded-2xl overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-400">
                            <thead className="bg-black text-gray-200 uppercase font-bold text-xs tracking-wider border-b border-gray-900">
                                <tr>
                                    <th className="px-8 py-5">Order ID</th>
                                    <th className="px-6 py-5">Customer</th>
                                    <th className="px-6 py-5">Date</th>
                                    <th className="px-6 py-5">Total</th>
                                    <th className="px-6 py-5">Status</th>
                                    <th className="px-8 py-5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-900">
                                {loading ? (
                                    <tr>
                                        <td colSpan="6" className="px-8 py-12 text-center text-gray-500">
                                            <div className="animate-pulse">Loading orders...</div>
                                        </td>
                                    </tr>
                                ) : currentOrders.length > 0 ? (
                                    currentOrders.map((order) => (
                                        <tr key={order._id} className="hover:bg-gray-900/50 transition-colors group">
                                            <td className="px-8 py-5 font-mono text-xs text-white">
                                                #{order.orderId}
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="font-bold text-white">
                                                    {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}
                                                </div>
                                                <div className="text-xs text-gray-600">{order.shippingAddress?.email}</div>
                                            </td>
                                            <td className="px-6 py-5 text-gray-300">
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-5 text-primary font-bold">
                                                ${order.total.toFixed(2)}
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-widest ${getStatusColor(order.status)}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <button
                                                    onClick={() => router.push(`/admin/orders/${order._id}`)}
                                                    className="p-2 rounded-lg hover:bg-primary/10 text-gray-500 hover:text-primary transition-colors"
                                                    title="View Details"
                                                >
                                                    <EyeIcon className="h-5 w-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-8 py-12 text-center text-gray-500">
                                            <div className="flex flex-col items-center justify-center">
                                                <p className="text-lg font-medium text-gray-400">No orders found</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    totalResults={filteredOrders.length}
                    showingCount={currentOrders.length}
                />
            </main>
        </div>
    );
}



