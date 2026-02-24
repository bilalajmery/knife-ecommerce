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
    <>
      <Navbar />

      <div className="min-h-screen bg-black text-gray-300 font-sans">
        {/* Header */}
        <div className="relative py-32 bg-gray-900 overflow-hidden">
          <Image
            src="/hero-tactical.png"
            alt="Returns & Exchanges"
            fill
            className="object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/90" />

          <div className="relative max-w-7xl mx-auto px-4 text-center">
            <nav className="text-sm text-gray-400 uppercase tracking-widest mb-6">
              <Link href="/" className="hover:text-primary">
                Home
              </Link>{" "}
              / <span className="text-white font-bold">Returns & Exchanges</span>
            </nav>

            <h1 className="text-4xl md:text-6xl font-black uppercase mb-6">
              Returns & <span className="text-primary">Exchanges</span>
            </h1>

            <p className="max-w-3xl mx-auto text-lg text-gray-300">
              At KnifeMasters, we stand behind the quality of our products and
              aim to ensure customer satisfaction. By placing an order with
              KnifeMasters, you agree to the terms outlined below.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto px-4 py-16">
          {/* Quick Info */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {[
              {
                icon: ArrowPathIcon,
                title: "7-Day Returns",
                desc: "Unused & unaltered items only",
              },
              {
                icon: ShieldCheckIcon,
                title: "48-Hour Defect Notice",
                desc: "For damaged or incorrect items",
              },
              {
                icon: CurrencyDollarIcon,
                title: "Secure Refunds",
                desc: "Original payment method",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-gray-900/40 border border-gray-800 p-8 rounded-2xl"
              >
                <item.icon className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-white font-bold uppercase mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex justify-center mb-12">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-1 inline-flex">
              {["returns", "exchanges"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-8 py-3 text-sm font-bold uppercase tracking-widest rounded-lg transition ${
                    activeTab === tab
                      ? "bg-primary text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* RETURNS */}
          {activeTab === "returns" && (
            <div className="space-y-12 bg-gray-900/30 border border-gray-800 rounded-3xl p-8 md:p-12">
              <section>
                <h2 className="text-3xl font-black uppercase text-white mb-4">
                  7-Day Satisfaction Returns
                </h2>
                <p className="text-gray-400 text-lg">
                  We accept returns within seven (7) days of delivery if the
                  customer is not fully satisfied with the product.
                </p>
              </section>

              <section className="grid md:grid-cols-2 gap-8">
                <div className="bg-black/40 p-6 rounded-xl border border-gray-800">
                  <h3 className="text-white font-bold mb-4">Conditions</h3>
                  <ul className="space-y-2 text-gray-400">
                    <li>• Item must be unused, unsharpened, and unaltered</li>
                    <li>• Original packaging and accessories included</li>
                    <li>• Customer pays all return shipping costs</li>
                    <li>• Original shipping fees are non-refundable</li>
                    <li>• Returns after 7 days will not be accepted</li>
                  </ul>
                </div>

                <div className="bg-black/40 p-6 rounded-xl border border-gray-800">
                  <h3 className="text-white font-bold mb-4">
                    Non-Returnable Items
                  </h3>
                  <ul className="space-y-2 text-gray-400">
                    <li>• Used or sharpened knives</li>
                    <li>• Custom or personalized knives</li>
                    <li>• Clearance or discounted items</li>
                    <li>• Gift cards</li>
                    <li>• Items damaged due to misuse</li>
                  </ul>
                </div>
              </section>

              <section>
                <h3 className="text-xl font-bold text-white mb-3">
                  Defective, Damaged, or Incorrect Items
                </h3>
                <ul className="space-y-2 text-gray-400">
                  <li>• Must be reported within 48 hours of delivery</li>
                  <li>• Photo or video evidence is required</li>
                  <li>• Original packaging images may be requested</li>
                  <li>
                    • If approved, KnifeMasters will repair, replace, exchange,
                    or refund
                  </li>
                  <li>
                    • KnifeMasters covers shipping for approved defect claims
                  </li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-bold text-white mb-3">
                  Return Authorization & Shipping
                </h3>
                <p className="text-gray-400">
                  All returns require prior authorization. Customers must use a
                  trackable shipping method. KnifeMasters is not responsible for
                  lost or damaged return shipments.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-bold text-white mb-3">Refunds</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>• Issued to the original payment method</li>
                  <li>• Processed after inspection of returned items</li>
                  <li>• Timing depends on payment provider</li>
                </ul>
              </section>
            </div>
          )}

          {/* EXCHANGES */}
          {activeTab === "exchanges" && (
            <div className="space-y-10 bg-gray-900/30 border border-gray-800 rounded-3xl p-8 md:p-12">
              <h2 className="text-3xl font-black uppercase text-white">
                Exchanges
              </h2>

              <ul className="space-y-3 text-gray-400">
                <li>• Exchanges are handled at KnifeMasters’ discretion</li>
                <li>
                  • Limited to the same item or item of equal value, subject to
                  availability
                </li>
                <li>
                  • Buyer’s remorse exchanges are not available after 7 days
                </li>
              </ul>

              <div className="bg-primary/10 border-l-4 border-primary p-6 rounded-xl">
                <p className="text-gray-300 text-sm">
                  Manufacturing defects are handled under our Warranty Policy.
                </p>
              </div>
            </div>
          )}

          {/* Legal */}
          <div className="mt-16 text-center text-gray-500 text-sm max-w-3xl mx-auto">
            Knives are inherently sharp tools. Customers are responsible for safe
            handling, storage, and use. This policy is governed by the laws of
            the State of New York.
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
