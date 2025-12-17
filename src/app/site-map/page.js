"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

export default function Sitemap() {
    const sections = [
        {
            title: "Main",
            links: [
                { name: "Home", href: "/" },
                { name: "Shop All", href: "/shop" },
                { name: "About Us", href: "/about" },
                { name: "Contact Us", href: "/contact" },
            ]
        },
        {
            title: "Customer Service",
            links: [
                { name: "FAQ", href: "/faq" },
                { name: "Shipping Policy", href: "/shipping-policy" },
                { name: "Returns & Exchanges", href: "/returns-exchanges" },
                { name: "Warranty Hub", href: "/warranty-hub" },
                { name: "Track Your Order", href: "/track-order" },
            ]
        },
        {
            title: "Account",
            links: [
                { name: "Sign In", href: "/signin" },
                { name: "Sign Up", href: "/signup" },
                { name: "Cart", href: "/cart" },
                { name: "Wishlist", href: "/wishlist" },
            ]
        },
        {
            title: "Legal",
            links: [
                { name: "Privacy Policy", href: "/privacy-policy" },
                { name: "Terms of Service", href: "/terms-of-service" },
                { name: "Cookie Policy", href: "/cookie-policy" },
            ]
        }
    ];

    return (
        <React.Fragment>
            <Navbar />
            <div className="min-h-screen bg-black text-gray-300 font-sans selection:bg-primary/30">
                {/* Header */}
                <div className="relative py-32 mb-12 bg-gray-900 overflow-hidden">
                    <div className="absolute inset-0">
                        <Image
                            src="/hero-tactical.png"
                            alt="Sitemap Header"
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
                            <span className="text-white font-bold">Sitemap</span>
                        </nav>

                        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6">
                            Site <span className="text-primary">Map</span>
                        </h1>
                        <p className="text-gray-300 max-w-2xl mx-auto text-lg">
                            Navigate through all sections of KnifeMaster.
                        </p>
                    </div>
                </div>

                {/* Content */}
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {sections.map((section) => (
                            <div key={section.title} className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 hover:border-primary/50 transition-colors duration-300">
                                <h2 className="text-xl font-bold text-white mb-6 border-b border-gray-800 pb-2">
                                    {section.title}
                                </h2>
                                <ul className="space-y-3">
                                    {section.links.map((link) => (
                                        <li key={link.href}>
                                            <Link
                                                href={link.href}
                                                className="group flex items-center text-gray-400 hover:text-white transition-all duration-200"
                                            >
                                                <span className="w-1.5 h-1.5 bg-primary rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                                <span className="group-hover:translate-x-1 transition-transform">{link.name}</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <Footer />
        </React.Fragment>
    );
}
