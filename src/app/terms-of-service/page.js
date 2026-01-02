"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

export default function TermsOfService() {
    return (
        <React.Fragment>
            <Navbar />
            <div className="min-h-screen bg-black text-gray-300 font-sans selection:bg-primary/30">
                {/* Header */}
                <div className="relative py-32 mb-12 bg-gray-900 overflow-hidden">
                    <div className="absolute inset-0">
                        <Image
                            src="/hero-tactical.png"
                            alt="Terms of Service Header"
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
                            <span className="text-white font-bold">Terms of Service</span>
                        </nav>

                        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6">
                            Terms of <span className="text-primary">Service</span>
                        </h1>
                        <p className="text-gray-300 max-w-2xl mx-auto text-lg">
                            Last Updated: {new Date().toLocaleDateString()}
                        </p>
                    </div>
                </div>

                {/* Content */}
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
                    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 space-y-8">
                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-white flex items-center">
                                <span className="w-1.5 h-6 bg-primary mr-3 rounded-full"></span>
                                1. Introduction
                            </h2>
                            <p className="leading-relaxed">
                                Welcome to KnifeMaster. By accessing our website and purchasing our products, you agree to be bound by these Terms of Service. Please read them carefully before using our services.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-white flex items-center">
                                <span className="w-1.5 h-6 bg-primary mr-3 rounded-full"></span>
                                2. Age Restriction
                            </h2>
                            <p className="leading-relaxed">
                                You must be at least 18 years of age to purchase knives or other bladed products from this site. By placing an order, you certify that you are of legal age and that the purchase complies with all local, state, and federal laws.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-white flex items-center">
                                <span className="w-1.5 h-6 bg-primary mr-3 rounded-full"></span>
                                3. Products and Pricing
                            </h2>
                            <p className="leading-relaxed">
                                We strive to display our products as accurately as possible. However, we cannot guarantee that your monitor's display of any color will be accurate. Prices for our products are subject to change without notice. We reserve the right at any time to modify or discontinue the Service (or any part thereof) without notice at any time.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-white flex items-center">
                                <span className="w-1.5 h-6 bg-primary mr-3 rounded-full"></span>
                                4. Shipping and Returns
                            </h2>
                            <p className="leading-relaxed">
                                Shipping times are estimates and not guarantees. We are not responsible for delays caused by the carrier. Please review our Return Policy for information about returns and exchanges.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-white flex items-center">
                                <span className="w-1.5 h-6 bg-primary mr-3 rounded-full"></span>
                                5. Limitation of Liability
                            </h2>
                            <p className="leading-relaxed">
                                In no case shall KnifeMaster, our directors, officers, employees, affiliates, agents, contractors, interns, suppliers, service providers or licensors be liable for any injury, loss, claim, or any direct, indirect, incidental, punitive, special, or consequential damages of any kind.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-white flex items-center">
                                <span className="w-1.5 h-6 bg-primary mr-3 rounded-full"></span>
                                6. Governing Law
                            </h2>
                            <p className="leading-relaxed">
                                These Terms of Service and any separate agreements whereby we provide you Services shall be governed by and construed in accordance with the laws of the United States.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
            <Footer />
        </React.Fragment>
    );
}
