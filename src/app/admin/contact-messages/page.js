"use client";
import { useState, useEffect } from "react";
import {
    MagnifyingGlassIcon,
    FunnelIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ChatBubbleLeftRightIcon,
    EnvelopeIcon,
    EyeIcon,
    CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { showAlert } from "../../../utils/sweetAlert";
import Sidebar from "../../components/admin/Sidebar";

export default function ContactMessagesPage() {
    const [messages, setMessages] = useState([]);
    const [filteredMessages, setFilteredMessages] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [selectedMessage, setSelectedMessage] = useState(null);

    const fetchMessages = async () => {
        try {
            const res = await fetch("/api/admin/contact-messages?page=1&limit=1000");
            const data = await res.json();
            if (data.success) {
                setMessages(data.messages);
                setFilteredMessages(data.messages);
            }
        } catch (error) {
            showAlert("error", "Error", "Failed to fetch messages");
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    // Handle Filter & Search
    useEffect(() => {
        let result = messages;

        // Search Filter
        if (searchTerm) {
            result = result.filter(
                (msg) =>
                    msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    msg.subject.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Status Filter
        if (filterStatus !== "all") {
            result = result.filter((msg) => msg.status === filterStatus);
        }

        setFilteredMessages(result);
        setCurrentPage(1);
    }, [searchTerm, filterStatus, messages]);

    // Pagination Logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentMessages = filteredMessages.slice(
        indexOfFirstItem,
        indexOfLastItem
    );
    const totalPages = Math.ceil(filteredMessages.length / itemsPerPage);

    const handleMarkAsRead = async (messageId, currentStatus) => {
        const action = currentStatus === "unread" ? "read" : "unread";

        try {
            const adminUser = JSON.parse(localStorage.getItem("adminUser"));
            const res = await fetch("/api/admin/contact-messages", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messageId,
                    action,
                    adminId: adminUser?._id,
                }),
            });

            const data = await res.json();

            if (data.success) {
                fetchMessages();
                showAlert("success", "Success!", data.message);
            } else {
                showAlert("error", "Error", data.message);
            }
        } catch (error) {
            showAlert("error", "Error", "Failed to update message");
        }
    };

    const handleReplyEmail = (email, subject) => {
        window.location.href = `mailto:${email}?subject=Re: ${encodeURIComponent(
            subject
        )}`;
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
                            Contact Messages
                        </h2>
                        <p className="text-gray-400 mt-1">
                            Manage customer inquiries and support messages
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
                            placeholder="Search messages..."
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
                            <option value="unread">Unread</option>
                            <option value="read">Read</option>
                        </select>
                    </div>
                </div>

                {/* Messages Table */}
                <div className="bg-[#111] border border-gray-900 rounded-2xl overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-400">
                            <thead className="bg-black text-gray-200 uppercase font-bold text-xs tracking-wider border-b border-gray-900">
                                <tr>
                                    <th className="px-8 py-5">Sender</th>
                                    <th className="px-6 py-5">Subject</th>
                                    <th className="px-6 py-5">Status</th>
                                    <th className="px-6 py-5">Date</th>
                                    <th className="px-8 py-5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-900">
                                {currentMessages.length > 0 ? (
                                    currentMessages.map((message) => (
                                        <tr
                                            key={message._id}
                                            className={`hover:bg-gray-900/50 transition-colors group cursor-pointer ${message.status === "unread" ? "bg-blue-500/5" : ""
                                                }`}
                                            onClick={() => setSelectedMessage(message)}
                                        >
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center border border-gray-700">
                                                        <ChatBubbleLeftRightIcon className="h-5 w-5 text-primary" />
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-white group-hover:text-primary transition-colors">
                                                            {message.name}
                                                        </div>
                                                        <div className="text-xs text-gray-600">
                                                            {message.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="text-white font-medium max-w-xs truncate">
                                                    {message.subject}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${message.status === "unread"
                                                        ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                                                        : "bg-green-500/10 text-green-500 border-green-500/20"
                                                        }`}
                                                >
                                                    {message.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-gray-500">
                                                {new Date(message.createdAt).toLocaleDateString("en-US", {
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "numeric",
                                                })}
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleMarkAsRead(message._id, message.status);
                                                        }}
                                                        className="p-2 rounded-lg hover:bg-green-500/10 text-gray-500 hover:text-green-500 transition-colors"
                                                        title={
                                                            message.status === "unread"
                                                                ? "Mark as Read"
                                                                : "Mark as Unread"
                                                        }
                                                    >
                                                        <CheckCircleIcon className="h-5 w-5" />
                                                    </button>

                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="5"
                                            className="px-8 py-12 text-center text-gray-500"
                                        >
                                            <div className="flex flex-col items-center justify-center">
                                                <ChatBubbleLeftRightIcon className="h-12 w-12 text-gray-700 mb-4" />
                                                <p className="text-lg font-medium text-gray-400">
                                                    No messages found
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
                                    {Math.min(indexOfLastItem, filteredMessages.length)}
                                </span>{" "}
                                of{" "}
                                <span className="font-bold text-white">
                                    {filteredMessages.length}
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

            {/* Message Detail Modal */}
            {selectedMessage && (
                <div
                    className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
                    onClick={() => setSelectedMessage(null)}
                >
                    <div
                        className="bg-[#111] rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-y-auto border border-gray-900 shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="p-8 border-b border-gray-900 bg-black">
                            <div className="flex justify-between items-start mb-6">
                                <h2 className="text-2xl font-bold text-white">
                                    {selectedMessage.subject}
                                </h2>
                                <button
                                    onClick={() => setSelectedMessage(null)}
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    <svg
                                        className="w-6 h-6"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>
                            <div className="space-y-3 text-sm">
                                <div className="flex items-center gap-3">
                                    <span className="text-gray-500 font-medium w-20">From:</span>
                                    <span className="text-white font-bold">
                                        {selectedMessage.name}
                                    </span>
                                    <a
                                        href={`mailto:${selectedMessage.email}`}
                                        className="text-primary hover:underline"
                                    >
                                        {selectedMessage.email}
                                    </a>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-gray-500 font-medium w-20">Date:</span>
                                    <span className="text-gray-400">
                                        {new Date(selectedMessage.createdAt).toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-gray-500 font-medium w-20">Status:</span>
                                    <span
                                        className={`px-3 py-1 text-xs font-bold rounded-full border ${selectedMessage.status === "unread"
                                            ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                                            : "bg-green-500/10 text-green-500 border-green-500/20"
                                            }`}
                                    >
                                        {selectedMessage.status}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="p-8">
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
                                Message
                            </h3>
                            <p className="text-white whitespace-pre-wrap leading-relaxed text-base">
                                {selectedMessage.message}
                            </p>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-8 border-t border-gray-900 bg-black flex gap-4">
                            <button
                                onClick={() => {
                                    handleMarkAsRead(selectedMessage._id, selectedMessage.status);
                                    setSelectedMessage(null);
                                }}
                                className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold uppercase tracking-wider transition-all shadow-lg"
                            >
                                Mark as {selectedMessage.status === "unread" ? "Read" : "Unread"}
                            </button>
                            <button
                                onClick={() =>
                                    handleReplyEmail(selectedMessage.email, selectedMessage.subject)
                                }
                                className="flex-1 px-6 py-3 bg-primary hover:bg-red-700 text-white rounded-xl font-bold uppercase tracking-wider transition-all shadow-lg shadow-primary/20"
                            >
                                Reply via Email
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
