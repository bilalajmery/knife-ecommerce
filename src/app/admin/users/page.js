"use client";
import { useState, useEffect } from "react";
import {
    MagnifyingGlassIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    UserIcon,
    ShoppingBagIcon,
    CurrencyDollarIcon,
    EyeIcon
} from "@heroicons/react/24/outline";
import { showAlert } from "@/utils/sweetAlert";
import Sidebar from "@/app/components/admin/Sidebar";
import Link from "next/link";

export default function UsersPage() {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState({
        totalUsers: 0,
        totalPages: 0,
        currentPage: 1,
        itemsPerPage: 10
    });
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/users?page=${currentPage}&limit=10&search=${searchTerm}`);
            const data = await res.json();
            if (data.success) {
                setUsers(data.users);
                setPagination(data.pagination);
            }
        } catch (error) {
            showAlert("error", "Error", "Failed to fetch users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchUsers();
        }, 500); // Debounce search
        return () => clearTimeout(timer);
    }, [searchTerm, currentPage]);

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-sans flex">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 lg:ml-64 p-4 md:p-8 overflow-y-auto min-h-screen">
                <header className="mb-8">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">
                            Users
                        </h2>
                        <p className="text-gray-400 mt-1">
                            Manage your registered users and view their activity
                        </p>
                    </div>
                </header>

                {/* Search */}
                <div className="flex flex-col md:flex-row gap-4 mb-8 justify-between items-center bg-[#111] p-6 rounded-2xl border border-gray-900 shadow-xl">
                    <div className="relative w-full md:w-96 group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <MagnifyingGlassIcon className="h-5 w-5 text-gray-500 group-focus-within:text-primary transition-colors" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search users by name or email..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1); // Reset to page 1 on search
                            }}
                            className="block w-full pl-11 pr-4 py-3 bg-black border border-gray-800 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                        />
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-[#111] border border-gray-900 rounded-2xl overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-400">
                            <thead className="bg-black text-gray-200 uppercase font-bold text-xs tracking-wider border-b border-gray-900">
                                <tr>
                                    <th className="px-8 py-5">User</th>
                                    <th className="px-6 py-5">Email</th>
                                    <th className="px-6 py-5">Provider</th>
                                    <th className="px-6 py-5">Joined Date</th>
                                    <th className="px-6 py-5 text-center">Orders</th>
                                    <th className="px-6 py-5 text-right">Total Spent</th>
                                    <th className="px-8 py-5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-900">
                                {loading ? (
                                    <tr>
                                        <td colSpan="7" className="px-8 py-12 text-center text-gray-500">
                                            Loading users...
                                        </td>
                                    </tr>
                                ) : users.length > 0 ? (
                                    users.map((user) => (
                                        <tr
                                            key={user._id}
                                            className="hover:bg-gray-900/50 transition-colors group cursor-pointer"
                                        >
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center border border-gray-700 overflow-hidden">
                                                        {user.profile ? (
                                                            <img src={user.profile} alt={user.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <UserIcon className="h-5 w-5 text-primary" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-white group-hover:text-primary transition-colors">
                                                            {user.name}
                                                        </div>
                                                        <div className="text-xs text-gray-600">
                                                            ID: {user._id.substring(user._id.length - 6)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="text-white font-medium max-w-xs truncate">
                                                    {user.email}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${user.provider === "GOOGLE"
                                                    ? "bg-red-500/10 text-red-500 border-red-500/20"
                                                    : "bg-blue-500/10 text-blue-500 border-blue-500/20"
                                                    }`}>
                                                    {user.provider}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-gray-500">
                                                {new Date(user.createdAt).toLocaleDateString("en-US", {
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "numeric",
                                                })}
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                <div className="inline-flex items-center gap-1 bg-gray-800 px-3 py-1 rounded-lg">
                                                    <ShoppingBagIcon className="h-4 w-4 text-primary" />
                                                    <span className="text-white font-bold">{user.orderCount}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-right font-medium text-white">
                                                ${(user.totalSpent || 0).toLocaleString()}
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Link
                                                        href={`/admin/users/${user._id}`}
                                                        className="p-2 rounded-lg hover:bg-primary/10 text-gray-500 hover:text-primary transition-colors"
                                                        title="View Details"
                                                    >
                                                        <EyeIcon className="h-5 w-5" />
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="7"
                                            className="px-8 py-12 text-center text-gray-500"
                                        >
                                            <div className="flex flex-col items-center justify-center">
                                                <UserIcon className="h-12 w-12 text-gray-700 mb-4" />
                                                <p className="text-lg font-medium text-gray-400">
                                                    No users found
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    Try adjusting your search
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                        <div className="px-8 py-5 border-t border-gray-900 flex items-center justify-between bg-[#111]">
                            <span className="text-sm text-gray-400">
                                Showing{" "}
                                <span className="font-bold text-white">
                                    {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1}
                                </span>{" "}
                                to{" "}
                                <span className="font-bold text-white">
                                    {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalUsers)}
                                </span>{" "}
                                of{" "}
                                <span className="font-bold text-white">
                                    {pagination.totalUsers}
                                </span>{" "}
                                results
                            </span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="p-2.5 rounded-xl border border-gray-800 hover:bg-gray-800 hover:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-gray-400 hover:text-white"
                                    title="Previous Page"
                                >
                                    <ChevronLeftIcon className="h-5 w-5" />
                                </button>
                                <button
                                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, pagination.totalPages))}
                                    disabled={currentPage === pagination.totalPages}
                                    className="p-2.5 rounded-xl border border-gray-800 hover:bg-gray-800 hover:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-gray-400 hover:text-white"
                                    title="Next Page"
                                >
                                    <ChevronRightIcon className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}





