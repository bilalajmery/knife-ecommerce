"use client";
import { useState, useEffect } from "react";
import {
    TrashIcon,
    TicketIcon,
    PlusIcon,
    ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { showAlert, showConfirm } from "../../../utils/sweetAlert";
import Sidebar from "../../components/admin/Sidebar";
import { toast } from "sonner";

export default function PromosPage() {
    const [promos, setPromos] = useState([]);
    const [loading, setLoading] = useState(true);

    // Form State
    const [newCode, setNewCode] = useState("");
    const [newDiscount, setNewDiscount] = useState(10);
    const [creating, setCreating] = useState(false);

    const fetchPromos = async () => {
        try {
            const res = await fetch("/api/admin/promos");
            const data = await res.json();
            if (data.success) {
                setPromos(data.promos);
            }
        } catch (error) {
            console.error("Failed to fetch promos", error);
            toast.error("Failed to fetch promos");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPromos();
    }, []);

    const generateRandomCode = () => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let result = "";
        for (let i = 0; i < 8; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setNewCode(result);
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!newCode || !newDiscount) {
            toast.error("Please fill in all fields");
            return;
        }

        setCreating(true);
        try {
            const res = await fetch("/api/admin/promos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code: newCode, discount: Number(newDiscount) }),
            });

            const data = await res.json();

            if (res.ok) {
                toast.success("Promo code created successfully");
                setNewCode("");
                setNewDiscount(10);
                fetchPromos();
            } else {
                toast.error(data.message || "Failed to create promo");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setCreating(false);
        }
    };

    const handleDelete = async (id) => {
        const result = await showConfirm(
            "Are you sure?",
            "You won't be able to revert this!"
        );

        if (result.isConfirmed) {
            try {
                const res = await fetch("/api/admin/promos", {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id }),
                });

                if (res.ok) {
                    fetchPromos();
                    showAlert("success", "Deleted!", "Promo code has been deleted.");
                } else {
                    showAlert("error", "Error", "Failed to delete promo");
                }
            } catch (error) {
                showAlert("error", "Error", "Something went wrong");
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-sans flex">
            <Sidebar />
            <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen custom-scrollbar">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Promo Codes</h2>
                        <p className="text-gray-400 mt-1">
                            Manage discount codes and promotions
                        </p>
                    </div>
                </header>

                {/* Create New Promo Section */}
                <div className="bg-[#111] border border-gray-900 rounded-2xl p-6 mb-8 shadow-xl">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <PlusIcon className="h-5 w-5 text-primary" />
                        Create New Promo
                    </h3>
                    <form onSubmit={handleCreate} className="flex flex-col md:flex-row gap-4 items-end">
                        <div className="w-full md:w-1/3">
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                                Promo Code
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newCode}
                                    onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                                    placeholder="e.g. SUMMER20"
                                    className="flex-1 bg-black border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-primary transition-all font-mono"
                                />
                                <button
                                    type="button"
                                    onClick={generateRandomCode}
                                    className="p-3 bg-gray-800 text-gray-400 rounded-xl hover:bg-gray-700 hover:text-white transition-colors"
                                    title="Generate Random Code"
                                >
                                    <ArrowPathIcon className="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        <div className="w-full md:w-1/3">
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                                Discount (%)
                            </label>
                            <input
                                type="number"
                                min="1"
                                max="100"
                                value={newDiscount}
                                onChange={(e) => setNewDiscount(e.target.value)}
                                className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-primary transition-all font-mono"
                            />
                        </div>

                        <div className="w-full md:w-auto">
                            <button
                                type="submit"
                                disabled={creating}
                                className="w-full md:w-auto px-8 py-3 bg-primary text-white rounded-xl hover:bg-red-700 transition-all font-bold text-sm uppercase tracking-wider shadow-lg shadow-primary/20 hover:shadow-primary/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {creating ? "Creating..." : "Create Promo"}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Promos Table */}
                <div className="bg-[#111] border border-gray-900 rounded-2xl overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-400">
                            <thead className="bg-black text-gray-200 uppercase font-bold text-xs tracking-wider border-b border-gray-900">
                                <tr>
                                    <th className="px-8 py-5">Code</th>
                                    <th className="px-6 py-5">Discount</th>
                                    <th className="px-6 py-5">Created At</th>
                                    <th className="px-6 py-5">Status</th>
                                    <th className="px-8 py-5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-900">
                                {loading ? (
                                    <tr>
                                        <td colSpan="5" className="px-8 py-12 text-center text-gray-500">
                                            Loading...
                                        </td>
                                    </tr>
                                ) : promos.length > 0 ? (
                                    promos.map((promo) => (
                                        <tr
                                            key={promo._id}
                                            className="hover:bg-gray-900/50 transition-colors group"
                                        >
                                            <td className="px-8 py-5 font-bold text-white font-mono text-lg group-hover:text-primary transition-colors">
                                                {promo.code}
                                            </td>
                                            <td className="px-6 py-5 text-white font-bold text-lg">
                                                {promo.discount}%
                                            </td>
                                            <td className="px-6 py-5 text-gray-500">
                                                {new Date(promo.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-5">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${promo.status === "used"
                                                        ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                                                        : promo.isActive
                                                            ? "bg-green-500/10 text-green-500 border-green-500/20"
                                                            : "bg-red-500/10 text-red-500 border-red-500/20"
                                                        }`}
                                                >
                                                    {promo.status === "used" ? "Used" : promo.isActive ? "Active" : "Inactive"}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <button
                                                    onClick={() => handleDelete(promo._id)}
                                                    className="p-2 rounded-lg hover:bg-red-500/10 text-gray-500 hover:text-red-500 transition-colors"
                                                    title="Delete"
                                                >
                                                    <TrashIcon className="h-5 w-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-8 py-12 text-center text-gray-500">
                                            <div className="flex flex-col items-center justify-center">
                                                <TicketIcon className="h-12 w-12 text-gray-700 mb-4" />
                                                <p className="text-lg font-medium text-gray-400">
                                                    No promo codes found
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}
