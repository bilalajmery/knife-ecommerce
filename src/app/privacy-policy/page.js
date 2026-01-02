"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

export default function PrivacyPolicy() {
    return (
        <React.Fragment>
            <Navbar />
            <div className="min-h-screen bg-black text-gray-300 font-sans selection:bg-primary/30">
                {/* Header */}
                <div className="relative py-32 mb-12 bg-gray-900 overflow-hidden">
                    <div className="absolute inset-0">
                        <Image
                            src="/hero-tactical.png"
                            alt="Privacy Policy Header"
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
                            <span className="text-white font-bold">Privacy Policy</span>
                        </nav>

                        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6">
                            Privacy <span className="text-primary">Policy</span>
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
                                1. Information We Collect
                            </h2>
                            <p className="leading-relaxed">
                                At KnifeMaster, we collect information you provide directly to us, such as when you create an account, make a purchase, sign up for our newsletter, or contact us for support. This includes:
                            </p>
                            <ul className="list-disc list-inside space-y-2 ml-4 marker:text-primary">
                                <li>Name, email address, phone number, and shipping/billing address.</li>
                                <li>Payment information (processed securely by our payment processors).</li>
                                <li>Order history and preferences.</li>
                            </ul>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-white flex items-center">
                                <span className="w-1.5 h-6 bg-primary mr-3 rounded-full"></span>
                                2. How We Use Your Information
                            </h2>
                            <p className="leading-relaxed">
                                We use the collected information to:
                            </p>
                            <ul className="list-disc list-inside space-y-2 ml-4 marker:text-primary">
                                <li>Process and fulfill your orders.</li>
                                <li>Communicate with you about your order status.</li>
                                <li>Send you newsletters and promotional offers (if you opted in).</li>
                                <li>Improve our website and customer service.</li>
                                <li>Detect and prevent fraud.</li>
                            </ul>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-white flex items-center">
                                <span className="w-1.5 h-6 bg-primary mr-3 rounded-full"></span>
                                3. Information Sharing
                            </h2>
                            <p className="leading-relaxed">
                                We do not sell your personal information. We may share your data with trusted third parties who assist us in operating our website, conducting our business, or serving our users, so long as those parties agree to keep this information confidential.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-white flex items-center">
                                <span className="w-1.5 h-6 bg-primary mr-3 rounded-full"></span>
                                4. Security
                            </h2>
                            <p className="leading-relaxed">
                                We implement a variety of security measures to maintain the safety of your personal information. Your personal information is contained behind secured networks and is only accessible by a limited number of persons who have special access rights to such systems.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-white flex items-center">
                                <span className="w-1.5 h-6 bg-primary mr-3 rounded-full"></span>
                                5. Cookies
                            </h2>
                            <p className="leading-relaxed">
                                Yes, we use cookies to process the items in your shopping cart, understand and save your preferences for future visits, and compile aggregate data about site traffic and site interaction.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-white flex items-center">
                                <span className="w-1.5 h-6 bg-primary mr-3 rounded-full"></span>
                                6. Contact Us
                            </h2>
                            <p className="leading-relaxed">
                                If there are any questions regarding this privacy policy, you may contact us using the information below:
                            </p>
                            <p className="text-primary font-semibold">support@knifemaster.com</p>
                        </section>
                    </div>
                </div>
            </div>
            <Footer />
        </React.Fragment>
    );
}
