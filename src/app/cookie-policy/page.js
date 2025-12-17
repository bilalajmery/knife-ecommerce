"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

export default function CookiePolicy() {
    return (
        <React.Fragment>
            <Navbar />
            <div className="min-h-screen bg-black text-gray-300 font-sans selection:bg-primary/30">
                {/* Header */}
                <div className="relative py-32 mb-12 bg-gray-900 overflow-hidden">
                    <div className="absolute inset-0">
                        <Image
                            src="/hero-tactical.png"
                            alt="Cookie Policy Header"
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
                            <span className="text-white font-bold">Cookie Policy</span>
                        </nav>

                        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6">
                            Cookie <span className="text-primary">Policy</span>
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
                                1. What Are Cookies?
                            </h2>
                            <p className="leading-relaxed">
                                Cookies are small text files that are stored on your computer or mobile device when you visit a website. They allow the website to remember your actions and preferences (such as login, language, font size, and other display preferences) over a period of time.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-white flex items-center">
                                <span className="w-1.5 h-6 bg-primary mr-3 rounded-full"></span>
                                2. How We Use Cookies
                            </h2>
                            <p className="leading-relaxed">
                                We use cookies for several purposes:
                            </p>
                            <ul className="list-disc list-inside space-y-2 ml-4 marker:text-primary">
                                <li>
                                    <strong className="text-white">Essential Cookies:</strong> enable core functionality such as security, network management, and accessibility. You may disable these by changing your browser settings, but this may affect how the website functions.
                                </li>
                                <li>
                                    <strong className="text-white">Marketing Cookies:</strong> help us provide you with personalized ads and content based on your interests.
                                </li>
                                <li>
                                    <strong className="text-white">Analytics Cookies:</strong> help us understand how visitors interact with our website by collecting and reporting information anonymously.
                                </li>
                            </ul>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-white flex items-center">
                                <span className="w-1.5 h-6 bg-primary mr-3 rounded-full"></span>
                                3. Managing Cookies
                            </h2>
                            <p className="leading-relaxed">
                                Most web browsers automatically accept cookies, but you can usually modify your browser setting to decline cookies if you prefer. This may prevent you from taking full advantage of the website.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-white flex items-center">
                                <span className="w-1.5 h-6 bg-primary mr-3 rounded-full"></span>
                                4. Changes to This Policy
                            </h2>
                            <p className="leading-relaxed">
                                We may update our Cookie Policy from time to time. We encourage you to review this policy periodically for any changes.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
            <Footer />
        </React.Fragment>
    );
}
