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
            alt="Privacy Policy Header"
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
              <span className="text-white font-bold">Privacy Policy</span>
            </nav>

            <h1 className="text-4xl md:text-6xl font-black uppercase mb-6">
              Privacy <span className="text-primary">Policy</span>
            </h1>
            <p className="text-gray-300 text-lg">
              Effective Date: 01/01/2024
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-5xl mx-auto px-4 pb-24">
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 space-y-10 backdrop-blur-sm">

            {/* Intro */}
            <section className="space-y-4">
                <h2 className="text-2xl font-bold text-white flex items-center">
                <span className="w-1.5 h-6 bg-primary mr-3 rounded-full" />
                1. Introduction
              </h2>
              <p className="text-gray-400 leading-relaxed">
                KnifeMasters (“we,” “us,” or “our”) respects your privacy and is
                committed to protecting your personal information. This Privacy
                Policy explains how we collect, use, disclose, and safeguard
                your information when you visit or make a purchase from our
                website. By accessing or using our website, you agree to the
                terms of this Privacy Policy.
              </p>
            </section>

            {/* Information We Collect */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <span className="w-1.5 h-6 bg-primary mr-3 rounded-full" />
                2. Information We Collect
              </h2>

              <h3 className="text-lg font-semibold text-white">
                Personal Information
              </h3>
              <ul className="list-disc list-inside space-y-2 text-gray-400 marker:text-primary">
                <li>Full name</li>
                <li>Billing and shipping address</li>
                <li>Email address</li>
                <li>Phone number</li>
                <li>
                  Payment information (processed securely by third-party
                  providers; we do not store full payment details)
                </li>
              </ul>

              <h3 className="text-lg font-semibold text-white pt-4">
                Automatically Collected Information
              </h3>
              <ul className="list-disc list-inside space-y-2 text-gray-400 marker:text-primary">
                <li>IP address</li>
                <li>Browser type</li>
                <li>Device information</li>
                <li>Pages visited and time spent</li>
                <li>Referring website</li>
              </ul>

              <p className="text-gray-400">
                This information is collected through cookies, log files, and
                similar technologies.
              </p>
            </section>

            {/* How We Use Information */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <span className="w-1.5 h-6 bg-primary mr-3 rounded-full" />
                3. How We Use Your Information
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-400 marker:text-primary">
                <li>Process and fulfill orders</li>
                <li>Communicate about orders or inquiries</li>
                <li>Provide customer support</li>
                <li>Improve our website and services</li>
                <li>Prevent fraud and unauthorized transactions</li>
                <li>Comply with legal obligations</li>
              </ul>
              <p className="text-gray-400 font-semibold">
                We do not sell or rent your personal information.
              </p>
            </section>

            {/* Sharing */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <span className="w-1.5 h-6 bg-primary mr-3 rounded-full" />
                4. Sharing Your Information
              </h2>
              <p className="text-gray-400">
                We may share your information with trusted third parties only as
                necessary to operate our business, including:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-400 marker:text-primary">
                <li>Payment processors (e.g., Stripe, PayPal)</li>
                <li>Shipping carriers (USPS, UPS, FedEx)</li>
                <li>Website hosting and e-commerce platforms</li>
                <li>Analytics providers</li>
              </ul>
            </section>

            {/* Cookies */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <span className="w-1.5 h-6 bg-primary mr-3 rounded-full" />
                5. Cookies & Tracking Technologies
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-400 marker:text-primary">
                <li>Enable core website functionality</li>
                <li>Analyze site traffic and usage</li>
                <li>Improve user experience</li>
              </ul>
              <p className="text-gray-400">
                You may disable cookies through your browser settings, though
                some features may not function properly.
              </p>
            </section>

            {/* Security */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <span className="w-1.5 h-6 bg-primary mr-3 rounded-full" />
                6. Data Security
              </h2>
              <p className="text-gray-400">
                We implement reasonable administrative, technical, and physical
                safeguards to protect your personal information. However, no
                method of transmission over the internet is 100% secure.
              </p>
            </section>

            {/* Retention */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <span className="w-1.5 h-6 bg-primary mr-3 rounded-full" />
                7. Data Retention
              </h2>
              <p className="text-gray-400">
                We retain personal information only as long as necessary to
                fulfill business, legal, tax, or compliance obligations.
              </p>
            </section>

            {/* Rights */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <span className="w-1.5 h-6 bg-primary mr-3 rounded-full" />
                8. Your Rights
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-400 marker:text-primary">
                <li>Access personal information</li>
                <li>Request corrections</li>
                <li>Request deletion (subject to legal requirements)</li>
              </ul>
            </section>

            {/* Children */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <span className="w-1.5 h-6 bg-primary mr-3 rounded-full" />
                9. Children’s Privacy
              </h2>
              <p className="text-gray-400">
                KnifeMasters does not knowingly collect information from
                individuals under the age of 18.
              </p>
            </section>

            {/* Legal */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <span className="w-1.5 h-6 bg-primary mr-3 rounded-full" />
                10. Governing Law
              </h2>
              <p className="text-gray-400">
                This Privacy Policy is governed by the laws of the State of New
                York.
              </p>
            </section>

          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
