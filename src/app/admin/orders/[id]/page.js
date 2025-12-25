"use client";
import { useState, useEffect, use, useRef } from "react";
import { useRouter } from "next/navigation";
import {
    ArrowLeftIcon,
    PrinterIcon,
    CheckCircleIcon,
    TruckIcon,
    XCircleIcon,
    ClockIcon,
    ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";
import Sidebar from "@/app/components/admin/Sidebar";
import { showAlert } from "@/utils/sweetAlert";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function OrderDetailPage({ params }) {
    const router = useRouter();
    const resolvedParams = use(params);
    const { id } = resolvedParams;
    const invoiceRef = useRef(null);

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [downloading, setDownloading] = useState(false);

    const fetchOrder = async () => {
        try {
            setLoading(true);
            const res = await fetch(`/api/admin/orders/${id}`);
            const data = await res.json();
            if (res.ok) {
                setOrder(data.order);
            } else {
                showAlert("error", "Error", data.message || "Order not found");
                router.push("/admin/orders");
            }
        } catch (error) {
            console.error("Failed to fetch order", error);
            showAlert("error", "Error", "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrder();
    }, [id]);

    const handleStatusUpdate = async (newStatus) => {
        try {
            setUpdating(true);
            const res = await fetch(`/api/admin/orders/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });
            const data = await res.json();
            if (res.ok) {
                setOrder(data.order);
                showAlert("success", "Success", "Order status updated");
            } else {
                showAlert("error", "Error", data.message || "Failed to update status");
            }
        } catch (error) {
            console.error("Update status failed", error);
            showAlert("error", "Error", "Something went wrong");
        } finally {
            setUpdating(false);
        }
    };

    const downloadPDF = async () => {
        if (!invoiceRef.current) return;
        setDownloading(true);
        try {
            const element = invoiceRef.current;
            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                backgroundColor: "#ffffff",
                onclone: (clonedDoc) => {
                    const clonedSection = clonedDoc.querySelector(".print-section");
                    if (clonedSection) {
                        // 1. Force extreme simplicity for the PDF capture
                        clonedSection.style.fontFamily = "Arial, sans-serif";
                        clonedSection.style.background = "#ffffff";

                        // 2. Remove any problematic styles like complex filters, masks, or modern colors
                        const allElements = clonedSection.querySelectorAll("*");
                        allElements.forEach(el => {
                            const style = window.getComputedStyle(el);

                            // If an element has a background involving 'lab' or 'oklch', force it to something safe
                            // html2canvas fails on these. We'll just reset them to basic hex/rgb.
                            if (el.classList.contains("bg-[#111]") || el.classList.contains("bg-black")) {
                                el.style.backgroundColor = "#ffffff";
                            }

                            el.style.color = "#000000";
                            el.style.borderColor = "#dddddd";
                            el.style.boxShadow = "none";
                            el.style.textShadow = "none";
                            el.style.filter = "none";
                        });

                        // 3. Ensure tables are clean
                        clonedSection.querySelectorAll("table").forEach(tab => {
                            tab.style.borderCollapse = "collapse";
                            tab.style.width = "100%";
                        });

                        clonedSection.querySelectorAll("th").forEach(th => {
                            th.style.backgroundColor = "#f3f4f6";
                            th.style.color = "#000000";
                        });

                        // 4. Hide anything marked no-print
                        clonedDoc.querySelectorAll(".no-print").forEach(el => el.style.display = "none");
                    }
                }
            });

            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4");
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
            pdf.save(`invoice-${order.orderId}.pdf`);
            showAlert("success", "PDF Saved", "Invoice has been downloaded.");
        } catch (error) {
            console.error("PDF Export Error:", error);
            showAlert("error", "Export Failed", "Could not generate PDF. Please use the 'Print' option and save as PDF.");
        } finally {
            setDownloading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] text-white font-sans flex items-center justify-center">
                <div className="animate-pulse">Loading Order Details...</div>
            </div>
        );
    }

    if (!order) return null;

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-sans flex order-detail-container">
            <style jsx global>{`
                @media print {
                    @page {
                        margin: 20mm;
                        size: auto;
                    }
                    body {
                        background: white !important;
                        color: black !important;
                    }
                    /* Hide Sidebar and non-essential UI */
                    aside, 
                    .no-print,
                    button,
                    nav,
                    .flex.items-center.text-gray-400,
                    header .flex.wrap.gap-3,
                    .back-button {
                        display: none !important;
                    }
                    
                    /* Reset main layout */
                    main {
                        margin-left: 0 !important;
                        padding: 0 !important;
                        height: auto !important;
                        overflow: visible !important;
                        width: 100% !important;
                        background: white !important;
                    }

                    .order-detail-container {
                        background: white !important;
                        display: block !important;
                    }

                    /* Styling adjustments for print */
                    .bg-[#111], .bg-black, .bg-gray-900, .bg-black\/50 {
                        background: white !important;
                        border-color: #eee !important;
                        color: black !important;
                        box-shadow: none !important;
                    }

                    h2, h3, span, div, p, td, th {
                        color: black !important;
                    }

                    .text-primary {
                        color: #e11d48 !important;
                    }

                    .border-gray-900, .border-gray-800 {
                        border-color: #ddd !important;
                    }

                    /* Ensure tables look good */
                    table {
                        width: 100% !important;
                        border-collapse: collapse !important;
                    }
                    th {
                        background: #f9f9f9 !important;
                        border-bottom: 2px solid #ddd !important;
                    }
                    
                    /* Force layout to be more vertical/full width */
                    .grid {
                        display: block !important;
                    }
                    .lg\:col-span-2, .lg\:w-1\/3, .space-y-8 > div {
                        width: 100% !important;
                        margin-bottom: 20px !important;
                    }
                }
            `}</style>
            <Sidebar />

            <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen custom-scrollbar" id="print-content">
                <button
                    onClick={() => router.push("/admin/orders")}
                    className="flex items-center text-gray-400 hover:text-white mb-6 transition-colors group back-button no-print"
                >
                    <ArrowLeftIcon className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Orders
                </button>

                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8 invoice-header">
                    <div>
                        <div className="flex items-center gap-4 mb-2">
                            <h2 className="text-3xl font-black uppercase tracking-tight text-white">
                                Order <span className="text-primary">#{order.orderId}</span>
                            </h2>
                            <span className={`px-4 py-1.5 rounded-full text-xs font-bold border uppercase tracking-widest ${getStatusColor(order.status)}`}>
                                {order.status}
                            </span>
                        </div>
                        <p className="text-gray-400">
                            Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3 no-print">
                        <button
                            disabled={downloading}
                            onClick={downloadPDF}
                            className="flex items-center px-6 py-3 bg-primary text-white rounded-xl hover:bg-red-700 transition-all font-bold text-sm uppercase tracking-wider shadow-lg disabled:opacity-50"
                        >
                            <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                            {downloading ? "Generating..." : "Download PDF"}
                        </button>

                        <button
                            onClick={() => window.print()}
                            className="flex items-center px-6 py-3 bg-gray-900 border border-gray-800 text-white rounded-xl hover:bg-gray-800 transition-all font-bold text-sm uppercase tracking-wider shadow-lg"
                        >
                            <PrinterIcon className="h-5 w-5 mr-2 text-gray-400" />
                            Print Invoice
                        </button>

                        {/* Status Actions */}
                        {order.status !== "delivered" && order.status !== "cancelled" && (
                            <div className="flex gap-3">
                                {order.status === "pending" && (
                                    <button
                                        disabled={updating}
                                        onClick={() => handleStatusUpdate("processing")}
                                        className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-bold text-sm uppercase tracking-wider shadow-lg disabled:opacity-50"
                                    >
                                        Mark Processing
                                    </button>
                                )}
                                {order.status === "processing" && (
                                    <button
                                        disabled={updating}
                                        onClick={() => handleStatusUpdate("shipped")}
                                        className="flex items-center px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all font-bold text-sm uppercase tracking-wider shadow-lg disabled:opacity-50"
                                    >
                                        Mark Shipped
                                    </button>
                                )}
                                {order.status === "shipped" && (
                                    <button
                                        disabled={updating}
                                        onClick={() => handleStatusUpdate("delivered")}
                                        className="flex items-center px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all font-bold text-sm uppercase tracking-wider shadow-lg disabled:opacity-50"
                                    >
                                        Mark Delivered
                                    </button>
                                )}
                                <button
                                    disabled={updating}
                                    onClick={() => handleStatusUpdate("cancelled")}
                                    className="flex items-center px-6 py-3 bg-red-600/10 border border-red-600/30 text-red-500 rounded-xl hover:bg-red-600 hover:text-white transition-all font-bold text-sm uppercase tracking-wider shadow-lg disabled:opacity-50"
                                >
                                    Cancel Order
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div ref={invoiceRef} className="print-section">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Items Section */}
                        <div className="lg:col-span-2 space-y-8">
                            <div className="bg-[#111] border border-gray-900 rounded-2xl overflow-hidden shadow-xl">
                                <div className="p-6 border-b border-gray-900 flex justify-between items-center">
                                    <h3 className="text-lg font-bold uppercase tracking-wider flex items-center gap-2">
                                        Items Breakdown
                                        <span className="text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded font-normal">
                                            {order.items.length} Unique Items
                                        </span>
                                    </h3>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm text-gray-400">
                                        <thead className="bg-black text-gray-200 uppercase font-bold text-xs tracking-wider border-b border-gray-900">
                                            <tr>
                                                <th className="px-6 py-4">Product</th>
                                                <th className="px-6 py-4 text-center">Qty</th>
                                                <th className="px-6 py-4 text-center">Unit Price</th>
                                                <th className="px-6 py-4 text-right">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-900">
                                            {order.items.map((item, idx) => (
                                                <tr key={idx} className="hover:bg-gray-900/30 transition-colors">
                                                    <td className="px-6 py-4 flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded bg-gray-800 border border-gray-700 overflow-hidden flex-shrink-0">
                                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-white uppercase">{item.name}</div>
                                                            <div className="text-[10px] text-gray-500 uppercase">Product ID: {item.product}</div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-center text-white font-bold">{item.quantity}</td>
                                                    <td className="px-6 py-4 text-center">${item.price.toFixed(2)}</td>
                                                    <td className="px-6 py-4 text-right text-white font-bold">${(item.price * item.quantity).toFixed(2)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="p-6 bg-black/50 space-y-3">
                                    <div className="flex justify-between text-gray-400">
                                        <span>Subtotal</span>
                                        <span className="text-white font-bold">${(order.total + (order.discount || 0)).toFixed(2)}</span>
                                    </div>
                                    {order.discount > 0 && (
                                        <div className="flex justify-between text-green-500">
                                            <span>Discount ({order.appliedPromo || "Promo Applied"})</span>
                                            <span className="font-bold">-${order.discount.toFixed(2)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-gray-400">
                                        <span>Shipping</span>
                                        <span className="text-white font-bold">$0.00</span>
                                    </div>
                                    <div className="pt-3 border-t border-gray-800 flex justify-between items-end">
                                        <span className="text-xl font-bold text-white">Total Amount</span>
                                        <span className="text-3xl font-black text-primary">${order.total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Transaction Info */}
                            <div className="bg-[#111] border border-gray-900 rounded-2xl p-6 shadow-xl">
                                <h3 className="text-lg font-bold uppercase tracking-wider mb-6 pb-4 border-b border-gray-900">Payment Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-start">
                                            <span className="text-gray-500 text-xs uppercase font-bold">Method</span>
                                            <span className="text-white font-bold uppercase">{order.paymentMethod}</span>
                                        </div>
                                        <div className="flex justify-between items-start">
                                            <span className="text-gray-500 text-xs uppercase font-bold">Transaction ID</span>
                                            <span className="text-white font-mono text-xs">{order.paymentId || "N/A"}</span>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-green-500/5 border border-green-500/20 rounded-xl flex items-center gap-4">
                                        <CheckCircleIcon className="h-10 w-10 text-green-500" />
                                        <div>
                                            <div className="text-green-500 font-bold uppercase text-xs tracking-widest">Payment Status</div>
                                            <div className="text-white font-black text-xl uppercase text-white">Success</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Customer & Shipping */}
                        <div className="space-y-8">
                            <div className="bg-[#111] border border-gray-900 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-5">
                                    <TruckIcon className="h-20 w-20" />
                                </div>
                                <h3 className="text-lg font-bold uppercase tracking-wider mb-6 pb-4 border-b border-gray-900">Shipping Details</h3>
                                <div className="space-y-6">
                                    <div>
                                        <span className="text-gray-500 text-xs uppercase font-bold block mb-1">Customer Name</span>
                                        <span className="text-white font-bold text-lg">{order.shippingAddress?.firstName} {order.shippingAddress?.lastName}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500 text-xs uppercase font-bold block mb-1">Email Address</span>
                                        <span className="text-primary font-bold">{order.shippingAddress?.email}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500 text-xs uppercase font-bold block mb-1">Street Address</span>
                                        <p className="text-white font-medium leading-relaxed underline decoration-gray-800 underline-offset-4">
                                            {order.shippingAddress?.address}
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <span className="text-gray-500 text-xs uppercase font-bold block mb-1">City</span>
                                            <span className="text-white font-bold">{order.shippingAddress?.city}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500 text-xs uppercase font-bold block mb-1">ZIP Code</span>
                                            <span className="text-white font-bold">{order.shippingAddress?.zip}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-gray-500 text-xs uppercase font-bold block mb-1">Country</span>
                                        <span className="text-white font-bold">{order.shippingAddress?.country || "N/A"}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Status Steps - Hidden in PDF sometimes if needed, or keep for detail */}
                            <div className="bg-[#111] border border-gray-900 rounded-2xl p-6 shadow-xl no-print">
                                <h3 className="text-lg font-bold uppercase tracking-wider mb-6 pb-4 border-b border-gray-900">Current Progress</h3>
                                <div className="space-y-8">
                                    <StatusStep icon={ClockIcon} label="Pending" active={order.status === "pending"} done={["processing", "shipped", "delivered"].includes(order.status)} />
                                    <StatusStep icon={TruckIcon} label="Processing" active={order.status === "processing"} done={["shipped", "delivered"].includes(order.status)} />
                                    <StatusStep icon={TruckIcon} label="Shipped" active={order.status === "shipped"} done={order.status === "delivered"} />
                                    <StatusStep icon={CheckCircleIcon} label="Delivered" active={order.status === "delivered"} done={false} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

function StatusStep({ icon: Icon, label, active, done }) {
    return (
        <div className="flex items-center gap-4">
            <div className={`p-3 rounded-full border-2 transition-all ${done ? "bg-green-500 border-green-500 text-white" : active ? "bg-primary border-primary text-white scale-110 shadow-lg shadow-primary/30" : "bg-gray-900 border-gray-800 text-gray-600"}`}>
                <Icon className="h-5 w-5" />
            </div>
            <div className="flex-1">
                <div className={`text-sm font-bold uppercase tracking-widest ${active ? "text-primary" : done ? "text-green-500" : "text-gray-600"}`}>
                    {label}
                </div>
                {active && <div className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Current Status</div>}
                {done && <div className="text-[10px] text-green-500/50 font-bold uppercase tracking-tighter">Completed</div>}
            </div>
        </div>
    );
}

function getStatusColor(status) {
    switch (status) {
        case "pending": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
        case "processing": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
        case "shipped": return "bg-purple-500/10 text-purple-500 border-purple-500/20";
        case "delivered": return "bg-green-500/10 text-green-500 border-green-500/20";
        case "cancelled": return "bg-red-500/10 text-red-500 border-red-500/20";
        default: return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
}
