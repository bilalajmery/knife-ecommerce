"use client";
import { useState, useEffect } from "react";
import {
    MagnifyingGlassIcon,
    FunnelIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    EnvelopeIcon,
    CheckCircleIcon,
    XCircleIcon,
} from "@heroicons/react/24/outline";
import { showAlert, showConfirm } from "../../../utils/sweetAlert";
import Sidebar from "../../components/admin/Sidebar";

export default function SubscribersPage() {
    const [subscribers, setSubscribers] = useState([]);
    const [filteredSubscribers, setFilteredSubscribers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    const fetchSubscribers = async () => {
        try {
            const res = await fetch("/api/admin/subscribers?page=1&limit=1000");
            const data = await res.json();
            if (data.success) {
                setSubscribers(data.subscribers);
                setFilteredSubscribers(data.subscribers);
            }
        } catch (error) {
            showAlert("error", "Error", "Failed to fetch subscribers");
        }
    };

    useEffect(() => {
        fetchSubscribers();
    }, []);

    // Handle Filter & Search
    useEffect(() => {
        let result = subscribers;

        // Search Filter
        if (searchTerm) {
            result = result.filter((sub) =>
                sub.email.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Status Filter
        if (filterStatus !== "all") {
            result = result.filter((sub) => sub.status === filterStatus);
        }

        setFilteredSubscribers(result);
        setCurrentPage(1);
    }, [searchTerm, filterStatus, subscribers]);

    // Pagination Logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentSubscribers = filteredSubscribers.slice(
        indexOfFirstItem,
        indexOfLastItem
    );
    const totalPages = Math.ceil(filteredSubscribers.length / itemsPerPage);

    const handleBlockToggle = async (subscriberId, currentStatus) => {
        const action = currentStatus === "active" ? "block" : "unblock";
        const result = await showConfirm(
            `${action === "block" ? "Block" : "Unblock"} Subscriber?`,
            `Are you sure you want to ${action} this subscriber?`
        );

        if (result.isConfirmed) {
            try {
                const adminUser = JSON.parse(localStorage.getItem("adminUser"));
                const res = await fetch("/api/admin/subscribers", {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        subscriberId,
                        action,
                        adminId: adminUser?._id,
                    }),
                });

                const data = await res.json();

                if (data.success) {
                    fetchSubscribers();
                    showAlert("success", "Success!", data.message);
                } else {
                    showAlert("error", "Error", data.message);
                }
            } catch (error) {
                showAlert("error", "Error", "Failed to update subscriber");
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-sans flex">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen custom-scrollbar">
                <header className="mb-8">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">
                            Newsletter Subscribers
                        </h2>
                        <p className="text-gray-400 mt-1">
                            Manage your newsletter subscribers and their status
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
                            placeholder="Search by email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="block w-full pl-11 pr-4 py-3 bg-black border border-gray-800 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
                        <div className="flex items-center gap-2">
                            <FunnelIcon className="h-5 w-5 text-gray-500" />
                            <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                                Filter:
                            </span>
                        </div>

                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="bg-black border border-gray-800 text-white text-sm rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary block p-3 min-w-[150px] transition-all"
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="blocked">Blocked</option>
                        </select>
                    </div>
                </div>

                {/* Subscribers Table */}
                <div className="bg-[#111] border border-gray-900 rounded-2xl overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-400">
                            <thead className="bg-black text-gray-200 uppercase font-bold text-xs tracking-wider border-b border-gray-900">
                                <tr>
                                    <th className="px-8 py-5">Email</th>
                                    <th className="px-6 py-5">Status</th>
                                    <th className="px-6 py-5">Subscribed At</th>
                                    <th className="px-8 py-5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-900">
                                {currentSubscribers.length > 0 ? (
                                    currentSubscribers.map((subscriber) => (
                                        <tr
                                            key={subscriber._id}
                                            className="hover:bg-gray-900/50 transition-colors group"
                                        >
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center border border-gray-700">
                                                        <EnvelopeIcon className="h-5 w-5 text-primary" />
                                                    </div>
                                                    <span className="font-medium text-white group-hover:text-primary transition-colors">
                                                        {subscriber.email}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${subscriber.status === "active"
                                                            ? "bg-green-500/10 text-green-500 border-green-500/20"
                                                            : "bg-red-500/10 text-red-500 border-red-500/20"
                                                        }`}
                                                >
                                                    {subscriber.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-gray-500">
                                                {new Date(subscriber.subscribedAt).toLocaleDateString("en-US", {
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "numeric",
                                                })}
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <button
                                                    onClick={() =>
                                                        handleBlockToggle(subscriber._id, subscriber.status)
                                                    }
                                                    className={`px-4 py-2 rounded-lg font-medium text-xs uppercase tracking-wider transition-all ${subscriber.status === "active"
                                                            ? "bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20"
                                                            : "bg-green-500/10 text-green-500 hover:bg-green-500/20 border border-green-500/20"
                                                        }`}
                                                >
                                                    {subscriber.status === "active" ? "Block" : "Unblock"}
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="4"
                                            className="px-8 py-12 text-center text-gray-500"
                                        >
                                            <div className="flex flex-col items-center justify-center">
                                                <EnvelopeIcon className="h-12 w-12 text-gray-700 mb-4" />
                                                <p className="text-lg font-medium text-gray-400">
                                                    No subscribers found
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    Try adjusting your search or filters
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="px-8 py-5 border-t border-gray-900 flex items-center justify-between bg-[#111]">
                            <span className="text-sm text-gray-400">
                                Showing{" "}
                                <span className="font-bold text-white">
                                    {indexOfFirstItem + 1}
                                </span>{" "}
                                to{" "}
                                <span className="font-bold text-white">
                                    {Math.min(indexOfLastItem, filteredSubscribers.length)}
                                </span>{" "}
                                of{" "}
                                <span className="font-bold text-white">
                                    {filteredSubscribers.length}
                                </span>{" "}
                                results
                            </span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() =>
                                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                                    }
                                    disabled={currentPage === 1}
                                    className="p-2.5 rounded-xl border border-gray-800 hover:bg-gray-800 hover:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-gray-400 hover:text-white"
                                >
                                    <ChevronLeftIcon className="h-5 w-5" />
                                </button>
                                <button
                                    onClick={() =>
                                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                                    }
                                    disabled={currentPage === totalPages}
                                    className="p-2.5 rounded-xl border border-gray-800 hover:bg-gray-800 hover:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-gray-400 hover:text-white"
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
