"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import {
  ArrowPathIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

export default function ReturnsExchanges() {
  const [activeTab, setActiveTab] = useState("returns");

  return (
    <React.Fragment>
      <Navbar />
      <div className="min-h-screen bg-black text-gray-300 font-sans selection:bg-primary/30">
        {/* Header */}
        <div className="relative py-32 mb-12 bg-gray-900 overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/hero-tactical.png"
              alt="Returns & Exchanges Header"
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
              <span className="text-white font-bold">Returns & Exchanges</span>
            </nav>

            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6">
              Hassle-Free <span className="text-primary">Returns</span>
            </h1>
            <p className="text-gray-300 max-w-2xl mx-auto text-lg">
              We stand behind our blades. If you're not 100% satisfied, we're
              here to make it right with our simple 30-day return policy.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {[
              {
                icon: ArrowPathIcon,
                title: "30-Day Window",
                desc: "For all unused items",
              },
              {
                icon: ShieldCheckIcon,
                title: "Easy Process",
                desc: "Hassle-free approvals",
              },
              {
                icon: CurrencyDollarIcon,
                title: "Full Refund",
                desc: "Back to original payment",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="group bg-gray-900/40 border border-gray-800 p-8 rounded-2xl hover:bg-gray-900/60 hover:border-primary/50 transition-all duration-300"
              >
                <item.icon className="w-10 h-10 text-primary mb-4 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="text-white font-bold text-lg uppercase tracking-wide mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex justify-center mb-12">
            <div className="bg-gray-900/50 p-1 rounded-xl border border-gray-800 inline-flex">
              {["returns", "exchanges"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-8 py-3 rounded-lg text-sm font-bold uppercase tracking-widest transition-all duration-300 ${
                    activeTab === tab
                      ? "bg-primary text-white shadow-lg shadow-primary/25"
                      : "text-gray-400 hover:text-white hover:bg-gray-800"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className="bg-gray-900/30 border border-gray-800 rounded-3xl p-8 md:p-12 backdrop-blur-sm">
            {activeTab === "returns" ? (
              <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="prose prose-invert max-w-none">
                  <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-6 flex items-center">
                    <span className="w-2 h-8 bg-primary rounded-full mr-4"></span>
                    Return Policy
                  </h2>
                  <p className="text-gray-400 text-lg leading-relaxed mb-8">
                    To be eligible for a return, your item must be in the same
                    condition that you received it, unworn or unused, with tags,
                    and in its original packaging. You'll also need the receipt
                    or proof of purchase.
                  </p>

                  <div className="grid md:grid-cols-2 gap-8 mb-8">
                    <div className="bg-black/40 p-6 rounded-xl border border-gray-800">
                      <h3 className="text-white font-bold mb-4 flex items-center">
                        <span className="text-green-500 mr-2">✓</span> Eligible
                        Items
                      </h3>
                      <ul className="space-y-3 text-gray-400">
                        <li>• Unused knives in original box</li>
                        <li>• Accessories with tags attached</li>
                        <li>• Defective or damaged goods</li>
                      </ul>
                    </div>
                    <div className="bg-black/40 p-6 rounded-xl border border-gray-800">
                      <h3 className="text-white font-bold mb-4 flex items-center">
                        <span className="text-red-500 mr-2">✕</span>{" "}
                        Non-Returnable
                      </h3>
                      <ul className="space-y-3 text-gray-400">
                        <li>• Personalized / Engraved items</li>
                        <li>• Clearance or Final Sale items</li>
                        <li>• Gift cards</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Steps */}
                <div>
                  <h3 className="text-2xl font-bold text-white uppercase tracking-wide mb-8">
                    Return Process
                  </h3>
                  <div className="grid md:grid-cols-3 gap-8">
                    {[
                      {
                        step: "01",
                        title: "Request Return",
                        desc: "Log in to your account or contact support to start.",
                      },
                      {
                        step: "02",
                        title: "Ship Item",
                        desc: "Pack securely and use the provided shipping label.",
                      },
                      {
                        step: "03",
                        title: "Get Refund",
                        desc: "Refund processed within 5-7 days of receipt.",
                      },
                    ].map((s) => (
                      <div key={s.step} className="relative">
                        <div className="text-6xl font-black text-gray-800/50 absolute -top-8 -left-4 select-none">
                          {s.step}
                        </div>
                        <div className="relative z-10">
                          <h4 className="text-white font-bold text-lg mb-2">
                            {s.title}
                          </h4>
                          <p className="text-gray-500 text-sm">{s.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div>
                  <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-6 flex items-center">
                    <span className="w-2 h-8 bg-primary rounded-full mr-4"></span>
                    Exchange Policy
                  </h2>
                  <p className="text-gray-400 text-lg leading-relaxed mb-8">
                    Need a different size or style? The fastest way to ensure
                    you get what you want is to return the item you have, and
                    once the return is accepted, make a separate purchase for
                    the new item.
                  </p>

                  <div className="bg-gradient-to-r from-primary/10 to-transparent border-l-4 border-primary p-6 rounded-r-xl mb-8">
                    <h4 className="text-white font-bold mb-2">
                      Free Exchanges
                    </h4>
                    <p className="text-gray-400 text-sm">
                      We cover return shipping costs for all exchanges on
                      defective items or shipping errors.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CTA */}
          <div className="mt-16 text-center">
            <h3 className="text-2xl font-bold text-white mb-6 uppercase tracking-wide">
              Ready to start?
            </h3>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-black font-bold uppercase tracking-widest rounded-lg hover:bg-gray-200 transition-all transform hover:scale-105"
              >
                Contact Support
              </Link>
              <button className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-primary to-red-700 text-white font-bold uppercase tracking-widest rounded-lg hover:shadow-lg hover:shadow-primary/40 transition-all transform hover:scale-105">
                Start Return
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </React.Fragment>
  );
}
