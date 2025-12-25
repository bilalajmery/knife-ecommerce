"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/context/CartContext";

export default function ThankYouPage() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get("orderId");
    const { refreshCart } = useCart();
    const [isValidOrderId, setIsValidOrderId] = useState(false);

    useEffect(() => {
        // Ensure cart is refreshed/empty when landing here
        refreshCart();

        if (orderId && orderId !== "undefined" && orderId !== "null") {
            setIsValidOrderId(true);
        }
    }, [orderId]);

    return (
        <div className="bg-black min-h-screen text-white font-sans selection:bg-primary selection:text-white flex flex-col">
            <Navbar />

            {/* Header */}
            <div className="relative py-32 mb-12 bg-gray-900 overflow-hidden">
                <div className="absolute inset-0">
                    <Image
                        src="/hero-knife.png"
                        alt="Order Confirmed"
                        fill
                        className="object-cover opacity-40"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/80" />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <nav className="flex justify-center items-center text-sm text-gray-400 mb-6 uppercase tracking-widest">
                        <Link href="/" className="hover:text-primary transition-colors">
                            Home
                        </Link>
                        <span className="mx-3 text-gray-600">/</span>
                        <span className="text-white font-bold">Order Confirmed</span>
                    </nav>

                    <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6">
                        Order <span className="text-primary">Placed</span>
                    </h1>
                    <p className="text-gray-300 max-w-2xl mx-auto text-lg">
                        Thank you for your purchase. Your order has been securely processed.
                    </p>
                </div>
            </div>

            <main className="flex-grow flex items-center justify-center relative overflow-hidden pb-24 px-4">
                <div className="z-10 text-center max-w-2xl mx-auto border border-gray-800 bg-gray-900/50 p-12 rounded-lg backdrop-blur-sm shadow-2xl relative">
                    {/* Success Icon */}
                    <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse-slow">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-12 w-12 text-green-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>

                    <h2 className="text-3xl font-black uppercase tracking-tighter mb-4 text-white">
                        Success!
                    </h2>

                    <p className="text-gray-300 text-lg mb-8">
                        We have received your order and are preparing it for shipment. You will receive a confirmation email shortly.
                    </p>

                    {isValidOrderId && (
                        <div className="bg-gray-800/50 border border-gray-700 rounded p-4 mb-8 inline-block animate-fade-in-up">
                            <span className="text-xs text-gray-400 uppercase tracking-widest block mb-1">Order ID</span>
                            <span className="font-mono text-xl text-primary font-bold">#{orderId}</span>
                        </div>
                    )}

                    <div className="space-y-4">
                        <Link
                            href="/"
                            className="inline-block w-full sm:w-auto bg-primary text-white font-bold uppercase tracking-widest px-8 py-4 rounded-md hover:bg-red-700 transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 group"
                        >
                            <span className="flex items-center justify-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:-translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                                </svg>
                                Back to Home
                            </span>
                        </Link>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
