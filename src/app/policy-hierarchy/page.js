"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

export default function PrivacyPolicy() {
  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-black text-gray-300 font-sans selection:bg-primary/30">
        {/* Header */}
        <div className="relative py-32 mb-12 bg-gray-900 overflow-hidden">
          <Image
            src="/hero-tactical.png"
            alt="Policy Hierarchy Header"
            fill
            className="object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/80" />

          <div className="relative max-w-7xl mx-auto px-4 text-center">
            <nav className="flex justify-center items-center text-sm text-gray-400 mb-6 uppercase tracking-widest">
              <Link href="/" className="hover:text-primary">
                Home
              </Link>
              <span className="mx-3 text-gray-600">/</span>
              <span className="text-white font-bold">Policy Hierarchy</span>
            </nav>

            <h1 className="text-4xl md:text-6xl font-black uppercase mb-6">
              Policy <span className="text-primary">Hierarchy</span>
            </h1>
            <p className="text-gray-400 leading-relaxed max-w-xl text-lg mx-auto mb-4">
                This policy hierarchy determines which KnifeMasters policy applies to a
                customer issue and the timeframe governing it. If policies appear to
                overlap, follow the hierarchy below in order.
              </p>
            <p className="text-gray-300 text-lg">
              Effective Date: 01/01/2024
            </p>
          </div>
        </div>

       {/* Content */}
        <div className="max-w-5xl mx-auto px-4 pb-24">
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 space-y-10 backdrop-blur-sm">

            

            {/* 1 Warranty */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <span className="w-1.5 h-6 bg-primary mr-3 rounded-full" />
                1. Warranty Policy — Manufacturing Defects ONLY
              </h2>

              <p className="text-gray-400 font-semibold">Use when:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-400 marker:text-primary">
                <li>Defect in materials or workmanship</li>
                <li>Existed at the time of delivery</li>
                <li>Occurred under normal, intended use</li>
              </ul>

              <p className="text-gray-400">
                <span className="font-semibold text-white">Timeframe:</span> 30 days from delivery
              </p>

              <p className="text-gray-400 font-semibold">Not covered:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-400 marker:text-primary">
                <li>Shipping damage</li>
                <li>Missing or incorrect items</li>
                <li>Normal wear &amp; tear</li>
                <li>Misuse, sharpening, corrosion, or drops</li>
              </ul>

              <p className="text-primary font-semibold">
                ➡ If it’s a manufacturing defect → Warranty Policy applies
              </p>
            </section>

            {/* 2 Replacement */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <span className="w-1.5 h-6 bg-primary mr-3 rounded-full" />
                2. Replacement Order Policy — Shipping & Fulfillment Issues
              </h2>

              <p className="text-gray-400 font-semibold">Use when:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-400 marker:text-primary">
                <li>Item damaged in transit</li>
                <li>Item missing</li>
                <li>Wrong item shipped</li>
              </ul>

              <p className="text-gray-400">
                <span className="font-semibold text-white">Timeframe:</span> 48 hours from delivery
              </p>

              <p className="text-gray-400 font-semibold">Notes:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-400 marker:text-primary">
                <li>Photos or videos required</li>
                <li>Packaging images may be required</li>
                <li>Manufacturing defects are excluded</li>
              </ul>

              <p className="text-primary font-semibold">
                ➡ If it happened in transit → Replacement Policy applies
              </p>
            </section>

            {/* 3 Returns */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <span className="w-1.5 h-6 bg-primary mr-3 rounded-full" />
                3. Returns &amp; Exchange Policy — Buyer’s Remorse
              </h2>

              <p className="text-gray-400 font-semibold">Use when:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-400 marker:text-primary">
                <li>Customer changed their mind</li>
                <li>No defect or shipping issue exists</li>
              </ul>

              <p className="text-gray-400">
                <span className="font-semibold text-white">Timeframe:</span> 7 days from delivery
              </p>

              <p className="text-gray-400 font-semibold">Conditions:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-400 marker:text-primary">
                <li>Unused and unsharpened</li>
                <li>Original packaging required</li>
                <li>Customer pays return shipping</li>
              </ul>

              <p className="text-primary font-semibold">
                ➡ If customer doesn’t want it → Returns Policy applies
              </p>
            </section>

            {/* 4 Shipping */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <span className="w-1.5 h-6 bg-primary mr-3 rounded-full" />
                4. Shipping Policy — Carrier Issues
              </h2>

              <p className="text-gray-400 font-semibold">Use when:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-400 marker:text-primary">
                <li>Package marked delivered but not received</li>
                <li>Carrier delay or address error</li>
              </ul>

              <p className="text-gray-400 font-semibold">
                Key Rule:
              </p>
              <p className="text-gray-400">
                Risk of loss passes upon delivery to the shipping carrier.
              </p>

              <p className="text-primary font-semibold">
                ➡ If carrier is responsible → Shipping Policy applies
              </p>
            </section>

            {/* 5 Terms */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <span className="w-1.5 h-6 bg-primary mr-3 rounded-full" />
                5. Terms of Service — Escalations &amp; Disputes
              </h2>

              <p className="text-gray-400 font-semibold">Use when:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-400 marker:text-primary">
                <li>Chargebacks</li>
                <li>Legal threats</li>
                <li>Policy disputes</li>
              </ul>

              <p className="text-gray-400 font-semibold">Key Points:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-400 marker:text-primary">
                <li>Liability limited to purchase price</li>
                <li>Governing law: State of New York</li>
              </ul>

              <p className="text-primary font-semibold">
                ➡ If it escalates → Terms of Service govern
              </p>
            </section>

          </div>
        </div>

      </div>

      <Footer />
    </>
  );
}
