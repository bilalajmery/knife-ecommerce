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

    // Shipping Modal State
    const [showShippingModal, setShowShippingModal] = useState(false);
    const [shippingData, setShippingData] = useState({
        carrier: "Fedex",
        trackingId: ""
    });

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

    const handleStatusUpdate = async (newStatus, shippingDetails = null) => {
        try {
            setUpdating(true);
            const res = await fetch(`/api/admin/orders/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    status: newStatus,
                    shippingDetails: shippingDetails
                }),
            });
            const data = await res.json();
            if (res.ok) {
                setOrder(data.order);
                setShowShippingModal(false);
                showAlert("success", "Success", `Order marked as ${newStatus}`);
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
                    clonedDoc.head.querySelectorAll("style, link[rel='stylesheet']").forEach(el => el.remove());
                    const safeStyle = clonedDoc.createElement("style");
                    safeStyle.textContent = `
                        * { box-sizing: border-box !important; }
                        body { background: white !important; color: black !important; font-family: Arial, sans-serif !important; margin: 0 !important; padding: 0 !important; }
                        .print-section { width: 1000px !important; padding: 40px !important; background: white !important; display: block !important; }
                        .grid { display: flex !important; flex-wrap: wrap !important; gap: 30px !important; }
                        .lg\\:col-span-2 { flex: 0 0 65% !important; width: 65% !important; }
                        .space-y-8 > * + * { margin-top: 30px !important; }
                        .bg-black, .bg-\\[\\#111\\], .bg-gray-900, .bg-black\\/50 { background: white !important; border: 1px solid #eee !important; }
                        .text-white { color: black !important; }
                        .text-primary { color: #dc2626 !important; }
                        table { width: 100% !important; border-collapse: collapse !important; }
                        th { background: #f6f6f6 !important; border-bottom: 2px solid #eee !important; padding: 12px !important; }
                        td { border-bottom: 1px solid #eee !important; padding: 12px !important; }
                        .no-print { display: none !important; }
                    `;
                    clonedDoc.head.appendChild(safeStyle);
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
            showAlert("error", "Export Failed", "Could not generate PDF.");
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
                    @page { margin: 20mm; size: auto; }
                    body { background: white !important; color: black !important; }
                    aside, .no-print, button, nav, .back-button { display: none !important; }
                    main { margin-left: 0 !important; padding: 0 !important; height: auto !important; width: 100% !important; }
                    .order-detail-container { display: block !important; }
                    .bg-[#111], .bg-black, .bg-gray-900 { background: white !important; border-color: #eee !important; color: black !important; }
                    .text-white, span, div, p { color: black !important; }
                    .text-primary { color: #e11d48 !important; }
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

                <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8 invoice-header">
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
                            className="flex items-center px-6 py-3 bg-gray-900 border border-gray-800 text-white rounded-xl hover:bg-gray-800 transition-all font-bold text-sm uppercase tracking-wider"
                        >
                            <PrinterIcon className="h-5 w-5 mr-2 text-gray-400" />
                            Print Invoice
                        </button>

                        {order.status !== "delivered" && order.status !== "cancelled" && (
                            <div className="flex gap-3">
                                {order.status === "pending" && (
                                    <button onClick={() => handleStatusUpdate("processing")} className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm uppercase">Mark Processing</button>
                                )}
                                {order.status === "processing" && (
                                    <button onClick={() => setShowShippingModal(true)} className="px-6 py-3 bg-purple-600 text-white rounded-xl font-bold text-sm uppercase">Mark Shipped</button>
                                )}
                                {order.status === "shipped" && (
                                    <button onClick={() => handleStatusUpdate("delivered")} className="px-6 py-3 bg-green-600 text-white rounded-xl font-bold text-sm uppercase">Mark Delivered</button>
                                )}
                                <button onClick={() => handleStatusUpdate("cancelled")} className="px-6 py-3 bg-red-600/10 border border-red-600/30 text-red-500 rounded-xl font-bold text-sm uppercase">Cancel</button>
                            </div>
                        )}
                    </div>
                </header>

                <div ref={invoiceRef} className="print-section">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column */}
                        <div className="lg:col-span-2 space-y-8">
                            <div className="bg-[#111] border border-gray-900 rounded-2xl overflow-hidden shadow-xl">
                                <div className="p-6 border-b border-gray-900">
                                    <h3 className="text-lg font-bold uppercase tracking-wider">Items Breakdown</h3>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm text-gray-400">
                                        <thead className="bg-black text-gray-200 uppercase font-bold text-[10px] tracking-widest border-b border-gray-900">
                                            <tr>
                                                <th className="px-6 py-4">Product</th>
                                                <th className="px-6 py-4 text-center">Qty</th>
                                                <th className="px-6 py-4 text-center">Price</th>
                                                <th className="px-6 py-4 text-right">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-900">
                                            {order.items.map((item, idx) => (
                                                <tr key={idx} className="hover:bg-gray-900/30 transition-colors">
                                                    <td className="px-6 py-4 flex items-center gap-4">
                                                        <img src={item.image} alt="" className="w-12 h-12 rounded bg-gray-800 object-cover" />
                                                        <div>
                                                            <div className="font-bold text-white uppercase">{item.name}</div>
                                                            <div className="text-[10px] text-gray-500">ID: {item.product}</div>
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
                                    <div className="flex justify-between text-gray-400 text-sm">
                                        <span>Subtotal</span>
                                        <span className="text-white font-bold">${(order.total + (order.discount || 0)).toFixed(2)}</span>
                                    </div>
                                    {order.discount > 0 && (
                                        <div className="flex justify-between text-green-500 text-sm">
                                            <span>Discount</span>
                                            <span className="font-bold">-${order.discount.toFixed(2)}</span>
                                        </div>
                                    )}
                                    <div className="pt-3 border-t border-gray-800 flex justify-between items-end">
                                        <span className="text-xl font-bold text-white uppercase tracking-tighter">Total Amount</span>
                                        <span className="text-3xl font-black text-primary">${order.total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-[#111] border border-gray-900 rounded-2xl p-6 shadow-xl">
                                <h3 className="text-sm font-black uppercase tracking-widest text-gray-500 mb-6 border-b border-gray-900 pb-4">Payment Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <div className="flex justify-between text-xs">
                                            <span className="text-gray-500 uppercase font-bold">Method</span>
                                            <span className="text-white font-bold uppercase">{order.paymentMethod}</span>
                                        </div>
                                        <div className="flex justify-between text-xs">
                                            <span className="text-gray-500 uppercase font-bold">Transaction ID</span>
                                            <span className="text-white font-mono">{order.paymentId || "N/A"}</span>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-green-500/5 border border-green-500/20 rounded-xl flex items-center gap-4">
                                        <CheckCircleIcon className="h-10 w-10 text-green-500" />
                                        <div>
                                            <div className="text-green-500 font-bold uppercase text-[10px] tracking-widest">Payment Status</div>
                                            <div className="text-white font-black text-xl uppercase">Success</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-8">
                            <div className="bg-[#111] border border-gray-900 rounded-2xl p-6 shadow-xl">
                                <h3 className="text-sm font-black uppercase tracking-widest text-gray-500 mb-6 border-b border-gray-900 pb-4">Shipping Details</h3>
                                <div className="space-y-6">
                                    <div>
                                        <span className="text-[10px] text-gray-500 uppercase font-bold block mb-1">Customer</span>
                                        <span className="text-white font-bold text-lg">{order.shippingAddress?.firstName} {order.shippingAddress?.lastName}</span>
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-gray-500 uppercase font-bold block mb-1">Email</span>
                                        <span className="text-primary font-bold">{order.shippingAddress?.email}</span>
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-gray-500 uppercase font-bold block mb-1">Phone</span>
                                        <span className="text-white font-bold">{order.shippingAddress?.phone || "N/A"}</span>
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-gray-500 uppercase font-bold block mb-1">Address</span>
                                        <p className="text-white font-medium text-sm leading-relaxed">{order.shippingAddress?.address}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 text-sm mt-4">
                                        <div>
                                            <span className="text-[10px] text-gray-500 uppercase font-bold block mb-1">City</span>
                                            <span className="text-white font-bold">{order.shippingAddress?.city?.name || order.shippingAddress?.city}</span>
                                        </div>
                                        <div>
                                            <span className="text-[10px] text-gray-500 uppercase font-bold block mb-1">State</span>
                                            <span className="text-white font-bold">{order.shippingAddress?.state?.name || order.shippingAddress?.state || "N/A"}</span>
                                        </div>
                                        <div>
                                            <span className="text-[10px] text-gray-500 uppercase font-bold block mb-1">ZIP</span>
                                            <span className="text-white font-bold">{order.shippingAddress?.zip}</span>
                                        </div>
                                        <div>
                                            <span className="text-[10px] text-gray-500 uppercase font-bold block mb-1">Country</span>
                                            <span className="text-white font-bold">{order.shippingAddress?.country?.name || order.shippingAddress?.country || "N/A"}</span>
                                        </div>
                                    </div>

                                    {/* Tracking Section */}
                                    {order.shippingDetails?.carrier && (
                                        <div className="mt-8 pt-6 border-t border-gray-800">
                                            <div className="flex items-center gap-2 mb-4">
                                                <TruckIcon className="h-4 w-4 text-primary" />
                                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Tracking Info</h4>
                                            </div>
                                            <div className="bg-black/40 border border-gray-800 rounded-xl p-4 space-y-3">
                                                <div className="flex justify-between text-xs">
                                                    <span className="text-gray-500 font-bold uppercase">Carrier</span>
                                                    <span className="text-white font-bold">{order.shippingDetails.carrier}</span>
                                                </div>
                                                <div className="flex justify-between text-xs">
                                                    <span className="text-gray-500 font-bold uppercase">Tracking ID</span>
                                                    <button onClick={() => { navigator.clipboard.writeText(order.shippingDetails.trackingId); showAlert("success", "Copied", "ID Copied"); }} className="text-primary hover:underline font-mono">{order.shippingDetails.trackingId}</button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="bg-[#111] border border-gray-900 rounded-2xl p-6 shadow-xl no-print">
                                <h3 className="text-sm font-black uppercase tracking-widest text-gray-500 mb-6 border-b border-gray-900 pb-4">Current Progress</h3>
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

                {/* Shipping Modal */}
                {showShippingModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <div className="bg-[#111] border border-gray-800 rounded-2xl w-full max-w-md overflow-hidden">
                            <div className="p-6 border-b border-gray-800 flex justify-between items-center">
                                <h3 className="text-xl font-black uppercase tracking-wider text-white">Enter Shipment Details</h3>
                                <button onClick={() => setShowShippingModal(false)} className="text-gray-500 hover:text-white"><XCircleIcon className="h-6 w-6" /></button>
                            </div>
                            <div className="p-6 space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Shipping Company</label>
                                    <select value={shippingData.carrier} onChange={(e) => setShippingData({ ...shippingData, carrier: e.target.value })} className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary">
                                        <option value="Fedex">Fedex</option><option value="UPS">UPS</option><option value="DHL">DHL</option><option value="USPS">USPS</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Tracking ID</label>
                                    <input type="text" placeholder="Enter Tracking Number" value={shippingData.trackingId} onChange={(e) => setShippingData({ ...shippingData, trackingId: e.target.value })} className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary" />
                                </div>
                                <div className="flex gap-4 pt-4">
                                    <button onClick={() => setShowShippingModal(false)} className="flex-1 py-3 bg-gray-900 text-gray-400 rounded-xl font-bold uppercase text-xs">Cancel</button>
                                    <button onClick={() => { if (!shippingData.trackingId) return showAlert("error", "Error", "Please enter tracking ID"); handleStatusUpdate("shipped", shippingData); }} className="flex-1 py-3 bg-primary text-white rounded-xl font-bold uppercase text-xs hover:bg-red-700">Confirm Shipment</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
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
