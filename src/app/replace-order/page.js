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
            alt="Replacement Order Header"
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
              <span className="text-white font-bold">Replacement Order Policy</span>
            </nav>

            <h1 className="text-4xl md:text-6xl font-black uppercase mb-6">
              Replacement <span className="text-primary block mt-1">Order Policy</span>
            </h1>
            
            <p className="text-gray-300 text-lg">
              Effective Date: 01/01/2024
            </p>
          </div>
        </div>

     
        {/* Content */}
        <div className="max-w-5xl mx-auto px-4 pb-24">
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 space-y-12 backdrop-blur-sm">

            {/* Replacement Eligibility */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <span className="w-1.5 h-6 bg-primary mr-3 rounded-full" />
                Replacement Eligibility
              </h2>

              <p className="text-gray-400 leading-relaxed">
                Replacement orders may be issued solely at the discretion of KnifeMasters
                under the circumstances outlined below.
              </p>

              <h3 className="text-lg font-medium text-white">Damaged Upon Arrival</h3>
              <p className="text-gray-400">
                The product arrives broken, cracked, bent, or otherwise physically damaged
                as a result of shipping or handling during transit.
              </p>

              <h3 className="text-lg font-medium text-white pt-4">
                Incorrect or Missing Item
              </h3>
              <ul className="list-disc list-inside space-y-2 text-gray-400 marker:text-primary">
                <li>An incorrect item was shipped</li>
                <li>An item listed on the order confirmation is missing from the shipment</li>
              </ul>

              <p className="text-gray-400 font-semibold pt-4">
                Manufacturing defects are not covered under this policy and must be
                submitted as a warranty claim pursuant to our Warranty Policy.
              </p>
            </section>

            {/* Reporting Requirements */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <span className="w-1.5 h-6 bg-primary mr-3 rounded-full" />
                Reporting Requirements
              </h2>

              <p className="text-gray-400">
                To be eligible for a replacement, customers must:
              </p>

              <ul className="list-disc list-inside space-y-2 text-gray-400 marker:text-primary">
                <li>Notify KnifeMasters within forty-eight (48) hours of delivery</li>
                <li>Provide the order number</li>
                <li>Submit clear photographic or video evidence of the issue</li>
                <li>
                  Provide images of the original packaging, including the shipping label,
                  if applicable
                </li>
              </ul>

              <p className="text-primary font-semibold">
                Failure to meet these requirements voids eligibility for replacement.
              </p>
            </section>

            {/* Exclusions */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <span className="w-1.5 h-6 bg-primary mr-3 rounded-full" />
                Exclusions (Non-Eligible Claims)
              </h2>

              <p className="text-gray-400">
                Replacements will not be issued for:
              </p>

              <ul className="list-disc list-inside space-y-2 text-gray-400 marker:text-primary">
                <li>Manufacturing defects (see Warranty Policy)</li>
                <li>Normal wear and tear</li>
                <li>
                  Damage caused by misuse, abuse, negligence, improper handling,
                  sharpening, modification, or improper storage
                </li>
                <li>Accidental damage occurring after delivery</li>
                <li>
                  Cosmetic variations due to natural materials (wood, horn, handmade
                  finishes)
                </li>
                <li>Customer preference changes or buyer’s remorse</li>
                <li>
                  Third-party damage occurring after carrier delivery confirmation,
                  including theft or loss
                </li>
              </ul>
            </section>

            {/* Return of Items */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <span className="w-1.5 h-6 bg-primary mr-3 rounded-full" />
                Return of Damaged or Incorrect Product
              </h2>

              <ul className="list-disc list-inside space-y-2 text-gray-400 marker:text-primary">
                <li>
                  KnifeMasters may require the item to be returned prior to issuing a
                  replacement
                </li>
                <li>Items returned without authorization may be refused</li>
                <li>Returned items must use a trackable shipping method</li>
                <li>
                  Failure to follow return instructions may result in denial of
                  replacement
                </li>
              </ul>
            </section>

            {/* Replacement Fulfillment */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <span className="w-1.5 h-6 bg-primary mr-3 rounded-full" />
                Replacement Fulfillment
              </h2>

              <ul className="list-disc list-inside space-y-2 text-gray-400 marker:text-primary">
                <li>
                  Approved replacements are shipped at no additional cost unless stated
                  otherwise
                </li>
                <li>Processing times may vary based on product availability</li>
                <li>
                  Replacement items may differ slightly due to natural material
                  variation
                </li>
              </ul>
            </section>

            {/* Out of Stock */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <span className="w-1.5 h-6 bg-primary mr-3 rounded-full" />
                Out-of-Stock or Discontinued Items
              </h2>

              <p className="text-gray-400">
                If a replacement item is unavailable, KnifeMasters may, at its
                discretion:
              </p>

              <ul className="list-disc list-inside space-y-2 text-gray-400 marker:text-primary">
                <li>Issue a refund</li>
                <li>Provide store credit</li>
                <li>Offer a comparable item of equal value</li>
              </ul>
            </section>

            {/* Liability */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <span className="w-1.5 h-6 bg-primary mr-3 rounded-full" />
                Limitation of Liability
              </h2>

              <ul className="list-disc list-inside space-y-2 text-gray-400 marker:text-primary">
                <li>Indirect, incidental, or consequential damages</li>
                <li>
                  Personal injury, property damage, or loss from improper or unintended
                  use
                </li>
                <li>Damages exceeding the original purchase price</li>
              </ul>

              <p className="text-gray-400 font-semibold">
                KnifeMasters reserves the right to issue a replacement, refund, store
                credit, or comparable item at its sole discretion in accordance with this
                policy and our Returns &amp; Exchange Policy.
              </p>
            </section>

          </div>
        </div>


      </div>

      <Footer />
    </>
  );
}
